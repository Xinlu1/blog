---
title: 响应式网站设计基础
date: 2017-10-04 00:14:15
updated: 2017-10-12 00:00:00
categories:
- Web 前端
tags:
- rwd
- note
- web
- flex
- css
- tutorial
- responsive
---


## Why Responsive?

### Setting up Chrome's Dev Tools

使用 Chrome 浏览器的开发者工具除了可以调试 PC 端的页面外，也可以模拟其他尺寸的设备进行调试。
<!-- more -->

首先打开 DevTools，点击设备反转按钮开启移动端视图：

{% img "https://wk4xlg.bn.files.1drv.com/y4mTTaAk1G49MbIRQs7fFezNIftcdaPcWXydBVauqYUTuNvgv4E9mgf-gY7FN3aal0r6NgqboyK0-PMCprfwVvRNohXz2xJHymNTJjm2nroOG5uY5g_o-bUKPVB9sCX17tjXxQJrBI3w6KUJ0uBXBdpj-68eCq7XCrkqK2P6PZdzUbUcAhFLkr7wxI5DUNm5XB4RCLS-OWYkwFNu11ujH3fWg" %}

如果想模拟特定的设备，可以点击 `设备列表` - `Edit…` ，以打开 Settings 列表；然后新增定制设备，设置 `Width` , `Height` , `Device pixel ratio` , `User agent string` 属性。

{% img "https://wk4ylg.bn.files.1drv.com/y4mAlxG-j5zwSeqFM7c6lGpqTrMToa2aNBEJBjhHIFBLMdnFjrUD2_sYwZFmA2gLGcGaz0JA73RyihsthtpclzTw0yxroMsE-u2U8mgx725KhKvw22UvniOZGpUgRuyUO1kDGWFrUkQ2iBGsyZZoK9IpflQlcXRRsOG7GG3h9ql25U0cOcqAsYziLQ2pGCXumdlcin5OnPH8HZvjjCWb_T9-g" %}

### Using dev tools on mobile

- Android 设备

  1. PC 端和 Android 手机安装对应平台的 Chrome 浏览器
  2. Android 手机开启隐藏的  `开发者选项` ，进入选项后勾选 `USB调试` 功能
  3. 手机连接电脑，打开各自的 Chrome 浏览器
  4. 在电脑的 Chrome 浏览器中登录 `chrome://inspect` ，可以看到连接的手机设备

  {% img "https://wk4alg.bn.files.1drv.com/y4m2in5fYvNssbvGOrwHGxIWFXyVT18UfgzhYfJy6LLJTcWCwJtsVkpyUWSWgchLhUzGJI8ln2N9eGOaqp1o26QQi9c1NZrOlxL_jTirAJMxp-oN0AkL_mHM0vp3pjqCWLAK9UqQr5fD0RS0T-QJxLmSodDt_RZWDDeRBfBwha6lTIEBlzjnGUzFZgRaGcbGpqkFYex6phyTzKg6jm9AUXL6w" %}

  5. 点击 `inspect` 功能，打开调试页面后即可像调试本地页面一样调试手机端的页面

