---
title: 服务器端渲染姿势探索
date: 2017-09-14 20:46:51
updated: 2017-11-13 19:43:15
categories:
- Web 前端
tags:
- SSR
- server-side
- render
- isomorphic
---


服务器端渲染（Server-Side Rendering，以下简称 SSR）并非是一门新技术，早期就有 Java, PHP 等后端语言进行页面渲染，后来 JavaScript 兴起、 Jquery, Backbone, React, Vue 等视图框架流行，前端逐渐夺回了渲染的地盘。随着如 Express, Koa 等 Node Web 应用程序框架的出现，SSR 以同构渲染（isomorphic rendering）的方式再次强势归来。
<!-- more -->

![](https://cloud.githubusercontent.com/assets/948896/25062958/ca1b6618-2209-11e7-99ae-c2a75ad3dabb.png)

由于 SSR 在初次请求页面时已经包含了页面所需的数据内容（甚至是 CSS 和 JS 脚本），因此带来了两点好处：

- 首屏性能：省去异步请求数据的时间
- SEO 优势：防止 SEO 爬虫因缺少异步请求而错失的关键内容

当然在同构渲染模式下，前后端都由前端工程师进行开发，这无形中也是一个很大的优势。

下面笔者将结合自己参与过的几个应用，分享在 SSR 方面的一点探索心得。



## 从0到1：不求甚解，先摆个姿势再说

笔者之所以会用到 SSR，现在回想起来也有点偶然：那个时候笔者的前主管经过一番调研，发现淘系的前后端分离框架 Midway 不错，于是基于它开发了一个轻量级的 Web 应用。



Midway 内置了一款名为 XTemplate 的模板引擎（类似 Nunjucks 的轮子），那时候身为前端小白的笔者看了这玩意，心想不就是一个 HTML 的超集么，虽然是方便那么一丢丢，但是为什么会有这类模板引擎，没想明白。

在没有吃透这项技术的情况下，笔者和师兄写出了 Xtpl 和 Vue “水乳交融” 的代码，而整个页面渲染逻辑如下：

![uml-old](https://user-images.githubusercontent.com/8896124/32724607-92c0cddc-c837-11e7-88fe-7ae2a123cc9f.jpg)

由于业务长期对页面性能方面缺乏需求，大家都觉得这套方案没啥问题，即使偶尔在登入、刷新时会出现**一些排列整齐的{% raw %}「{{}}」{% endraw %}符号一闪而过**，也只被解释成这就是稍微有点慢。



意识到这个姿势有问题时笔者已经换了一个团队，完全没有前端工程基础，打造一套服务于当前业务的高效前端开发体系是首要目标。在回顾之前使用的技术栈时，针对 SSR 笔者一下子就想到了两个问题（OS：“你个傻X当初想什么去了…”）：

1. 既然客户端要异步请求表格数据，为何一开始不直接存在 DOM 中发过去？
2. 需要 Vue 渲染的内容，能不能用模板引擎（如 XTemplate）渲染？如果能为什么要留到客户端渲染？

第一个问题讨论的就是 SSR 的主要价值之一，在文章开头已经介绍过；而第二个问题后面还会有详细讨论。总而言之，之前的那种设计思路，完全废掉了这项技术，相比单纯的客户端渲染还浪费了服务器上模板引擎解析的时间，尽管理论上这个性能损耗极小。

### 姿势小结

使用 SSR 的原则应当是尽量把页面所需的数据都渲染或存在页面中，能节省一次或多次 HTTP 请求时间；需要大量数据的图表是个例外，但这种情况更合适的做法应该是首次粗粒度显示、后续再通过异步请求灵活调整。另外能在服务器端渲染的内容尽量使用模板引擎渲染，后续客户端的工作再交由 Vue 等框架来做。

至于收益嘛，就看异步请求的数量和当下的网速了。



## 同构还是不同构，这是个问题！

书接上文，有一个问题是 Xtpl 能否替代 Vue 渲染一些内容，其实这个问题反过来问才更合适：**React, Vue 官方都已支持 SSR，甚至出现了 Next.js 和 Nuxt.js 这样的定制 Web 框架，是否还需要使用 Xtpl 之类的模板工具？**



既然做技术选型，优缺点的对比必不可少。

先说 React, Vue 这样的同构渲染，最大的好处就是一套 JS 代码在服务端和客户端是共用的。以 React 为例，使用 `renderToString` 或 `renderToStaticMarkup` 将客户端的组件转化为字符串供服务端使用，具体的实现可以参考 `引用2`。同构的好处反过来也就是使用模板渲染的坏处，在 UI 框架必备的前提下，多学习、使用、调试一门语言，成本肯定会增加。

但是使用模板的好处也是存在的，首先是性能上的优势。

笔者使用 Rax 提供的跑分方法对主流渲染框架/引擎进行了性能测试，具体结果如下。测试结果以每秒钟执行测试代码的次数（*Ops*/*sec*）显示，这个数值越大渲染性能越好。可以看到 Xtpl 的性能远超 React, Vue 等框架，这是因为 React 等框架在渲染时需要构造 vDOM 然后才能输出 HTML，而 Xtpl 这样的模板引擎只需要在模板上做简单的“翻译”命令即可。

```shell
React#renderToString x 540 ops/sec ±2.43% (78 runs sampled)
Rax#renderToString x 878 ops/sec ±5.38% (74 runs sampled)
Inferno#renderToString x 1,111 ops/sec ±6.35% (70 runs sampled)
Preact#renderToString x 557 ops/sec ±6.72% (67 runs sampled)
Vue#renderToString x 233 ops/sec ±36.37% (68 runs sampled)
Marko#renderToString x 4,580 ops/sec ±5.25% (73 runs sampled)
Xtpl#renderFile x 4,606 ops/sec ±7.13% (53 runs sampled)
Fastest is Marko#renderToString,Xtpl#renderFile
```

除此之外，Xtpl 的优势就是在开发 Memory Analysor 等应用时积累的业务代码和经验了，没有学习成本，当业务压力大时，先顶一阵子也没什么问题；）

*注：现在无论是 React 还是 Vue 都对 SSR 进行了优化，通过缓存策略极大地改善响应时间并减少服务器的负载，延伸阅读可参考 `引用4` `引用5`。下图为 React 针对 SSR 优化的前后性能对比图。*

![React SSR Opt](https://raw.githubusercontent.com/walmartlabs/react-ssr-optimization/master/images/react-renderToString-cpu-profile.png)

### 姿势小结

这是在最近开发一款新应用时遇到的问题，考虑到项目中第一次使用 React 和 Webpack 进行开发构建，为了进度的平稳，还是先采用 Xtpl +  React 这样的混合方案，等未来迭代时再逐步替换为同构方式。得益于模块化的开发风格，Xtpl 和 React 各司其职，完全解耦。



## 请求不要放在一个篮子里

某一次笔者特意给自己挖了个坑，想看看什么时候会掉下去，没想到很快就如愿以偿了=。=

前文总结时已经提到过，既然是请求首屏数据，就只需要先获取第一屏的内容，并且如果遇到大量数据的图表时还应调整粒度进行“压缩”。但是为了体会到那种慢的感觉，笔者特意把页面所有的数据都请求完了才进行渲染，而页面内容包含三图一表...

起初完全感觉不到这样做的危害，直到数据库库表里的数据达到百万条，一条 SQL 请求语句需要 6-7s 时，页面载入的速度就令人很不爽了。

### 姿势小结

和 SSR 相关的解决办法其实就是初次渲染时只请求首屏数据，其他数据待客户端加载完毕后再异步请求。

不过既然都提到了这个例子，也顺带说一下还做了其他哪些事：

- 添加 SQL 请求中的条件字段为索引
- 根据业务背景增加有意义的条件限制
- 服务端 cache 住可以复用的共享数据





## 报告！HTML字符串有小动作

又在某一个项目开发中，笔者将首屏数据存在了 DOM 里，准确地说是将数据存放在了一个节点的属性中，当客户端加载代码后再读取数据进行后续工作。代码示例如下：

```html
<!-- index.xtpl -->
<div id="module1" data="{{data}}"></div>
<script type="text/javascript" src="/public/index.js"></script>
```

```javascript
// index.js
import Module1 from './module1.jsx';
let src = $('#module1').attr('data');
Module1.render(JSON.parse(src));
```

后来在 review 代码时，发现一个显而易见的性能优化点：DOM 的操作很昂贵， 将数据存放在 DOM 中再通过 API 获取属于多此一举。Xtpl 文件作为模板，实质上就是字符串，数据插入到字符串的任意位置都是允许的，只是最终的意义不同。如果将数据写到模板的 `<script>` 中，客户端加载时数据就直接到内存里了。

改进后的代码如下：

```html
<!-- index.xtpl -->
<div id="module1"></div>
<script>
  window.INITIAL_DATA = {{{data}}};
</script>
```

```javascript
// index.js
import Module1 from './module1.jsx';
Module.render(window.INITIAL_DATA);
delete window.INITIAL_DATA;
```

不过笔者对于性能方面的担忧是多余的（**DOM 操作昂贵没错，但不是贵在这里！可从浏览器的工作原理角度出发思考这一问题**），这两段代码的执行效率几乎没有差别：在数据（字符串形式）量达到 36.7 KB 时，第一份代码对 DOM 的读取操作和 `JSON.parse()` 方法都是在 5ms 以内完成的。

反倒是页面体积有了明显的变化：

|       | 数据存在DOM中 | 数据存在内存中 |
| ----- | -------- | ------- |
| Page1 | 42.1KB   | 23.9KB  |
| Page2 | 67KB     | 38.6KB  |

原因很有趣，当把数据存在 DOM 中时，需要先将 JS Object 转换为 JSON 格式的字符串。随后在 JSON 字符串写入 HTML 的过程中，所有的双引号都被转义字符 `$quot;` 所替换。而将数据直接写在 `<script>` 中就不存在这种情况，简单的字符串拼接后，就是一条赋值语句。经模板生成的网页源代码如下所示：

```html
<!-- Previous -->
<div id="module1" data="{&quot;key&quot;:value}"></div>

<!-- Now -->
<div id="module1"></div>
<script>
  window.INITIAL_DATA = {"key":value};
</script>
```

### 姿势小结

在 UTF-8 编码下，每当 JSON 字符串中出现一个双引号，前者就要比后者多耗费 5 个字节，当数据量很大时，页面体积就会出现很明显的差异。这在无线端等网络状况不稳定的业务场景中值得关注。



## 引用&延伸阅读

1. [精读前后端渲染之争](https://github.com/camsong/blog/issues/8)
2. [一看就懂的 React Server Rendering（Isomorphic JavaScript）入門教學](http://blog.techbridge.cc/2016/08/27/react-redux-immutablejs-node-server-isomorphic-tutorial/)
3. [从零开始React服务器渲染](http://www.alloyteam.com/2017/01/react-from-scratch-server-render/)
4. [server-side-rendering-comparison](https://github.com/raxjs/server-side-rendering-comparison)
5. [React Server-Side Rendering Optimization Library](https://github.com/walmartlabs/react-ssr-optimization)
6. [Vue.js 服务器端渲染指南 - 缓存](https://ssr.vuejs.org/zh/caching.html)