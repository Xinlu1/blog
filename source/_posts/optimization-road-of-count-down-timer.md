---
title: 论一个倒计时器的性能优化之路
date: 2018-05-25 21:40:05
tags:
- optimization
- counter
- react
- javascript
---

回顾这半年，扛需求能力越来越强，业务代码也是越写越多。但稍一回顾这些为了满足当时快速上线所码的东西，问题其实还是不少。这次就从一个简单的计时器说起。

## 现状

### 表现

倒计时器所在的页面其主要内容是一个活动列表，列表中每一项都是一个促销活动的入口，而倒计时器就存在于活动画面的左上方，提醒用户该活动还有多久结束，如下动图所示（测试设备 SONY E5663，后同）。

![original-state](https://user-images.githubusercontent.com/8896124/40551893-be27ce72-6070-11e8-9f13-4d6aaf162056.gif)



当页面滑动时，可以明显看到计时器是停止的状态，也就说页面并没有刷新，直到松手后又过了一两秒才重新开始计时，且依然不稳定，中间卡顿了一到两秒。

笔者此时特意去后台看了近一个月的 PV 和 UV 数据，虽说不多，但还是有一批固定用户每天访问此页面。虽说测试设备的性能非常弱，换 PC 模拟器以及 17 年的旗舰手机后表现好很多，但我们无法挑选客户的访问设备，只能从技术角度优化页面性能，尽量提升客户体验。BTW，这台 SONY 测试手机就是东南亚的业务方同学提供的，应该是用户常用机型之一。

### 分析

这段代码逻辑抽象一下大概长这个样子，简单概括就是使用 `setInterval` 方法定时去更新 React 组件的状态以实现倒数时间的刷新：

```javascript
/* Original version */
componentWillMount() {
  if (!this.timer) {
    this.timer = setInterval(() => {
      const toUpdate = Object.assign({}, this.state.list);
      if (toUpdate.length) {
        update.forEach(i => {
          i.registerLeftTime = Tools.getLastTime(i.registerEndTime);
        });
        this.setState({ list: toUpdate });
      }
    }, 1000);
  }
}
```

其实贴出这么一段槽点满满的代码是需要勇气的，这特么居然是我写的？

![否认三连](https://www.xp510.com/uploadfile/2018/0112/20180112094215252.jpg)

那么开始分（tu）析（cao）吧，让我们自上而下依次盘点：

1. 这段逻辑代码放在 `componentDidMount()` 阶段执行更为合适，原因有两个。一是在 `componentWillMount()` 阶段还未插入真实的 DOM，此时就开始定时更新数据没有什么意义；二是 React 的 Reconciliation 算法以及目前最新的 Fiber 调度器算法会对渲染的开始或停止过程进行优化，例如合并几次渲染过程为一次，这样将导致 `componentWillMount()` 可能被频繁调用，因此将定时器初始化的逻辑放在这里并不合适。
2. 每次更新完数据后触发都要触发一次重新渲染，这无疑大大加重了性能开销，当遇到实时显示需求且运算量较大时，低性能的手机就跪了。
3. 这样计时真的准吗？例如 `setInterval()` 函数的精准性，又例如 `this.setState()` 的使用。

顺着这几个思路，赶紧来改代码吧！

## 提升更新效率

### 更新效率有多慢？

首先花几秒钟把这段代码挪到 `componentDidMount()` 钩子里。

接下来，既然电脑模拟器上没问题，但手机跑着卡，可以做个有趣的小对比，看看 PC 和手机的性能差距。使用 `performance.now()` 测量更新一次时间所花费的时间，示例代码如下：

```javascript
/* First version, add profile */
componentDidMount() {
  if (!this.timer) {
    this.timer = setInterval(() => {
      const startT = performance.now();
      const toUpdate = Object.assign({}, this.state.list);
      if (toUpdate.length) {
        toUpdate.forEach(i => {
          i.registerLeftTime = Tools.getLastTime(i.registerEndTime);
        });
        this.setState({ list: toUpdate }, ()=>{
		  const endT = performance.now();
          console.log('Actually end:')
          console.log(endT - startT);
        });
        const seemsEndT = performance.now();
        console.log('Seems end:');
        console.log(seemsEndT - startT);
      }
    }, 1000);
  }
}
```

可以看到测试机与 PC 模拟器的性能差了十倍左右，并且测试机的运算速度波动更大（下方上图为模拟器数据，下图为测试机数据）：

<img width="731" alt="1st-pc" src="https://user-images.githubusercontent.com/8896124/40605519-3cda4120-6295-11e8-86ee-8715f8113de0.png">

<img width="845" alt="1st-mobile" src="https://user-images.githubusercontent.com/8896124/40617203-3ad37632-62c0-11e8-96c1-de164748844d.png">

其实做时间打点时就能发现一件事，使用的 `setState()` 方法本身并不保证同步渲染更新，尽管时序看上去是同步的。

重点是，整个更新渲染的时间非常长，即使降低到 30Hz 的流畅画面要求，一帧也只有 33 毫秒可用，还不是我们的业务代码独享。 之所以慢，是因为调用一次 `setState()` 方法会引起 React 更新生命周期的 4 个函数，`shouldComponentUpdate()`、`componentWillUpdate()`、`render()`、`componentDidUpdate()` 将依次被调用（如下图所示）。

![react-life-cycle](https://user-images.githubusercontent.com/8896124/40606279-7065c4d6-6297-11e8-9379-c0a29b9c799b.png)

[^图片来源]: https://medium.com/@joseph_bug/day13-react-lifecycle-%E4%B8%8D%E6%90%9E%E6%87%82%E5%B0%B1%E6%8E%B0%E4%BA%86-559d927b454e

### 直接撸 DOM，要啥 jQuery

干掉 `setState()` ，这里用最简单粗暴也是高效的方法，直接更新 DOM 接口的 HTML 值：

```javascript
/* Second version, operate DOM directly instead of setState() */
componentDidMount() {
  if (!this.timer) {
    this.timer = setInterval(() => {
      const startT = performance.now();
      const toUpdate = Object.assign({}, this.state.list);
      if (toUpdate.length) {
        const nodes = document.querySelectorAll('.scene-end-time>span');
        toUpdate.forEach(i => {
          i.registerLeftTime = Tools.getLastTime(i.registerEndTime);
          nodes[index].innerHTML = item.registerLeftTime;
        });
        const endT = performance.now();
        console.log(seemsEndT - startT);
      }
    }, 1000);
  }
}
```

PC 模拟器上更新时间缩短至了 0.3 毫秒，比之前快了十几到二十几倍，再来看看测试机的情况，数据看起来漂亮很多！再滑几下看看，美滋滋！

<img width="935" alt="2nd-mobile" src="https://user-images.githubusercontent.com/8896124/40607869-4b8d8054-629c-11e8-8c1d-1f8fd8f3b8e7.png">

![remove-setstate](https://user-images.githubusercontent.com/8896124/40608376-db5922be-629d-11e8-87c2-d007eea204cd.gif)

## 校准更新策略

定时器最重要的就是确保时间准确，如果时间都不准了，那也可以洗洗睡了。除去与服务端同步校时之类的方法，还是继续讨论如何在 Web 前端力求计时准确。

### 并不精准的 `setInterval()`

除了上述提到的 `setState()` 是非同步方法已经修复，最明显的问题莫过于 `setInterval()` 的使用。关于定时任务，不少小伙伴第一反应想到的也是 `setTimeout()` 和 `setInterval()` 方法，但是它们真的足够精确吗？这就要从 JS 的任务及微任务队列（也有称 macrotask queue 和 microtask queue）说起了...

咳咳，我们言简意赅总结下：JS 主线程时有一个栈存储运行时的函数相关变量，遇到函数时会先入栈执行完后再出栈（废话）。当遇到 `setTimeout()` `setInterval()`  `requestAnimationFrame()` 以及 I/O 操作时，这些函数会立刻返回一个值如 `setInterval()` 返回一个 `intervalID`，使得主线程继续执行下去，而异步操作则由浏览器其他线程维护。当异步操作完成时，浏览器会将其回调函数插入主线程的任务队列中，当主线程执行完当前栈的逻辑后，才会依次执行任务队列中的任务。

但是在每个任务之间，还有一个 microtask queue 的存在，在当前任务执行完之后，立即执行 microtask queue 中的所有任务，例如 `promise.then()` `process.nextTick()` 等操作。也就是说当 `setInterval(fn, 1000)` 等待 1 秒，`fn` 函数插入任务队列后，并不一定会被马上执行，还需要等待当前任务以及 microtask queue 中的所有任务执行完。长此以往，使用 `setInterval()` 的计时器超时会越来越久。

如果有毅力可以看看[权威的 HTML 标准文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)，没有耐心可以看看这个动图简单感受一下原理。

![event-loop-demo](https://user-images.githubusercontent.com/8896124/40614225-8f267844-62b4-11e8-87d0-835bf5838432.gif)

所以回归正题，不用 `setInterval()` 那用啥？

### 天王盖地虎，我有 `rAF`

解铃还须系铃人，既然我们的代码执行时间在主线程中无法得到保证，那么还是要从更高抽象层级的浏览器中申请权限。目前主流浏览器已经提供了一个重绘前执行动画相关函数的接口 `requestAnimationFrame()`，用来更新计时器再合适不过。改造代码如下：

```javascript
/* Third version, use rAF instead of setInterval */
componentDidMount() {
  let lastTime = null;
  function __updateCountDownTimer(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const tickInterval = timestamp - lastTime;
    if (tickInterval >= 1000) {
      const toUpdate = Object.assign({}, this.state.list);
      if (toUpdate.length) {
        const nodes = document.querySelectorAll('.scene-end-time>span');
        toUpdate.forEach((item, index) => {
          item.registerLeftTime = Tools.getLastTime(item.registerEndTime);
          nodes[index].innerHTML = item.registerLeftTime;
        }
      }
      lastTime = timestamp;
    }
    requestAnimationFrame(_updateCountDownTimer.bind(this));
  }
  if (!this.timer) {
    this.timer = requestAnimationFrame(__updateCountDownTimer.bind(this));
  }
}
```

那么这段代码实际上够精确了吗？打印出每次触发更新逻辑的时间戳瞅瞅（下方上图为模拟器数据，下图为测试机数据）。

<img width="758" alt="3rd-pc" src="https://user-images.githubusercontent.com/8896124/40616293-1d4f3e0a-62bd-11e8-9717-c2de2311d4f8.png">
<img width="870" alt="3rd-mobile" src="https://user-images.githubusercontent.com/8896124/40616294-1e23cf94-62bd-11e8-9586-feae410f751b.png">

可以看到 PC 模拟器上已经相当精准，每秒的误差在 0.15 毫秒左右，也就是将近 2 小时有 1 秒的误差，笔者觉得完全可以接受。不过测试机上的误差就有点大了，每秒的误差在 10 毫秒左右，虽然笔者觉得也可以接受（很少有人会在活动页停留很久），但是本着精益求精的态度，是否还能优化呢？

好奇心使笔者打印出了测试机调用 `rAF()` 的时间间隔，绝大多数间隔在 16.6 毫秒左右，代表了手机 webview 也是 60Hz 的刷新频率；也存在少数间隔时间远超上述刷新时间，达到了 30 ~ 70 毫秒，如果滑动操作可能会超过 100 毫秒。不得不说，测试机就要挑这么烂的 Orz...

### 正向反馈拯救采样频率

上文说道，测试机上的计时误差本质是采样频率并未一直满足 60Hz，当某一次采样时间超过 16.6 毫秒且刚好需要刷新时间时，就会产生误差。同时每次误差都是超时而非提前，这样就在延时的道路上越走越远了。

那么反过来思考，每当触发更新事件时，扣除目前超过 1 秒的误差，补偿到下一次计时中，肯定能减缓误差扩大速度。代码如下：

```javascript
/* Fourth version, use rAF instead of setInterval */
componentDidMount() {
  let lastTime = null;
  function __updateCountDownTimer(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const tickInterval = timestamp - lastTime;
    if (tickInterval >= 1000) {
      const toUpdate = Object.assign({}, this.state.list);
      if (toUpdate.length) {
        const nodes = document.querySelectorAll('.scene-end-time>span');
        toUpdate.forEach((item, index) => {
          item.registerLeftTime = Tools.getLastTime(item.registerEndTime);
          nodes[index].innerHTML = item.registerLeftTime;
        }
      }
      lastTime = timestamp + (tickInterval - 1000);
    }
    requestAnimationFrame(_updateCountDownTimer.bind(this));
  }
  if (!this.timer) {
    this.timer = requestAnimationFrame(__updateCountDownTimer.bind(this));
  }
}
```

观察测试手机打印的时间，发现此法完全是可行的。当超时间隔超过正常的刷新频率 16.6 毫秒时（赶上了下一次采样窗口），就会被校正一次。相比手机上每隔两三秒校正一次，PC 模拟器的采样时间变化显得尤为明显，最后与大家分享。

```javascript
1685.99, 2686.13, 3686.27, 4686.410000000001, 5719.888, 6686.69, 7686.83, 8686.970000000001, 9687.11, 10687.443, 11687.583, 12687.723, 13687.863, 14688.003, 15688.143, 16688.283, 17688.423, 18688.563, 19688.703, 20688.842999999997, 21689.214, 22689.354000000003, 23689.494, 24689.634000000002, 25689.774, 26689.914, 27690.054, 28690.194000000003, 29690.334, 30690.474, 31690.863, 32691.003, 33691.143, 34691.282999999996, 35691.423, 36691.563, 37691.702999999994, 38691.843, 39691.983, 40692.123, 41692.473, 42692.613000000005, 43692.753000000004, 44692.893, 45693.033, 46693.173, 47693.313, 48693.453, 49693.593, 50693.733, 51694.159, 52694.299, 53694.439000000006, 54694.579, 55694.719, 56694.859000000004, 57694.999, 58695.138999999996, 59695.279, 60695.419, 61712.443, 62695.914000000004, 63696.054, 64696.194, 65696.33399999999, 66696.474, 67696.614, 68696.754, 69696.894, 70697.034, 71697.423, 72697.56300000001, 73697.70300000001, 74697.84300000001, 75697.983, 76698.12299999999, 77698.26299999999, 78698.403, 79698.543, 80698.683, 81699.02399999999, 82699.16399999999, 83699.304, 84699.444, 85699.584, 86699.724, 87699.864, 88700.004, 89700.144, 90700.284, 91700.424, 92700.781, 93700.92099999999, 94701.061, 95701.201, 96701.341, 97701.481, 98701.621, 99701.761, 100701.90100000001, 101702.041, 102702.426, 103685.897, 104686.037, ...
```



## Reference

- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [How does a single thread handle asynchronous code in JavaScript?](https://www.quora.com/How-does-a-single-thread-handle-asynchronous-code-in-JavaScript)
- [HTML Living Standard — Last Updated 25 May 2018](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)
- [window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)