- 适用于 iOS 的移动工具

  - 请参考以下文章：
    - [iOS WebKit 调试代理](https://github.com/google/ios-webkit-debug-proxy)
    - [Testing Mobile: Emulators, Simulators And Remote Debugging](https://www.smashingmagazine.com/2014/09/testing-mobile-emulators-simulators-remote-debugging/2/)
  - 如果觉得麻烦，也可以在 Chrome DevTools 中运行模拟器

## Starting Small

### Defining the Viewport

Q：当我制作网页时，有时候内容过大溢出界面，又或者内容太小需要放大页面才能看清，这是怎么回事呢？

A：最大的问题是你的视窗没有设置好。

视窗（Viewport）是指浏览器显示内容的区域。不过不同设备的像素密度是不同的，例如某一 Chromebook 的屏幕分辨率是 2560 * 1700，但是浏览器全屏显示时，窗口的宽度是 1280 而非 2560。

### Pixels, pixels and more pixels!

浏览器并不是根据屏幕硬件的像素宽度而工作的，而是根据 DIPs（Device Independent Pixels） 宽度。当硬件像素为 2560，而 DIPs 为 1280 时，DPR（Device Pixel Ratio）也就是 2 倍。

如果没有设定 meta viewport，浏览器会怎么样呢？

- 在渲染网页的时候，如果它原本是显示在一个宽 980 DIPs 的屏幕上，现在显示在一个只有 360 DIPs 的屏幕上时，内容就会以超过 2 倍的比例被压缩。

- 然后浏览器为了内容的美观性，会进行一项名为 font boosting 的工作，试图放大页面中的主要内容，而其他内容则维持大小不变。（如下图所示）

  {% img "https://wk4zlg.bn.files.1drv.com/y4mIt-E_waBwSeVHyDwNMSeBf_hU53EbmO-celBkJl7fGorw5adv-d9cubs4CZSMHHOSvI2ot4-wvGx-_2fuZPN5qBXOmmJ8g9CYFDHlgWMYDCDtlCTt_XbBvqnrJcKldOtjlD_1JLPFJJqGiqF9Bh2RbykVFZ7mUQkCCDenh0XePhg_bG5OC2Vyd7oAx8T33iiasnVPv_iX91Kxhj351lZfw" %}

Quiz:

{% img "https://wk4blg.bn.files.1drv.com/y4m6jJb-Nt8OIFPmCVRNDHnnJK-4f01faf3UkOKufQhfZKij8DQRtuyw8g9bOeKGib4JnDjlffly3xb3HNHyFwXcbiCK5RYBkkHUoUY6tCbViIhPISP6lnEdMM6fXvPp5FXjg8RpkOw4BrDFqzkZOFijGnV5f6pI_YCOEhTpvy3EDK7mLQT2fFC5rjEwHJCV4WVJHlHMrxSRAqAwu5cqN5YRQ" %}

 <br />


{% img "https://wk4clg.bn.files.1drv.com/y4my5vat3L5hkaetGF633ztT_hPNq_x-CxF6ccFZsYVlwrEJoH5XDMyZHw3zANYYKkfYCsv7D_WbF3hqvvagEfKGh_eCMfdDPM-kxX_zzddZXsIMQaX5PpfT29jlX5BKCS_tfmWkpJByqaaDpNw7oUlak_cTSVGjEVacVli5k7eHjX-LdlGLkbniz8ALh5s6aJSrlbA5MQJqb_ukENDoqQPfQ" %}

### Setting the Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- `width=device-width` ：指导页面针对具体设备进行宽度调整，使得页面可以匹配不同屏幕尺寸
- `initial-scale=1` ：添加初始缩放比例属性并赋值为 1，使得 DIPs 和 CSS 像素的比例是一比一。如果不把初始缩放比例设为 1，有的浏览器会在切换到横屏模式时依旧保持之前的页面宽度，而且它们还会使内容只进行比例缩放，而无法自动调整布局（Reflow）

### Max-width on elements

CSS 是允许内容溢出其容器的，预防这一情况出现可以进行如下推荐的设置：

```css
img, embed, object, video {
  max-width: 100%;
}
```

### Tap Target Sizes

使用鼠标可以很轻松地点击到按钮等元素，但是如果使用手指，操作的精准度相比之下就糟糕许多。

我们的手指宽度大概是 10mm ，约等于 40 CSS 像素，所以按钮的大小至少要设置为 40\*40px。推荐设置为 48\*48px，这样能确保元素之间有足够的距离，也能照顾到手指更粗的人。

```css
a, button {
  min-width: 48px;
  min-height: 48px;
}
```

### Start Small

设计响应式网页的概念与过程和非响应式是一样的，除了前者需要多画几种宽度的设计稿以适应不同屏幕尺寸。

这里推荐从最小屏幕尺寸的页面开始设计，通常是手机设备。做完之后再接着做更大一点的，依次类推，直至页面宽度上限。从最小的屏幕做起，开发者就必须优先考虑什么是对用户最重要的（Prioritize content!）、什么操作是用户最常做的、什么内容是用户最希望在屏幕上看到的。如果从最大尺寸往小设计，一些重要的信息很可能会被删除。**因此，明确内容的优先级，然后从小到大设计，最重要的内容永远都会留在页面上。无论用户使用什么样的设备，也能得到最完整的体验。**

除了设计上从小到大外，代码的编写也推荐如此，这样就能知道页面的风格和布局是否能兼容任何设备。此外，这样做也能帮助开发者从性能角度思考。

## Building Up

### Adding a Basic Media Query

```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" media="screen and (min-width: 500px)" href="over500.css"
```

添加了上面的媒体查询属性后，"over500.css" 样式表将在 DIPs 宽度大于 500px 时应用。

如果查询 Media Query 的相关文档，References 中可能还会提到其他媒体类型如 `handheld` `projected` `embossed` ，其实这些类型并不起作用，可以先忽略。目前只需要掌握 `screen` 和 `print` （打印页面时使用）即可。

除了在 `<link>` 标签中使用媒体属性外，以下还列举了两种方式进行媒体查询。

```css
@media screen and (max-width: 300px) {
  /* Set style here */
}
/* Complex Media Query */
@media screen and (min-width: 480px) and (max-width: 960px) {
  /* Set style here */
}
```

```css
@import url("over500.css") only screen and (min-width: 500px);
```

不过由于性能的因素，应该避免使用 `@import` 方式！它是一个性能消耗和优先级都非常高的标签（It's pretty expensive and perf matters），相比 `@media` 方式需要更多的 HTTP 请求。

另外不推荐 `min-device-width` 和 `max-device-width` 这两个属性，原因自己想吧；）

### Breakpoints and Picking Them

使用媒体查询的 `min-width` 和 `max-width` 可以改变整个页面的布局，而页面布局改变时的那个宽度尺寸叫做间断点。以 [medium.com](https://medium.com/) 来说，有 2 个间断点（ 于 2017.09 观察 medium 首页），观察间断点时建议从小的尺寸开始。

你永远不知道下一个热门的设备是什么，也不会知道两年后的流行趋势会是怎样，因此根据自己网页的内容寻找合适的间断点才是正道。

> 我们不应该规定任何间断点，相反，我们应该使用内容作为指引找到它们。—— Scott Yale

### Grids

当我们可以使用媒体查询和间断点控制 CSS 样式后，自然而然会想问，有没有什么常用的模式（Patterns）或基本策略（Strategies）可以参考。

在常用的一些模式中，最简单的当属动态网格系统（Grid Fluid System），可以参考 [HTML5 Rocks](https://www.html5rocks.com/en/tutorials/) 作为范例。

在这个系统中有一些动态调整的纵列，当窗口变小时，它们将自动顺延到下一行。目前已经有一些优秀的框架可以使用，例如 Bootstrap、960px grid layout system。

### Flexbox

Flexbox 是目前最强大的布局工具之一，被广泛推荐，也已经被绝大多数浏览器支持。下面将会介绍一些基本语法，需要注意的是，在未来编写产品代码时，一定要包含所有版本的浏览器引擎前缀（Vendor Prefixed Version），以确保使用旧版浏览器的用户也能获得相同体验。

Flexbox 之所以功能强大，是因为它能够自动填充空白区域。如果一个元素周围出现了空白，它会自动填补上；而如果空间变得拥挤，元素会自动缩小。

使用 Flexbox 的第一步是加入 `display: flex;` 属性，这样容器内垂直排列的元素将会自动显示在一行内（ Flex 的默认堆放方式为横向堆放 `row` ）。此时拖动浏览器，无论宽度多少，横向堆放的元素们都不会换行。

```css
.container {
  width: 100%;
  display: flex;
}
```

要改变这种情况，可以为容器添加 `flex-wrap: wrap;` 属性，这是在告诉浏览器，允许内部的元素换行。

```css
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
```

Flexbox 还有一个有用的特性是利用 CSS order 属性来改变元素的次序。

{% img "https://v64tlg.bn.files.1drv.com/y4mv4XLjecjhVGpKRzVs49bjd9OUy9jiEIu0FAKPE0s7Y5EZHBv2RJbpET8EblfdRJX-yHPS8tfjKpJHZg2yXNFaHMVqBUlm1lctd-Z2-V9aqT4ZpQzLp_LVWPm3sSiayYpJmbX2jGnAQUjQ1LjIFVtlsc0GzBQnE7DpKDI7yWkLwdVC4vKEuT-LF__hf0i0KBcKuIHQA2UTKvS3L1yWb-18A" %}

## Common Responsive Patterns

模式的变化很快，但也有一些通用的模式几乎能在任何设备上有不错的表现。响应式网页布局大致可以分为四种模式：Mostly Fluid、Column Drop、Layout Shifter 和 Off Canvas，有时候一个页面也会使用如 Column Drop 和 Off Canvas 的组合。

接下来将会讲解每种模式是怎样工作的，以及如何使用 Flexbox 和媒体查询技术来实现它们。注意在以下的示意图中，不同色块代表不同的内容区域。

### Column Drop

此布局共有两个间断点，在不同宽度时的排版如下图所示。

{% img "https://v64vlg.bn.files.1drv.com/y4mxdqh6iWBDr_eboXIKYOaaEa_d4rkKR0sNQE97hdF-QJDEh9IDvKIm0U7m79nJiie92TnUX7a20WNf5C24sJ5QAdXMWjhxzsRfh93d7t7o0ciA9JZp0hdycVtk0MsRasNyFhr2LCqS05zy-ieUb1f9z3Og8T_0zFOI_emHPSSmliPdLobqe9lggP048O9ZVPAWuhQxEE9c8ctppLvCkivnQ" %}

代码范例非常简单：

```html
<div class="container">
  <div class="box dark-blue"></div>
  <div class="box light-blue"></div>
  <div class="box green"></div>
</div>
```

```css
.container {
  display: flex;
  flex: wrap;
}
.box {
  width: 100%;
}
@media screen and (min-width: 450px) {
  .dark-blue {
    width: 25%;
  }
  .light-blue {
    width: 75%;
  }
}
@media screen and (min-width: 550px) {
  .dark-blue, .green {
    width: 25%;
  }
  .light-blue {
    width: 50%;
  }
}
```

### Mostly Fluid

此布局与 Column Drop 模型相似，但是更像网格系统，最明显的区别在于当视窗宽度达到最大宽度时，两边会出现外边距而内容不再延展。

{% img "https://v64ulg.bn.files.1drv.com/y4mPB3jzdwrrUvC0FB3yqZCvEIGUtAgvQvx6XypAfdTdQP0lY015qeTwWkLTf83nds2vk6ebHgqyEojSvB5KBLvZbeCZUxby9vG-cb89BJ-F87R6DQa5AeU923fOAebYDmkjJl4W2wSAWqpLseYmjnfyctYY2vx3GPSCKEF6844dj48xm9bPvSTzSVg03ywjrgmE9yYrgyXI5XG_2xRtyLibw" %}

代码范例如下：

```html
<div class="container">
  <div class="box dark-blue"></div>
  <div class="box light-blue"></div>
  <div class="box green"></div>
  <div class="box red"></div>
  <div class="box orange"></div>
</div>
```

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
.box {
  width: 100%;
}
@media screen and (min-width: 450px) {
  .light-blue, .green {
    width: 50%;
  }
}
@media screen and (min-width: 550px) {
  .dark-blue, .light-blue {
    width: 50%;
  }
  .green, .red, .orange {
    width: 33.333333%;		/* TODO: use "flex: 1" instead */
  }
}
@media screen and (min-width: 700px) {
  .container {
    width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

### Layout Shifter

Layout Shifter 布局模型应该是最灵活的响应式模型了，它有很多适用于不同设备的间断点，但最关键的是它的布局变化方式并不是单纯的重排到其它列的下方（参见下图中的红色列）。Flexbox 的亮点在这才真正凸显，因为我们可以利用 CSS 顺序属性来实现这种变化。

{% img "https://v64wlg.bn.files.1drv.com/y4mqr8SRAqQVlou1gI4oql1M45wwzLtecM8rvtec4RRKIhbFvTiYv2QvHmjZDfDb0ODu9Du6cSQQccNhq3iVBH0cle69ICePNw-sAqr16DTCsDHjwXC7QfHIGfVKiuUyzj65gjm182iaLWgtdyB7QSS6Vv4ooN69y0DjyoCU24-i2Can_JmEB44A_guNSK95TTY_3r4-Yzq1r-ztSGIdBHvgA" %}

这次的代码范例稍微复杂一点：

```html
<div class="container">
  <div class="box dark-blue"></div>
  <div class="container" id="container2">
    <div class="box light-blue"></div>
    <div class="box green"></div>
  </div>
  <div class="box red"></div>
</div>
```

```css
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.box {
  width: 100%;
}
@media screen and (min-width: 500px) {
  .dark-blue {
    width: 50%;
  }
  #container2 {
    width: 50%;
  }
}
@media screen and (min-width: 600px) {
  .dark-blue {
    width: 25%;
    order: 1;
  }
  #container2 {
    width: 50%;
  }
  .red {
    width: 25%;
    order: -1;
  }
}
```

### Off Canvas

在此模型中，内容并不是垂直堆放的，而是将不常用的内容比如导航栏或者应用菜单放在屏幕外，只有当屏幕足够大的时候才显示出来。在小尺寸屏幕上，溢出画布的内容通常会在用户点击菜单按钮时出现。

{% img "https://v64zlg.bn.files.1drv.com/y4mPHMLIxPrWCktIwkBiJAUzuajI-PSY9QFVUBBuIQinr4ZDoTBhRalx8YNXMyWTSiwwOwEeXlNXi4pcOBMj1TqGcphSzCUoWh1yUKX_BVcP7DOXeZcAoFYwdzOnAZnEV5AwQqBBYyAkDd3q3VosYy7YIiU36_1DC544X9I-uLlVXCwMREUh11MTZtqo2y1i0e7jba_CDijZPg9xGjGlhn43A" %}

代码范例如下：

```html
<nav id="drawer" class="dark-blue"></nav>

<main class="light-blue"></main>
```

```css
html, body, main {
  height: 100%;
  width: 100%;
}
nav {
  width: 300px;
  height: 100%;
  position: absolute;
  transform: translate(-300px, 0);
  transition: transform 0.3s ease;
}
nav.open {
  transform: translate(0, 0);
}
@media screen and (min-width: 600px) {
  nav {
    position: relative;
    transform: translate(0, 0);
  }
  body {
    display: flex;
    flex-flow: row nowrap;
  }
  main {
    width: auto;
    flex-grow: 1;
  }
}
```

```js
menu.addEventListener('click', e => {
  draw.classList.toggle('open');
  e.stopPropagation();
});
```

点击[此处](http://udacity.github.io/RWDF-samples/Lesson4/patterns/off-canvas.html)查看 Live demo。

Quiz: Off Canvas Visualization Quiz

{% img "https://v64ylg.bn.files.1drv.com/y4mOfH4p-_gXKdrDJ0PbOuL3altg-9PY5rAtTWp26OdcBxNWaOsw6Wv07KxabhjWx9AIgW7jc6Njq8ievp4HERpSqfd8mbTvVQc6cyJCVnDIt4p-gTavaJ-_tL8ZrerEfgpaMfXGZM1CQq8xH9SkicQRS-2TTUOSHEkAK3io9WdM6tcHZusICJwHpKgacCCO0de8E8amUO4Rtca4DUC79n2qg" %}

## Optimizations

### Images

> A picture is worth 1000 words.

使用同一张图片时，改变其分辨率可能是最常用的方式之一。试想在笔记本电脑上显示一张标准图片，但显示一张两倍大的图片给一个更高 DPI 的显示器，例如一台 Retina iMac。又或者是在不同尺寸的设备上显示图片时，显示不同内容的图片。要实现这些效果，图片元素可以使用媒体查询来选择使用哪张图片。

### Responsive Tables

表格有很多花样，如果其列超过一定的数量，是很有可能溢出视窗的，在小屏幕上会产生水平滚动条。有一些方法可以解决这个问题，以下是三种参考方案。

#### Hidden Columns

当视窗尺寸缩小时，Hidden Columns 实际上是根据表格的重要性来进行隐藏的。从小屏幕开始设计时，思考什么信息是最重要的，然后保留下来，隐藏其他不显示的内容。

Hidden Columns 最大的问题在于隐藏了内容，如果这些被隐藏的内容刚好是用户想知道的就麻烦了。如果可以，请使用缩写而不是完全隐藏内容。

{% img "https://v64xlg.bn.files.1drv.com/y4m-Ivf4Uo1G75Gb_ekkSZRyD-S6LUKJFW4BR1fkXKoMyokyLD-SjYyzQRnusyiJ4_b_R0PanL1b3xkaBA7zmQGuDW6AyRSxAVq0u5g7K4SNsr8awwo7DBCsJ4qpQLXT1RH4A4jPRCg-PFbOhBtOpHp4_uw9eRMxh2CHG_H-4qf1PCOePBKYi9a2Y3Xuo2l5SvjiyAmD_zt9lUnlR0ZGQEj1A" %}

#### No More Tables

当视窗小于一定值时，表格会瓦解，并重组成长列表。这种方法的好处是所有数据都是可见的，无论视窗尺寸多大。

#### Contained Scrolling

为了把表格放在视窗中，最简单的做法就是把它放在一个 `div` 里，然后设置宽度为 100%，最后设置 `overflow-x: auto;`。虽然表格还是会占据同样的宽度，但是可以用滚动条在视窗中拖动查看。

### Fonts

如果一段文字的每一行太短或太长，阅读起来都会让人感到不舒服，因此理想的文字行宽很重要。这是个很有技术含量的问题，目前已经有一些研究成果表明，依据使用的字体、显示的设备不同，每行 45 个字符到 90 个字符都是合理的。不过，**在网页中大概每行 65 个字符是最常见的**。这并不是硬性规定，但是个不错的建议。与此同时，行宽也是选择断点时的重要参考因素之一。

此外，用户的阅读体验也非常重要。以字体的大小和行高来举例：在不同设备上字体需要足够的大以保证用户看得清楚，通常建议至少设为 16px；而行高至少有 1.2em 才不会使文字看起来太拥挤。

### Minor Breakpoints

除了选择令布局显著改变的主断点（Major Breakpoints）外，增加副断点来实现一些小的改变是很有帮助的。例如，在主断点之外调整元素的外边距，或者给一些内容增大字号使其更容易阅读（布局上也会更加自然一点）。

## References

- Udacity - [Responsive Web Design Fundamentals](https://classroom.udacity.com/courses/ud893)
- PageSpeed Insights - [Configure the Viewport](https://developers.google.com/speed/docs/insights/ConfigureViewport)
