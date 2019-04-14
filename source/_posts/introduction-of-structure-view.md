---
title: 十分钟带你了解国产自制开源插件 structure-view
date: 2017-11-21 16:19:22
updated: 2017-11-24 00:00:00
categories:
- Web 前端
tags:
- structure-view
- outline
- ctags
- open source
- javascript
- ctags
- outline view
- structure view
- atom
- ide
---

structure-view （以下简称 SV）是在开发 YunOS Studio（AliOS Studio 前身）时开源出来的一款代码结构提示插件。代码结构提示是一项由来已久的影响开发效率的功能，早在 VIM 时期就有经典的 ctags + Taglist 插件组合来实现这一功能，在桌面时代各大流行的 IDE 也都支持此功能，如 Eclipse 中的 Outline View 或 Webstorm 中的 Structure View。

YunOS Studio 基于扩展能力优异的 Atom 编辑器开发，由于 Atom 的生态市场缺乏一款好用的代码结构提示插件，因此 SV 应运而生（注：目前主流相关插件的比较可参考附件 PPT 中的 “开发由来与现状” 章节）。
<!-- more -->

自从今年九月初将其开源并发布到 Atom 市场中，2个多月的时间达到了 800 余次的下载量，总计 20+ 的 star 数量，以及数十个 issues 和 PR。在没（精）啥（力）宣（有）传（限）的情况下，有人下载使用、提问题、提需求，甚至主动贡献 PR，都给了笔者极大的鼓舞，因此在此分享一下这个插件的设计，也欢迎 Atom 党服用此插件。

{% img "https://wk4tlg.bn.files.1drv.com/y4mN2I10UfETZdexdzTftd3jf_T3Ib94IPry-EWT69byliaUtzRSIo5zJ2DW4Uqib05ZmX4mPIq0lfLS_CkKf6-aYB6GFJRE7rmfguVYvz1uaJg2awvZfzPPy-C3hgQ5ORboLxnb5b-xY2ekYKwT1wThsrA3s2VtyTcSQnVJPrPmMRq-uYhG-Gf2EHM2lqnZrmjWUT6qxP5gskoz-5hPJjtmg" %}

链接：

