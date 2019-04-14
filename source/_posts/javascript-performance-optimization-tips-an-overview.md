---
title: JavaScript 性能优化概观
date: 2018-07-17 11:28:57
updated: 2018-07-17 11:28:57
categories:
- Web 前端
tags:
- javascript
- optimization
- performance
---


> 源文链接：[JavaScript Performance Optimization Tips: An Overview](https://www.sitepoint.com/javascript-performance-optimization-tips-an-overview/)

我们将坚持“工具不代表规则（Tools, not rules）”的老话，尽量少提 JS 相关的流行术语。很显然我们不可能在一篇 2000 来字的文章里覆盖 JS 性能的方方面面，因此请在后续阅读本文的参考书目并自行研究。

不过在深入细节之前，先让我们通过回答以下问题来更广义地理解性能优化：高性能的 JS 要考虑哪些指标？这些指标如何与更高维度的 web 性能指标融为一体？
<!-- more -->

## 准备工作

首先，让我们避开如下事情：如果你只在台式机上测试，你已将 [超过 50%](http://gs.statcounter.com/platform-market-share/desktop-mobile-tablet) 的用户排除在外了。

![](https://uk6xcg.bn.files.1drv.com/y4mNVFLuHYlzHBeyfNYZsHgIHuDsfmF11B33HcdkHvMvvvIN3F5zXQIMsx5f2T6FTwIjNOB924XGxOyLVwfhrceWQTgqSANcEEglZy_zXdhayApGYOSCA68RyeOsEEbxzfRIGozZuO_wrU79c35vJqQz5o454NRbJRpJj0mT3uoxsXAsuaNwKWhSpxXoi3rlfbhxEa4ztlINll-bSMqHfPDnw)

由于新兴市场偏爱使用低于 100 美金的安卓设备上网，该趋势只会持续增长。台式机作为主力上网设备的时代已经结束，未来十亿网民将会首选移动设备访问你的网站。

Chrome DevTool 工具的设备模拟器并不能有效替代真实设备进行测试。即便限制 CPU 和网络性能有所帮助，但它相比性能较弱的真实设备来说完全是另一个等级。所以请在真实设备上测试！

即使是使用真实设备测试，你也很可能用的是自己新买的高端旗舰机。然而，这并非你的用户使用的设备。让我们看看配置处在中等水平的移动设备，例如摩托罗拉的 G1，只有不足 1GB 的运行内存、孱弱的 CPU 和 GPU。

当 [解析一个文件体积为平均数的 JS 包](https://docs.google.com/spreadsheets/d/1wHcNNQea28LhwQ_amFamT33d5woVrJfJy53Z1k6V090)（JS bundle）时，让我们看看它的解析速度排名。

![Addy Osmani: Time spent in JS Parse & eval for average JS](https://uk6wcg.bn.files.1drv.com/y4m0-ZmIf1Xp68or_HfkesuOljc0Gw252YypTC3P6P6VpgBHI0-gXEYaaEyF8nqlDWnJSBxCTdFSIRjZULLHMFEkR8Zfkne6s8bJnYmdD5a9BPj2YVHDLfTIFYICJvJ2ff6ycJCauE298dxQFhFM3fysXz9rOBSmqxpl4bET8VLjW1R4Xh_JkU2rgZU90d_czDrPEM5eG7_ufUqskK0hI2xPg)

虽然这张图只涵盖了 JS 解析和编译的时间（后续时间将会消耗更多）而非常规的性能数据，但有着强关联的它可以被视作 JS 性能的指标之一。

Bruce Lawson 曾说 “[it’s the World-Wide Web, not the Wealthy Western Web](https://vimeo.com/194968584)”。因此你需要在比你的 MacBook 或 iPhone 慢 25 倍左右的设备上探讨 web 性能。让我们看看我们的实际目标是什么。

## 高性能的 JS 代码是怎样的？

现在我们了解了我们的目标平台，就可以解答下一个问题：高性能的 JS 代码是什么？

虽说没有绝对的分类来定义高性能代码，但我们有一个以用户为中心的性能模型可以参考：[RAIL 模型](https://developers.google.com/web/fundamentals/performance/rail)。

![Sam Saccone: Planning for Performance: PRPL](https://uk6vcg.bn.files.1drv.com/y4mmLE_Js1ooQjEX8AGy_4ytOtExYWfJ3SMsL4Q63loBlFj19s2GlTeQBv1fZn-eAP-EBfSbpPCuAjzM29rYAM2iHM-5MrDNa-r8iG_bQhRFSgmLfQuOMbXYeEwf_5PQbzt77QO5qXSVIZ3NZxVoeMDfvHt9zk78ZOuZGGtHZ0TuHo84Gw8qzSZf8_H3-4I-yIzgFPzBMZt6wMUvhuSuyJ2pA)

### 响应

如果你的应用在 100 毫秒内响应用户的操作，给用户的感知就是立即响应。这适用于网页中可敲击的元素，但是滑动或拖拽时则不行。

### 动画

在 60Hz 帧率的显示器上，我们期望在动画和滑动时画面恒定在 60 帧每秒，这意味着约 16 毫秒显示一帧。由于 16 毫秒的预算，你实际上只有 8 到 10 毫秒去完成所有工作，剩余时间将被浏览器内部以及其它一些差异消耗掉。（深度阅读：《[从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651228065&idx=2&sn=0db2e69aa9344d4b086e9d98301aebad)》）

### 闲置

如果你正在运行一个昂贵且持久的任务，请确保将它切分为更小的部分以便主线程有空响应用户的输入。不应该有阻塞用户输入超过 50 毫秒的任务存在。

### 负载

一个页面的加载应低于 1000 毫秒，超过这个时间你的用户将会变得烦躁。而在移动设备上要求页面变得可交互而不仅完成渲染和可滑动时，是一个非常难的目标。实际上，可用于加载的时间往往更少：

![Fast By Default: Modern Loading Best Practices](https://ua62cg.bn.files.1drv.com/y4mJXYSoOY-zysDoELXReJbrP9qgAlCz955Rlpuip5GmXG9kWD3BhEIB57MPHkmmbxrvhifOErq5rV54TSjKmsw7UgLrNNIVweRGVcyk4is2K_zZfDXM7HuPreemrsBs1TnplWdvyvi1i3MIndUqprEkSaONy1gWVcJZkXC9ULwXGJ27_3wPKnWFwAUbjxHBl7zgtEVM2p-35t4FbpQP-ZBgw)

在实践中，可交互时间以 5 秒为目标，这也是 Chrome 在其 Lighthouse audit 中使用的标志。

现在我们知道了度量指标，让我们来看[一些数据统计](https://storage.googleapis.com/doubleclick-prod/documents/The_Need_for_Mobile_Speed_-_FINAL.pdf)：

- 如果一个移动站点的加载时间超过 3 秒，53% 的访客将会离开
- 每两个人中就有一个人期待页面加载时间不超过 2 秒
- 大约 77% 的移动站点在 3G 网络下的加载时间超过 10 秒
- 移动站点在 3G 网络下的平均加载时间为 19 秒

此外，[Addy Osmani 还提供了一些信息](https://medium.com/reloading/javascript-start-up-performance-69200f43b201)：

- Apps 变得可交互在 PC 上需要 8 秒（使用网线），而在手机上需要 16 秒（3G 网络的 Moto G4）
- 从中位数看，页面依赖的 JS 文件（gzipped 压缩过）大小为 410KB

你是否感到十分泄气？很好，让我们一起行动，修复网页面临的这些问题。

## 上下文即一切

你可能已经注意到，加载网页的时间是主要瓶颈。确切的说，瓶颈来源于 JavaScript 下载、解析、编译和执行的时间。这个问题没有捷径可走，唯有加载更少的 JS 脚本以及更加聪明地加载它们。

但是除了启动网站外，你的代码实际上做了哪些工作？这里肯定有些性能可以优化，对吧？

在你开始优化你的代码前，先想想你要构建的是什么。你在构建一个框架或 VDOM 库吗？你的代码需要每秒执行上千次运算吗？你为了处理用户输入或动画而使用一个时间临界型（time-critical）的库吗？如果没有，你也许应该将时间和精力投入到一些更有用的地方。

不是说编写高性能的代码不重要，但是从事物的宏观角度来看其影响通常较小，尤其在讨论微优化时。因此，在你踏入 Stack Overflow 通过对比  JSperf.com 上的结果来争论 `.map` `.forEach` 和 `for` 循环方法前，先确保看到了整片森林而非细枝末节。50K 次每秒的操作听起来比 1k 次每秒的操作要好上 50 倍，然而在绝大多数场景下这两者不会有什么区别。

## 解析、编译以及执行

基本上大多数性能不高的 JS 代码问题并未出现在运行时期，而是在代码开始执行前所需的所有步骤。

我们在这会讨论抽象的层次。电脑中的 CPU 执行的是机器码，而电脑中运行的绝大多数代码是编译过的二进制格式（这里使用“代码”而非“程序”考虑到了近来的 Electron 应用）。也就是说，二进制代码抛开了所有系统层面的抽象，可以在硬件上原生执行，不需要一些预先处理。

JavaScript 没有被预先编译过。它在浏览器中通过相对较慢的网络被下载为可读的代码，总而言之，浏览器就是 JS 程序的“操作系统”。

代码首先需要被解析——更确切地说读取并将其变成计算机可寻址的结构以便编译。在设备/浏览器可以执行前，代码还需被编译成字节码，最终是机器码。

另一件非常重要的事情是 JavaScript 是单线程的，运行在浏览器的主线程上。这意味着一次只有一颗处理器可以运行 JS 代码。如果 Chrome DevTools 的性能时间轴被黄色峰值填充，即 CPU 使用率达到 100%，画面将会出现长帧、掉帧、难用的滑动以及其他所有扎心的体验。

![Paul Lewis: When everything's important, nothing is!](https://uk6ucg.bn.files.1drv.com/y4mf7OwF4UaBXdoAo5nmOKXVbIO52qOl0GsAP9_bpZNFT0Qm8dEFmJPzIeVLBrmsjgSTK-Mn1V6TQath0tmAFE9cCsSmH0hc_MK5e8I7uar-osIsRW1sKyfFBexLaJg3pSiGKctRsv7a83Bn0N-E6jSb6XDGmsxUx9tf9XmHD7b9nrLEmnmNuR6c8biwbDqpM9O0BW0LCKJ5oii9iLFg0KxgA)

所以在你的 JS 代码开始运行前，上述所有工作需要完成。在 Chrome V8 引擎执行 JS 代码的总时间中，解析和编译占据了约 50% 的时间。

![Addy Osmani: JavaScript Start-up Performance](https://ua63cg.bn.files.1drv.com/y4mmTS-JT-S3MyBeSJilW_BXMGOnvluzo-h4RC_2PkHPBfg2eU1pv__euNdtWHKIGJz9q67ARN2Hsy4YDUVS4iYbI2L78ZepPII9Q_bR89luYO4ikzWXr-Ae2xZ7hlVhYE5sSp-zHKqMvro8a8f2Sn5CNpPA3A97Q0scvJIvP_yZnY8cBVyBchtAz-yYeUKET79O3Vw5uoN6wV1orMk2_vvgw)

从这一部分我们学会两件事：

1. 尽管未必是线性关系，但 JS 的解析时间与包的体积呈正比。加载的 JS 代码体积越小，速度越快。
2. 每一个你使用的 JS 框架（React, Vue, Angular, Preact ...）是另一个层次的抽象（除非是像 [Svelte](https://github.com/sveltejs/svelte) 这样的预编译库）。这些库不仅会增加 JS 包的体积，也会因为代码没有直接面对浏览器而降低效率。

有一些方法可以缓解这些问题，例如使用 service workers 另起线程在后台完成工作，或使用 asm.js 编写更容易被编译成机器指令的代码，但这完全是另一个话题了。

你可以做到，是无论如何在一切情况下避免使用 JS 动画库，并熟悉[绘画和布局的触发事件](https://csstriggers.com/)。只有当完全没办法使用常见的 CSS 过渡和动画实现时再使用库吧。

即使这些库可能使用了 CSS 过渡、复合属性以及 `requestAnimationFrame()` 方法，它们依然作为 JS 代码在主线程中运行。为了保证动画的顺滑，你需要确保你的所有 JS 代码在每帧 8 毫秒的时间内完成执行。

另一方面，CSS 动画和过渡占用 GPU 而非主线程，如果高效实现，可以避免产生重新布局。

考虑到大多数动画是在等待或用户交互时执行，这可以给予应用一定的喘息时间。

[Web Animations API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API) 作为即将到来的特性集合允许用户脱离主线程开发高效 JS 动画，但现在还是坚持 CSS 过渡和 [FLIP](https://aerotwist.com/blog/flip-your-animations/) 之类的技术吧。

## 包的大小就是一切

如今一切都是 JS 包。Bower 和 `</body>` 标签前写一堆 `<script>` 的时代已经远去。

现在都是使用 `npm install` 来安装你在 NPM 上发现的新玩意，使用 Webpack 将它们打包为一个 1MB 体积的超大 JS 文件，当浏览器结束依赖包的数据请求后，这么大的文件会让浏览器缓慢运行。

试着少加载一些 JS 代码吧。你的项目也许不需要[完整的 Lodash 库](https://surma.github.io/underdash/)；你有必要非得使用一个 JS 框架吗？如果是，你考虑过使用体积是 React 1/20 的 [Preact](https://github.com/developit/preact) 或是 [HyperHTML](https://viperhtml.js.org/) 吗？为了实现滑到顶部的动画你有必要使用 [TweenMax](https://greensock.com/tweenmax) 吗？伴随着 npm 的便捷与各框架组件的独立，缺点应运而生：开发者面对一个问题时的第一反应变成了用更多 JS 代码来解决。当你拥有一把锤子时，一切看起来都像钉子。

当你在删繁就简、加载更少的 JS 代码之后，试着更聪明地加载它：需要时再加载。

Webpack 3 有一组了不起的功能名为 [code splitting](https://webpack.js.org/guides/code-splitting/) 和 [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)。相较将所有 JS 模块打包成一个庞大的 app.js 包，这组功能可以自动切分代码并使用 `import()` 语法异步加载它们。

你不一定需要使用框架、组件和客户端路由以获得其优点。假设你有一段复杂的代码处理 `.mega-widget` 类的节点，这段代码可能存在于任意页面上，你可以简单得在你的主 JS 文件中编写如下代码：

```js
if (document.querySelector('.mega-widget')) {
  import('./mega-widget');
}
```

如果你的应用在当前页找到了部件，它将会动态加载所需的依赖代码。否则一切正常。

除此之外，Webpack 工作需要其自身的运行时，它将在其生成的所有 JS 文件中注入运行时代码。如果你使用了 `commonChunks` 插件，你可以使用如下方法[将运行时抽取到一个独立的代码块中](https://medium.com/connect-the-dots/caching-assets-long-term-with-webpack-5ad24a4c39bd)：

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'runtime',
}),
```
在这个例子中，会将所有代码块中的运行时剔除出来，写入 `runtime.js` 中。只需确保在主 JS 包之前先加载它，例如这样：

```html
<script src="runtime.js"></script>
<script src="main-bundle.js"></script>
```

接下来谈谈 transpiled code 和 polyfills。如果你编写的是现代（ES6+） JS 代码，你很可能正在使用 Babel 将它们转译为 ES5 兼容的代码。转译（Transpiling）不仅因为各种冗余增加文件体积，也因其相比原生 ES6+ 代码更加复杂带来了[性能退化](https://github.com/babel/babel/pull/6748)问题。

你可能还顺道使用了 `babel-polyfill` 和 `whatwg-fetch` 库来补充旧版本浏览器中缺失的一些特性。然后，如果你在代码中使用了 `async/await` ，你还需要引用 `regenerator-runtime` 库来转译...

重点是，为了支持老版本的浏览器，你的 JS 包因此平添了近 100K，不仅体积较大，也会耗费更多的解析和执行成本。

没理由因为上述问题而降低使用现代浏览器的人的用户体验，这里介绍一个我正在使用、同时 Philip Walton 也在[这篇文章](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)中介绍的方法：创建两个独立的包并依情况加载。使用 `babel-preset-env` 可以很容易实现，例如你有一个支持 IE 11 的包和另一个为最新版现代浏览器准备的没有任何 polyfills 的包，一种不优雅但是高效的方式是将以下代码写入内联脚本中：

```javascript
(function() {
  try {
    new Function('async () => {}')();
  } catch (error) {
    // create script tag pointing to legacy-bundle.js;
    return;
  }
  // create script tag pointing to modern-bundle.js;;
})();
```

如果浏览器无法识别 `async` 函数，我们则判定它是一个旧版浏览器并加载已经 polyilled 的包，反之将加载一个简洁且现代化的变体。

## 总结

我们想要你从本文得到的观点是 JS 是一门运行昂贵、应该被小心使用的语言。

请确保在真实网络环境下使用低端设备测试你的网站性能。你的网站应该尽可能快被加载且变得可交互。这意味着通过任何有必要的方法减少 JS 的代码体积、加快加载速度。只要有可能时，你的代码应该都是 minified 过的，被切成更小、可控的包，并被异步加载的。在服务器端，确保启用了 HTTP/2 协议以获得更快的并行传输速度，同时使用 gzip/Brotli 压缩更加彻底地减少 JS 包体积。

## 引用

- [Addy Osmani: Time spent in JS Parse & eval for average JS](https://docs.google.com/spreadsheets/d/1wHcNNQea28LhwQ_amFamT33d5woVrJfJy53Z1k6V090)
- [Sam Saccone: Planning for Performance: PRPL](https://www.youtube.com/watch?v=RWLzUnESylc)
- [*Fast By Default: Modern Loading Best Practices (Chrome Dev Summit 2017)*](https://www.youtube.com/watch?v=_srJ7eHS3IM)
- [Addy Osmani: JavaScript Start-up Performance](https://medium.com/reloading/javascript-start-up-performance-69200f43b201)