---
title: Weex Android 发车指南（已弃车）
date: 2017-08-06 03:42:26
updated: 2018-05-07 00:00:00
categories:
- Web 前端
tags:
- weex
- android
- web
- vue
- mobile
- javascript
- tutorial
- app
---


## 前言

还记得刚入职见到第一个 YunOS App 时，笔者问师兄 `Manifest.json` 文件是干嘛用的，师兄说如果你有 Android 开发经验的话就会明白了。当下笔者立马找了本电子书放在桌面准备苦读，结果...时至今日未曾宠幸过。对于没有一点 Java 经验的笔者来说，不知道何时才会迈出无线开发第一步，直到最近遇见了 Weex。
<!-- more -->

Weex 是集团去年推出的移动开发框架，Apache 顶级开源项目，已经被手淘、天猫等业务广泛使用，经历了双十一等活动的考验。它与传统的移动开发不同、也是吸引笔者的地方，即使用 Web 前端技术进行开发且能达到 Native 级别的性能体验。

既然笔者毫无 Java 以及 Android 开发经验，必然会站在 **纯前端人员的视角** 来带领大家上车。此外，Weex 在集团内外的热度真的是非常之高，相关的文档、博文也是数不胜数，因此文中将会使用一些引用来保证心得的简洁同时给大家更多延伸的内容。



## 什么是 Weex ？

理论角度，[官方文档](http://weex.apache.org/cn/guide/intro/how-it-works.html)上已经说得挺清楚的了，一张流程图可以说明一切。

{% img "" "https://v64blg.bn.files.1drv.com/y4mgihO5S41NuNsjSkDcgj3dmHqmgoCLojI9FuKZ1AaB76FK7uSYiyR1HhkKeNwtpDk3UZMvW0gsthHEg1eOyhcoOhZNzE3OzIMwciSO-vDQU5M2F15ZhKe7mU54RriMLd_T3SyoepJfMnxQH7fs_cYOP--tjsnJ5MRCqHwjuF8GC34xP6eODvWzGZbXl8qRj9xl4Enm2-xL6w3b6uRRPCAMQ" "Source: http://weex.apache.org/cn/guide/images/flow.png" %}

不过回到实际开发，Weex 是什么，这点在没有上手前很难从官方文档中得出结论。（网上有不少声音吐槽 Weex 文档写的不好，笔者持保留态度，不过确实从落地的角度来说，缺乏一些必要的细节，这个后面还会再提。此外作者还有一个疑问，官方文档究的目标群体究竟是谁？是传统的移动端开发者？还是 Web 前端背景的开发人员？至少笔者觉得不是后者。）

以实践的角度，在笔者看来，Weex 有两部分，一是前端技术方面的自动化框架，在PC端帮助开发人员快速进行 vue 文件的开发、打包等，这部分可以在官网[搭建开发环境](http://weex.apache.org/cn/guide/set-up-env.html)的教程中获取；二是使 JS 代码能在移动端成功运行起来的各平台 SDK 套件或源码，在编译各平台安装包时加入，[文档](http://weex.apache.org/cn/guide/integrate-to-your-app.html)中也有提及。

除了 Weex 本身，其配套的开发工具比较丰富。有脚手架 [weex-toolkit](http://weex.apache.org/cn/guide/tools/toolkit.html) 、移动端的预览工具 [Weex Playground](http://weex.apache.org/cn/playground.html) 、在线代码执行工具 [Weex Playground](http://dotwe.org/vue) 等。

最后，官方[手册](http://weex.apache.org/cn/references/)介绍了 Weex 支持的 element 组件、内建的模块、各平台的 API 等开发时需要查阅的东东，很全面，在此不赘述。

至于 Vue 我想 Web 前端开发者或多或少都是熟悉的，在此不多做介绍。



## 如何在 Android 上运行一个最简单的例子？

官方的入门教程包中含一段最简单的 `Hello world` 例程，既然 Weex 是为移动端设计，那么是个工程师都想赶快在手机上跑起例程来看看效果，而非在线上模拟器中体验。此时就暴露了文档的缺失——读完《[集成 Weex 到已有应用](https://weex.incubator.apache.org/cn/guide/integrate-to-your-app.html)》一文档后，对没经验的人来说，甚至没办法成功编译出 APK 文件，可谓是出师未捷身先死。

同时，现实总是残酷的。想在 Android 上运行 Weex 应用，还是需要懂得配置 Android 应用、编写一些 Java 代码，这对前端工程师来说，又是一次 ~~雪上加霜~~ 成长的机会=。=

在这里推荐两篇文章帮助大家快速上车，正是通过它们笔者成功实现了最小例程的编译及运行：

第一篇是来自 ATA 的《[weex新手指南](https://www.atatech.org/articles/57091)》，其中包含一个 “知乎日报” 应用源码的详细分析，从中可以知道 **为什么要编写那些 Java 代码** 。

第二篇文章名为《[Weex Android 初体验](http://blog.csdn.net/mengzuixilou/article/details/52690960)》，其更多地覆盖了实践细节上的问题，并且提供了一个类似最小例程的 github repo，可以 **参考其 Java 源码编写自己的代码** 。



## 踩坑心得

1. Weex 环境中没有 DOM，因此无法使用像 Jquery 之类关于 DOM 操作的类库。同样的道理，Weex 中样式只支持 `px` 单位，无法使用 `em` , `rem` 。
2. Weex 中页面宽度是以 750px 作为标准的！更多信息请参考《[Weex学习与实践（一）](http://coderyi.com/posts/weex1/)》，评论区勾股还贴出了社区讨论的链接。
3. 开发时一定要使用手机版的 Playground 进行预览，而不是观察本地浏览器中的画面！


## 更多阅读

- 《[WEEX系列文章汇总](https://www.atatech.org/articles/65406)》：Weex 官方的 ATA 文章，入口帖
- 《[关于Weex，你想了解的一切都在这里](https://www.atatech.org/articles/58474)》：又一 Weex 官方的 ATA 文章，入口帖
- 《[weex vs react-native](https://yq.aliyun.com/articles/57996)》：同为前端无线技术，不对比就难以了解 Weex 的诉求是什么，对吧
- 《[Weex总结之Android Weex工程搭建趟坑](https://www.atatech.org/articles/58910)》：通俗易懂的实践文
- 《[weex新手指南](https://www.atatech.org/articles/57091)》：针对最简单的 Android Weex 代码做了详细说明，并提供了一个详细案例（知乎日报）的分析和 github 源码



## 姿势观摩

- [Weex Vue Examples](https://github.com/Hanks10100/weex-vue-examples)：包含很多基本组件使用的范例
- [weex-hackernews](https://github.com/weexteam/weex-hackernews)：很牛逼的 weex 版 hackernews app，包含 Android 工程在内所有的代码，亲测编译 APK 到 7.0 系统中运行
- [vue-hakcernews-2.0](https://github.com/vuejs/vue-hackernews-2.0)：想了解更多 Vue 开发可以关注此 repo，web 版 hackernews，Vue 作者亲自开发

## 后话

### 没有详细的文档讲解如何产出最终 APK 文件，蛋疼的 CSS 写法，以及种种...
### 已弃坑（微笑脸