- [Atom 市场](https://atom.io/packages/structure-view)
- [Github](https://github.com/alibaba/structure-view)

*平（臭）心（不）而（要）论（脸），eating my own dog food 这么久，我觉得挺好用的 =。=*



## 需求与难点

### 结合业务背景与现状谈需求

SV 最初是为 YunOS Studio 设计，其用户——YunOS 开发者主要使用 Web 相关语言开发，因此对 HTML, CSS, Javascript 的支持是第一要务 。

其次，SV 应该具备目前主流类似插件的功能，总不能被“活化石” ctags + Taglist 给 K.O. 了。因此有些基本功能一定要满足：

- 解析出代码的基本类型，如 HTML 的 Element，CSS 的 Selector，JS 的 Function, Class 等
- 将上述类型展现在界面上，通常是树状图的形式
- 点击树状图上的节点，编辑区域可快速定位到其对应的代码位置

然后，扩展性是非常重要的一点。资源有限，不可能一口气支持所有语言，先把第一要务干完了，才能展望别的语言。秉着不能挖坑让自己跳的指导思想，一定要在初始阶段设计好扩展性。

最后，能开源当然是最好的，一个人支持那么多语言是会累死的，能忽悠热心网友来干点活多好呀。这也从侧门对扩展性提出了要求。

最后的最后，快速落地。在项目调研阶段笔者就发现，Atom 上不仅缺少好用的代码结构提示插件，即使是使用量最多的一个，作者也疑似不维护、消失很久了，项目相关的 issues 中已有一些对此类插件的明确需求。如果能快速落地，也就有机会获得一些外部开发者用户。

### 难吗？难

> 你永远不知道下一份读取的代码是用什么语言写的 Orz

从以下几个维度分析下难在哪：

- 广度：用户使用的语言无法预测，至少要覆盖主流语言吧，不然怎么好意思拿得出手
- 深度：对我们业务所用的语言，一定要能全面地解析；对于主流语言，至少也得解析出个轮廓
- 轻量：Atom 性能本来就不算好（当然人家也不主打性能…），所以插件一定要轻，切莫“喧宾夺主”
- 广度和深度本来就很难同时满足，还要保证轻量，tradeoff 的哲学该如何落实

## 设计与实现

### 目前主流的解决方案

当初调研时发现， Atom 市场中的竞品多是封装经典的 [ctags](http://ctags.sourceforge.net/) 插件，其工作原理如下：

1. 提前内置 Windows/macOS /Linux 三个平台的二进制执行文件，以及其需要的配置文件 `.ctags` 
2. 当插件工作时，命令行调用 ctags 解析，获取 stdout 输出的数据
3. 将 ctags 输出的数据进行加工，以 web 页面的形式呈现在 Atom 的视图中

由于  `.ctags` 是正则匹配脚本，也就是说 ctags 其实是利用正则匹配方法处理代码。这种方法的好处是添加规则方便，规则越全面解析效果理论上越好。但是问题也显而易见，光靠正则匹配很难对 OOP 语言中的继承关系进行解析，更别提 JavaScript 这种靠原型链吃饭的语言了。

另外还有一种解决方案源自 Facebook 出品的 Nuclide IDE，SV 在设计之初并未参考到，不过后来发现是类似的思路 。Nuclide 中的 Outline 视图提供了代码结构提示和快速导航的功能，针对不同的语言使用不同的解析器，例如使用了自家的 Flow 类型检查工具处理 JavaScript 代码，而使用了 Python 官方的解析器处理 Python 代码。

这种方法的好处自然是有深度，能把支持的语言解析到位，但坏处也十分明显。首先是依赖性太强，之所以没有很深入地调研 Nuclide，是因为笔者在解析 JavaScript 时提醒安装 Flow，但是 Nuclide 并没有提供自动化安装功能，需要用户到 Flow 的官网学习、完成这件事情，这显然很蠢，也不知道现在改进没...其次就是支持的语言类型有所限制，需要大量的资源支持新的语言开发，明显不适合笔者这种“单兵作战”模式。

### 流程设计

SV 的代码结构解析流程与现有插件大体一致，如下图所示。

{% img "https://wk4ulg.bn.files.1drv.com/y4mc9Zhw83pbn0yN-CveyHdr9ui5NuMjEmSlmyKMVMupYsffd6LTZRTjbV2Dn13JloGV7wGVHj4tJ0Po66jJp3GzRiUh5OFWWuyKIcbQYlKb0NJRhiSMSqsCibAZ1g2qT00miHPlfkW0Q4QsqaweuVIPwJBSGyS8a6JYF4t0DkxxJ31heIREKZMMz68_5-gYdt5ssjc9YXqscYUvNQMIGhuVg" %}

一次完整的解析显示流程可分解为以下几步：

1. 获取当前代码文件的绝对路径
2. 调用文件系统接口读取代码内容
3. **选择合适的语法分析器**解析代码，获取 tags 数据
4. Tag parser 将 tags 处理为前端可用的格式，例如给每个 tag 添加 Point 字段用于 Atom 编辑器的定位
5. 渲染树状图

第三步中提到“选择合适的语法分析器”意味着 SV 中不止一个语法分析器，这是 SV 的一大特色，下一小节中会详细说明。

### 架构设计与实现

SV 的设计思想其实与 Nuclide 相似，也集成了多个语法解析器，但主要有两点不同：

- 基于给用户更好的使用体验以及满足轻量需求的出发点，SV 的解析引擎以 JavaScript 三方库为主，在安装插件时一并安装，无需用户后续手动操作
- SV 中设计了一个通用的语法解析器，定位为“万金油”角色，以满足支持语言的广度

具体的架构图如下所示。

{% img "https://wk4vlg.bn.files.1drv.com/y4mLUlTJAXfBGYQwwryeg8IwBCTnFZRjXG7pqyUlIt_i5R04DhxiqJGEHczlmvIfqYusKqKxV-48n8yLPlL8LexeYRBioLbSvOUViST6YEneIe1wQc_X7zyCSsrXOftKnUIoY5mHDLBK-9s9XrEy26WVjD1bAE52y21oEoRuAQ6IENMTlLt_eA1RNW3FYuvMvMhjGqCdg6zkfydvriQrtsVsw" %}

#### Tag Generator

在 Tag Generator 层封装了各种语言对应的专业语法解析器，SV 判断出代码文件的语言类型，便会选择对应的语法解析器。如果没有某一个语言对应的解析器，则代表目前 SV 还未深度支持，此时就会使用一个名为 Universal 的解析器进行处理。

Universal 顾名思义就是通用的解决方案，虽不像专业的语法解析器那样能解析得很全面，但是它可以尽可能多地覆盖各种语言，以确保遇到未深度支持的语言时也能得到代码的初略结构信息。秉持着 DRY (Don't repeat yourself) 原则，SV 借鉴了现有插件，通过配置、使用 ctags 插件来实现这个“万金油”角色。

由于语法解析器使用了不同的第三方库，获取的原始 tag 数据形式也是各有不同。因此在封装第三方库的过程中，这些语法解析器会遵循统一的数据格式，整理出 `name` `kind` `position` `parent` `id` `child` 等字段。

此外，Tag Generator 也统一了语法解析器的 API（目前仅有一个），为扩展性提供了保证。未来支持新的语言时，只需在相应目录添加解析器文件，SV 会自动搜索并调用统一的接口。

#### Tag Parser

Tag Parser 的作用很简单，就是为 View Controller 提供整理好的树结构资料，方便后者直接渲染。

由于 Tag Generator 封装了不同的三方库进行 tags 解析，返回的数据结构主要有两种，一是哈希列表，另一种是 AST。这两种格式各有优点，前者在定位 tag 时方便找到对应的节点，无需遍历整颗树；后者作为一颗树，在渲染树状图时水到渠成。

因此 SV 同时维护了这两种结构的数据，如果语法解析器提供的是哈希列表，Tag Parser 就通过该列表生成相应的 AST，反之亦然。

#### View Controller

这一层使用了开源的 MVVM UI 框架 Vue 实现渲染逻辑和交互逻辑，在此就不赘述。

## 展望

语言类型的支持是一项任重而道远的工作，限于人力资源，只能从业务需求和笔者常用的语言出发进行支持。但是个人力量终归是有限的，因此在设计 SV 之初，笔者就考虑到了开源社区，为 SV 编写了详细的英文文档。SV 的用户多是软件开发者，如果能获得他们的认可，提供简单的扩展方法，想必他们中也是有热心人士愿意贡献 PR 的。事实证明，SV 得到了一些 Atom 用户的关注和认同，也有开发者为了自己习惯的语言补充了 `.ctags` 配置文件，甚至编写语法解析器。

目前语法解析器主要使用 JavaScript 编写的第三方解析库，这将会受到一定的限制。例如 C/C++ 语言的 AST 解析器有 C/Python/Ruby 语言版本，但未必有 JavaScript 版本，即使有也可能存在健壮性方面的担忧，提供一个通用的办法解决这个问题也极具意义。

从产品角度看，SV 目前非常粗糙，需要好好打磨。功能上仅支持基本的解析、展示、定位，与主流 IDE 的类似插件相比有一定的差距，需要多向如 WebStorm 之类的优质 IDE 学习。

最后，SV 的架构设计考虑到了移植性。近年来 VS Code 的横空出世，以其高性能以及对 TypeScript 的优异支持，吸引了一部分 Atom 用户转投阵营。VS Code 同样允许第三方开发者发布插件，目前其市场中的竞品插件功能性较弱、使用人数较低，有机会做得更好。SV 独立出了 View Controller 层，未来如果被移植到其他热门编辑器如 VS Code 时，重写这一层即可。当然，这需要 VS Code 提供更多关于 UI 方面的接口。

## 总结

- 为 ATOM 设计、（目前）专注 Web 前端开发的代码结构提示工具
- 灵活的代码标签生成器架构保证了工具的可扩展性
- 吸取市面上主流IDE工具的功能特性，力求好用易用
- 独立设计、开发，无 IP 依赖，利于推广和开源

附件：[structure-view-intro-cn-v1.0.pdf](https://github.com/Joouis/blog/files/1500624/structure-view-intro-cn-v1.0.pdf)