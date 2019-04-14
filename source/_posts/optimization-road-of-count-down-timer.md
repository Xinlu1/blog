---
title: 论一个倒计时器的性能优化之路
date: 2018-05-25 21:40:05
updated: 2018-05-29 00:00:00
categories:
- Web 前端
tags:
- optimization
- counter
- react
- javascript
---



## 引子

回顾这半年，扛需求能力越来越强，业务代码也是越写越多。但稍一认真看看这些当时为了满足快速上线所码的东西，问题其实还是不少。这次就从一个简单的计时器说起。
<!-- more -->

## 现状

### 问题很明显

倒计时器组件在一个活动列表页面里被使用，列表中每一项都是一个促销活动入口。倒计时器位于每个活动区块的左上方，提醒用户该活动还有多久结束，如下动图所示（测试设备 SONY E5663，后同）。

![](https://wa4vlg.bn.files.1drv.com/y4mZVE-fw1i9bD_kBAmIyIwXmUob3Nr05qg1YjPF0X-lSiHJc4LkQFxRvsKRz97Q2Ka66a8BQAv7uXaVGgw-BEsRSXgD3KQy7vdxPBlRtcjplbb8EvTgCphRslC6C7LY-Fi9ipADd3BzZ_oTGQnJlXQowA0Sdniyq5dyYsTMP0Ppu8zje6DNccDiArViYnj7vcL8a5R_Xm43nk4mkExYUuJuQ)

当页面滑动时，可以明显看到计时器停止，这意味着页面并没有刷新。直到松手后一两秒才恢复计时，且不稳定，又卡顿了一到两秒。

如此明显的问题吓得笔者赶紧去后台查阅了该页面 PV 和 UV 数据，虽说不多，但还是有一批忠实用户每天访问，这可怎么对得起我们的衣食父母...！即便测试用的设备性能羸弱，更换 Chrome 模拟器以及 17 年的安卓旗舰机再次测试并未出现如此卡顿现象，但我们无法挑选客户使用的设备，只能从技术角度解决问题，尽量提升用户体验。BTW，这台 SONY 测试机就是由东南亚的业务方同学提供，应该是当地用户的常用机型之一。

### 打脸与自我打脸

倒计时器组件的更新逻辑抽象如下，简单概括就是使用 `setInterval` 定时更新 React 组件的状态以实现倒数时间的更新：

```javascript
/* Original version */
componentWillMount() {
  if (!this.timer) {
    this.timer = setInterval(() => {
      const toUpdate = this.state.list.slice();
      if (toUpdate.length) {
        update.forEach(i => {
          i.leftTime = Tools.getLastTime(i.endTime);
        });
        this.setState({ list: toUpdate });
      }
    }, 1000);
  }
}
```

不得不说，贴出这么一段槽点满满的代码是极其需要勇气的，这...居然是我写的？

![](https://wa4xlg.bn.files.1drv.com/y4mGDo6NnUlyo6Ta4BeRYmuW5hyO2xvGEglK6as5epLMdQsvtnX_1M6GnuNAapBHNHScn4T3QyDyMo3A6OpMKTYSkKjOijyJIDAVktpNRKFnHncIYnW1XOgSzNNvEEjDfwbIxI5jgaWwKdzgbhX51EUU_clFjpZhjmSJVJp_SpH91E5DvG_nSxu3RferNzBBzeccGryqCzSN3dKscCpskG8Vg)

那么开始分（tu）析（cao）吧，让我们自上而下依次盘点：

1. 这段逻辑代码放在 `componentWillMount` 生命周期钩子里执行并不合适，其因有二：在 `componentWillMount` 阶段还未加载真实的 DOM 节点，此时就开始更新数据没有什么意义；React 的 Reconciliation 算法以及目前最新的 Fiber 调度器算法会对渲染的开始或停止过程进行优化，例如合并几次渲染过程为一次，这可能会导致 `componentWillMount` 被频繁调用。
2. 每次更新数据后都将触发一次渲染 SOP，这无疑加大了性能开销。当动画刷新遇上大量运算，一首《凉凉》送给低端手机。
3. 这样计时方式真的准吗？例如 `setInterval` 的精准性，又例如 `setState` 方法的使用。

顺着这个思路，赶紧来改代码吧！

## 提升更新效率

### 更新速度有多慢？

首先花几秒钟把这段代码挪到 `componentDidMount()` 钩子里。

接下来，既然页面在 MBP 的 Chrome 模拟器上访问没有问题，那么可以做个简单的对比实验，看看手机与笔记本模拟器的性能差距。使用 `performance.now` 测量更新一次所花费的时间，示例代码如下：

```javascript
/* First version, profile the performance */
componentDidMount() {
  if (!this.timer) {
    this.timer = setInterval(() => {
      const startT = performance.now();
      const toUpdate = this.state.list.slice();
      if (toUpdate.length) {
        toUpdate.forEach(i => {
          i.leftTime = Tools.getLastTime(i.endTime);
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

从下方两张截图可以看到测试机与模拟器的性能相差十倍左右，且测试机的运算时间波动较大（下方上图为模拟器数据，下图为测试机数据）：

![模拟器数据](https://wa4wlg.bn.files.1drv.com/y4m_2AunQuSGHxfUfucsT63rQWJC6lxKFUImyV4Fg1ItlV7KgbP3GKFP_rbZsbsOFoIFnk4UNn9a--ROa-FKuu8IXsa3H65sSUv3vD935DAsjvnRaiB16PTMR-kfqYBbbuCC1VzlRWGkoXWyezIH84a0hdgLO75iOFMi1Ims6NcPqaUVot0br01sfXnpJ1uHP1fiAyBCWr4GNdcNqB_xTGONw)

![测试机数据](https://wa4ulg.bn.files.1drv.com/y4mTKOcKn5J034yunDQU3rensrbOB8Loba_2riPbNj-0ggpCgeGiAyWQj4zCDgIOIxuzCiYFFQgJyg224ON7LKdjk3F0HnRVpmupohV-6iUjtTnIpbb0lACPf1l1ljvnNUl-cH7qGDB7lfG2hA5xZAYkmsCvdZEogstwLUDKaBzGoCtPYRCidYRUu5effnpEs61raVdT3R_a7XhTbwkY0HxTQ)

其实上面的埋点代码添加在 `setState` 的回调函数里，就明显能说明一个问题：`setState` 方法并不保证同步渲染更新，尽管截图中的时序看上去是同步的。

重点是，整个更新渲染的周期非常长，即使降低至 30Hz 的流畅画面要求，一帧可用的渲染时间也只有不到 34 毫秒，还不是业务代码独享！ 之所以渲染速度慢，是因为调用一次 `setState` 方法会依次执行 React 生命周期中的 4 个函数：`shouldComponentUpdate`、`componentWillUpdate`、`render` 和 `componentDidUpdate` （如下图所示）。

![Source: https://bit.ly/2Pb6sn5](https://wa4tlg.bn.files.1drv.com/y4mH5wzx6FvvX4Ivw12vqJacZkkN7Lj-Ukqp1Pmgp47MIBZNoIl2NVYcHcICpllBTZ52bc4jHTSO1zj1149_lSExWuB-j-oDQTanr1LsNfIbzWKX3GbI5EgQuDRovuQB9sD1GM67ny_Rk5p1tHRKXgRHr5--qxxZ3UDwXOP0wTFrRgbjFAzoO1lc8YV5WsbykbDQ4HjI8LmqfNJZCJdRkuPYA)

### 直接撸 DOM，要啥 jQuery

为了性能，这里采用最为简单粗暴的方法，直接更新 DOM 节点的 HTML 值：

```javascript
/* Second version, operate DOM directly instead of setState() */
componentDidMount() {
  if (!this.timer) {
    this.timer = setInterval(() => {
      const startT = performance.now();
      const toUpdate = this.state.list.slice();
      if (toUpdate.length) {
        const nodes = document.querySelectorAll('.count-down-timer');
        toUpdate.forEach(i => {
          i.leftTime = Tools.getLastTime(i.endTime);
          nodes[index].innerHTML = item.registerLeftTime;
        });
        const endT = performance.now();
        console.log(seemsEndT - startT);
      }
    }, 1000);
  }
}
```

让我们来看看效果如何：模拟器上的更新时间缩短至 0.3 毫秒，比之前快了十几到二十几倍；测试机的数据也漂亮多了（如下图），再滑几下试试... 美滋滋！

![](https://uk63cg.bn.files.1drv.com/y4mqJ8C6KonIi1uAISi4pEmOOwNdU8v65SRIRhNXt1JFz__hBhTyWthddLBjDNsFa_7nON7ee1lemoqa-fVSfzAjfHDLI20DNVswyDt1Tqb-lIDygnV2o4EnKoirhN4zT0-GldtJZSl4wGkQFia1bSdpo4obitIpE68skhikurHQIOXmfcf6_1dlWqN951ETFmxhr9tqb6WzAkHsbJXUSmHMw)

![](https://uk62cg.bn.files.1drv.com/y4mmLDLLxMSz-HbaSGM708E-mDIWxfBVX8pOgMg2v0g6fwb5btM1rx3FXLt5_h5G0g-eeaaHoeR4pHg0dC0VSgG9ZMEBTpX5qMfQ8MPygAioKa2JKG-r-wUa4GCtq_bVOCvhYudySc3ncVfHyh3OWYpUM3maBiV2c8oaokRyH_ijMV7oIbEtvOJm9izrFJZdR2XSLqrWnyIg-75hMXRCFUjSA)

## 更好的更新策略

定时器最重要的功能就是确保时间准确，如果时间都不准了，那也就该洗洗睡了。除去与服务端同步校时之类的方案，还是继续讨论如何在 Web 前端领域力求计时准确。

### 并不精准的 `setInterval`

在修复前文提到的 `setState` 缺陷之后，最明显的问题莫过于 `setInterval` 的使用。写一个定时任务，不少小伙伴第一反应想到的也是 `setTimeout` 和 `setInterval` 函数，但是它们真的足够精确吗？这就要从 JS 的**任务队列**及**微任务队列**（也有称 **macrotask queue** 和 **microtask queue**）说起了...

咳咳，我们言简意赅总结下：JS 主线程执行时有一个栈存储运行时的函数相关变量，遇到函数时会先入栈执行完后再出栈（废话）。当遇到 `setTimeout` `setInterval`  `requestAnimationFrame` 以及 I/O 操作时，这些函数会立刻返回一个值（如 `setInterval` 返回一个 `intervalID` ）保证主线程继续执行，而异步操作则由浏览器的其它线程维护。当异步操作完成时，浏览器会将其回调函数插入主线程的**任务队列**中，当主线程执行完当前栈的逻辑后，才会依次执行**任务队列**中的任务。

但是在每个任务之间，还有一个**微任务队列**的存在。在当前任务执行完后，将先执行**微任务队列**中的所有任务，例如 `Promise` `process.nextTick` 等操作。也就是说当 `setInterval(fn, 1000)` 等待 1 秒钟后，`fn` 函数会被插入**任务队列**中，但并不一定会立刻执行，还需要等待当前任务以及**微任务队列**中的所有任务执行完。长此以往，使用 `setInterval` 的计时器超时将越来越严重。

如果有毅力的朋友推荐看看[权威的 HTML 标准文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)，没耐心的就看看这个动图简单感受一下原理吧。

![](https://uk61cg.bn.files.1drv.com/y4mcSzGXI67z9tGYkWxelXSAFLpRIaks9Y2vutDbVXmV4xEUO5VIOCAriv4qFN88wlj7dc82LfaJpTn8iqgS2LmLNfct48dCXPL_iRYVO_iaJSbDFD_OEWgG5Td5-QG5SMW2cqbaVVJftCHkMoxkSYA6tl33pNryxdaEoPvnKt8s5hTwlm39XfMWCyTwlbH8Ss0UKhPF9Pzt5_DrKI8Ya4pIA)

所以回归正题，不用 `setInterval` 那用啥？

### 天王盖地虎，我有 `rAF`

解铃还须系铃人，既然我们的代码执行时间在主线程中无法得到保证，那么还是要从更高抽象层级的浏览器中寻求办法。好在目前主流浏览器都已提供一个在重绘前执行动画相关函数的接口 `requestAnimationFrame`，用来更新计时器再合适不过。改造如下：

```javascript
/* Third version, use rAF instead of setInterval */
componentDidMount() {
  let lastTime = null;
  function __updateCountDownTimer(timestamp) {
    lastTime = lastTime || timestamp;
    const tickInterval = timestamp - lastTime;
    if (tickInterval >= 1000) {
      const toUpdate = this.state.list.slice();
      if (toUpdate.length) {
        const nodes = document.querySelectorAll('.count-down-timer');
        toUpdate.forEach((item, index) => {
          item.leftTime = Tools.getLastTime(item.endTime);
          nodes[index].innerHTML = item.leftTime;
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

那么这样实现足够精准了吗？打印出每次更新的时间戳瞅瞅（上图为模拟器数据，下图为测试机数据）。

![模拟器数据](https://uk60cg.bn.files.1drv.com/y4mQ1PgkiRAaXCfZdrIAIF9BBI5tkJKiuOg-cVIpGT2MqDg0_tga1jcdnf7KsqsLZAKTkVaMjrT1_QcNIl5t-iJkZFPajCeBf6F07lvrfhu3D_HQhwkp8-P5CvU1feucSLmeVM_7FVykz5ZoCOpIaeE3dc2srLtyq0liZcsLQfJxf89j1m6WQns6000dhgP1MjzWb6RFrdP2hTVTqc36WLxAw)

![测试机数据](https://uk6zcg.bn.files.1drv.com/y4mu2QEBM0rzmdCCPp5zDS_jVAHLDQtHzNXzsEkNcmx2ujBQP2KZsIkfDzAAHvqyt5VEvxSgr-I2X-3pH80BShnKyQJ-tXMltsyK07xEqCmmdtg9oqucFwu_9rPfpjRyCpHDwpMijoHuq6QLz7rl3irdEY8zxfmgNcKHnLhlV5G-Gph_YgSRtSYX1YAygmf3rGE_s0BAgg3pnKqdUay5jbraw)

可以看到模拟器上已经相当精准，每秒的误差在 +0.15 毫秒左右，也就是运行将近 2 小时会有 1 秒的误差，笔者觉得完全可以接受。不过测试机上的误差就有点大了，每秒的误差在 +10 毫秒左右，虽然笔者觉得也可以接受（很少有人会在活动页停留很久），但本着工（tai）匠（gang）精神，想想是否还能优化呢？

### 正向反馈拯救采样频率

好奇心使笔者打印出了测试机调用 `rAF` 的时间间隔，绝大多数间隔在 16.6 毫秒左右，意味着手机 webview 也是 60Hz 的刷新频率；不过也存在少数间隔时间远超正常刷新时间，达到了 30 ~ 70 毫秒，如果触发滑动操作可能会超过 100 毫秒。不得不说，测试机就要挑这么烂的 Orz...

仔细想想，测试机上的计时误差本质是采样频率并未一直满足 60Hz，当某一次采样时间超过 16.6 毫秒且刚好需要刷新动画时，就会产生误差。同时每次误差都是超时而非提前，这样就在延时的道路上越走越远了。

那么反向思考，每当触发更新事件时，超时时段（超过 1 秒的时间）是已知的。如果将其补偿到下一次计时中，应该能减缓误差的扩大速度。代码如下：

```javascript
/* Fourth version, use rAF instead of setInterval */
componentDidMount() {
  let lastTime = null;
  const DELAY_INTERVAL = 1000;
  function __updateCountDownTimer(timestamp) {
    lastTime = lastTime || timestamp;
    const tickInterval = timestamp - lastTime;
    if (tickInterval >= DELAY_INTERVAL) {
      const toUpdate = this.state.list.slice();
      if (toUpdate.length) {
        const nodes = document.querySelectorAll('.count-down-timer');
        toUpdate.forEach((item, index) => {
          item.leftTime = Tools.getLastTime(item.endTime);
          nodes[index].innerHTML = item.leftTime;
        }
      }
      lastTime = timestamp + (tickInterval - DELAY_INTERVAL);
    }
    requestAnimationFrame(_updateCountDownTimer.bind(this));
  }
  if (!this.timer) {
    this.timer = requestAnimationFrame(__updateCountDownTimer.bind(this));
  }
}
```

观察测试手机打印的时间，发现此法完全是可行的。每当超时间隔超过正常的刷新频率 16.6 毫秒时，相当于赶上了下一次采样窗口的伊始，因此会被校正。相比手机上每隔两三秒校正一次，PC 模拟器的采样时间变化显得尤为明显，在最后与大家分享。

```javascript
1685.99, 2686.13, 3686.27, 4686.410000000001, 5719.888, 6686.69, 7686.83, 8686.970000000001, 9687.11, 10687.443, 11687.583, 12687.723, 13687.863, 14688.003, 15688.143, 16688.283, 17688.423, 18688.563, 19688.703, 20688.842999999997, 21689.214, 22689.354000000003, 23689.494, 24689.634000000002, 25689.774, 26689.914, 27690.054, 28690.194000000003, 29690.334, 30690.474, 31690.863, 32691.003, 33691.143, 34691.282999999996, 35691.423, 36691.563, 37691.702999999994, 38691.843, 39691.983, 40692.123, 41692.473, 42692.613000000005, 43692.753000000004, 44692.893, 45693.033, 46693.173, 47693.313, 48693.453, 49693.593, 50693.733, 51694.159, 52694.299, 53694.439000000006, 54694.579, 55694.719, 56694.859000000004, 57694.999, 58695.138999999996, 59695.279, 60695.419, 61712.443, 62695.914000000004, 63696.054, 64696.194, 65696.33399999999, 66696.474, 67696.614, 68696.754, 69696.894, 70697.034, 71697.423, 72697.56300000001, 73697.70300000001, 74697.84300000001, 75697.983, 76698.12299999999, 77698.26299999999, 78698.403, 79698.543, 80698.683, 81699.02399999999, 82699.16399999999, 83699.304, 84699.444, 85699.584, 86699.724, 87699.864, 88700.004, 89700.144, 90700.284, 91700.424, 92700.781, 93700.92099999999, 94701.061, 95701.201, 96701.341, 97701.481, 98701.621, 99701.761, 100701.90100000001, 101702.041, 102702.426, 103685.897, 104686.037, ...
```



## Reference

- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [How does a single thread handle asynchronous code in JavaScript?](https://www.quora.com/How-does-a-single-thread-handle-asynchronous-code-in-JavaScript)
- [HTML Living Standard — Last Updated 25 May 2018](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)
- [window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)