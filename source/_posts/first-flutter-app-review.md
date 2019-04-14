---
title: 简易计数器——年轻人的第一个Flutter应用
date: 2018-07-25 02:17:05
updated: 2018-07-25 02:17:05
categories:
- Web 前端
tags:
- flutter
- app
- dart
- mobile
---



## TL;DR

站在负责 UI 层的 Web 前端视角看无线端框架，评判的第一个标准无非是文档够不够全、Demo 能不能很容易在手机上跑起来。近来的热门框架 Flutter 就上手而言给出了漂亮的答案。
<!-- more -->

## Prolog

- 我是谁：曾是 Embedded C 开发的 Web 前端攻城狮，完全没有 `dart` 或是 `flutter` 开发经验
- 开发环境：MacBook Pro，XCode with iOS simulator
- 学习初心：2018 年的 Weex 开发体验依然不好，不如拥抱下一个技术红利（假笑.jpg
- 种草文：什么你还没听过 Flutter，简单介绍一下吧《[Release Flutter的最后一公里](https://mp.weixin.qq.com/s/xV-FGR9o2ODLFJFq4YwnKg)》
- 最后一句话：以下"学习笔记"中，若有错误/模糊概念请友好指正，么么哒

## Introduction

Flutter 最近真的是大热，可能笔者身处阿里的缘故，自从咸鱼在他们的商品详情页成功使用后，集团内无论是 ATA 技术论坛还是周报都能看到有人学习研究这门技术。

笔者一直都想尝试原生的无线端开发，在错过 React Native、受够 Weex 之后，身处这个时间点刚好趁热学习一下 Flutter，说不定这次真的跟过往的轮子不一样。

## Setup

照着[官方文档](https://flutter.io/get-started/install/)来，一切还算顺利：装好 Flutter SDK，`flutter doctor` 把相关依赖都装好，插上 iPhone 手机，VS Code 新建一个 `Flutter Demo` 工程，调试...

在真机调试时，出现了第一个与苹果应用验证相关的问题：

```
Failed to create provisioning profile.
The app ID "com.example.flutterFlutterDemo" cannot be registered to your development team. Change your bundle identifier to a unique string to try again.
```

解决方法有两种：

1. 使用自己的 Apple ID，详见[这里](http://bbs.sightp.com/thread-1241-1-1.html)；（好吧我也没试过）
2. 使用模拟器。

命令行输入 `open ios/Runner.xcworkspace` 打开 Runner 工程，选择模拟器即可跑起来默认的 Demo 工程。

## Code Review for Official Counter

### Intro

官方默认的 Demo 工程是一个简易计数器。先看眼效果，真的非常简单，右下角点击加号，中间的数字对应增长，就酱~

![](https://ua60cg.bn.files.1drv.com/y4mx50xV8910Opf1_TigYabB06b-3qTsFGJf8KmR8dFIArUO5nb5BpePdYkUfp_JA9tj_DeBthEENIc1l8QFt9hVkSDojcSlBHbx7tIxOlqwXqVyrvW1pTDYPTNOj57MVyos5giC9Uv_YTAlLDUcz5ZsH-7vvVEwt_tiwodR5tawta_g1V30y9Br8QdL6TAmuF9Rf603Y4DUjvVFrXZ6a0UwQ)



外行看热闹，内行看门道。应用层代码总共就六十多行，反正也不会 Dart，就边看边学习一下。

### Import

```dart
import 'package:flutter/material.dart';
```

首先是 Dart 依赖的导入。Dart 使用 `pubspec.yaml` 文件定义工程和依赖，类似 Node 世界里的 `package.json`；`pub` 则是对应 `npm` 的存在，`pub get` 一下即可安装相关的依赖包；安装完成后，会在项目根目录生成一个 `.packages` 文件，记录了所有依赖包在系统中对应的缓存地址，大概长这样：

```shell
# Generated by pub on 2018-07-18 20:28:35.360131.
analyzer:file:///Users/joou/workspace/flutter/.pub-cache/hosted/pub.dartlang.org/analyzer-0.31.2-alpha.2/lib/
```

再来说说最上方的引用语句。除了引用相对路径的 dart 文件外，引用包需加上 `package:` 前缀，Dart 运行时会自动去查询包文件。那这里引用的 `flutter/material.dart` 在哪呢？笔者的第一反应是在 Flutter SDK 工程中，果不其然在此：

```shell
joou 2018-07-19 Thu 11:36:~/workspace/flutter/packages/flutter/lib(beta 50d8h)
$ ls
analysis_options_user.yaml foundation.dart            painting.dart              scheduler.dart             src
animation.dart             gestures.dart              physics.dart               semantics.dart             widgets.dart
cupertino.dart             material.dart              rendering.dart             services.dart
```

SDK 中已经内置了不少包，让我们看看 `material.dart` 这个物料包里有些啥：

```dart
export 'src/material/about.dart';
export 'src/material/animated_icons.dart';
export 'src/material/app.dart';
export 'src/material/app_bar.dart';
export 'src/material/arc.dart';
export 'src/material/back_button.dart';
// ...
```

所以说 `flutter/lib` 下的包文件类似一个入口，类似 C 语言里的 header file，暴露给外界 `flutter/lib/src` 中的各种组件，想要深入了解某个包的具体实现去对应目录下即可找到真相。

当然，除了自己 xjb 探索外，也别忘了阅读[官方文档](https://docs.flutter.io/flutter/material/material-library.html)，因为接下来的代码基本都要靠文档救命。

### App Entry

```dart
void main() => runApp(new MyApp());
```

Dart 的每一个程序应用最顶层都要有一个 `main()` 函数作为入口，这和 C 语言是一致的。此外还有 `void` 类型，代表返回值可以是任意类型。Dart 是 OO 范式的语言，函数、方法都是对象，存在一个对应的类型，因此在定义函数时最好申明其返回值类型。`=>` 语法是 `{ return expr; }` 的简写，注意里面不允许出现 statement (Eg. `if` )。上述代码一样可改写为：

```dart
void main() {
  return runApp(new MyApp());
}
```

`runApp()` 是 Flutter 提供的[函数](https://docs.flutter.io/flutter/widgets/runApp.html)，其作用是将一个 `Widget` 类的实例（作为其入参）挂载（attach）到屏幕上，逻辑大概如下：

1. 检查 `WidgetsFlutterBinding` 是否初始化；
2. 将控件（widget）实例挂载到 `renderViewElement` 上，这个元素是渲染层级的根节点实例；
3. 调用 `scheduleWarmUpFrame()` 方法，开始渲染。

### Stateless Widget

接下来让我们看看 `MyApp` 类。

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Flutter Counter',
      theme: new ThemeData(
        primarySwatch: Colors.orange,
      ),
      home: new MyHomePage(title: 'Flutter Trivial Counter 🙃'),
    );
  }
}
```

此控件是应用的根节点。首先它作为子类继承了 `StatelessWidget` ，无状态是指它不需要可变状态，而是通过构建其他的控件来更具体地描述 UI，构建过程以递归方式执行，直到 UI 被完全具象化。可能这么说比较抽象，不过先别急，后面的代码会解释什么叫具象化。在 `MyApp` 中，重载了 `build` 方法，实例化了一个 `MaterialApp` 对象。

如果你写过 React 框架，那么我想换个方法解释可能更好理解。`StatelessWidget` 好比 React 中的 `PureComponent` ，而 `Widget` 类的 `build` 方法好比 React 中的 `render`。`build` 方法负责描述控件代表的 UI ，入参是构造的上下文，内容则是使用 `MaterialApp` 对象的实例描述 UI。实例化的过程中进行了一些配置，例如命名为 "Flutter Counter"，使用橙色主题，主页标题栏的文字设为 "Flutter Trivial Counter 🙃"。即便完全不知道 `MaterialApp` 类的内部实现，也很容易猜到它更具体地定义了一些 UI 内容。

React 是具备生命周期的，当 `componentWillUpdate` 钩子触发后将执行 `render` 方法，重新渲染组件。而 `PureComponent` 则是通过在渲染前（例如在 `shouldComponentUpdate` 钩子中）浅对比新旧 props 和 state 判断是否需要重新渲染，从而实现性能优化。同理，控件的 `build` 方法将会在其 lifetime 的以下时刻被调用：

- 调用 [iniState](https://docs.flutter.io/flutter/widgets/State/initState.html) 之后。
- 调用 [didUpdateWidget](https://docs.flutter.io/flutter/widgets/State/didUpdateWidget.html) 之后。
- 收到 [setState](https://docs.flutter.io/flutter/widgets/State/setState.html) 的请求后。
- 在 [State](https://docs.flutter.io/flutter/widgets/State-class.html) 对象的依赖之一改变（例如被之前的 [build](https://docs.flutter.io/flutter/widgets/State/build.html) 方法引用的某个 [InheritedWidget](https://docs.flutter.io/flutter/widgets/InheritedWidget-class.html) 发生了改变）后。
- 调用 [deactivate](https://docs.flutter.io/flutter/widgets/State/deactivate.html) 后重新在挂件树的另一个位置注入 [State](https://docs.flutter.io/flutter/widgets/State-class.html) 类。

而 `StatelessWidget` 中的 `build` 方法仅在三种情况中被调用：

- 控件第一次被插入挂件树中，也就是初始化时。
- 控件的父亲改变了自身配置。
- 控件依赖的继承控件类改变。

这和 React 是何等的相似（此处感慨 3 秒...）！因此减少无状态控件的重新构建也是一门优化技巧，在此不延伸了，有兴趣请看[文档](https://docs.flutter.io/flutter/widgets/StatelessWidget-class.html)。至于 `MaterialApp` 类的内部配置在此也不深入，有机会再研究、分享一下这些官方组件。让我们看看配置中描述主页的 `MyHomePage` 挂件吧，这是在应用代码中实现的。

### Stateful Widget

```dart
class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;
  @override
  _MyHomePageState createState() => new _MyHomePageState();
}
```

`MyHomePage` 是一个有状态的挂件，最底部重载了 `createState` 方法定义其状态，用来描述 UI，这个稍后再细看。通常如果父类（superclass）没有默认的构造函数，dart 则要求子类在代码块的初始位置使用 `:` 指定父类的构造函数。而 `Key key` 用来申明可选参数（optional parameter），此处申明了 `title` 变量（field）。`title` 变量的值由父类赋予，被其 `State` 类的 `build` 方法使用渲染，像这种子类挂件的变量通常定义为 `final` 类型，意味着变量只能被赋值一次。与 `const` 不同的是 `final` 变量在程序运行时才赋值，而非编译时期就定义好的常量。

### State

让我们最后瞅瞅首页挂件的状态类。

```dart
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title),
      ),
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            new Text(
              '老铁没毛病，双击:',
            ),
            new Text(
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: new Icon(Icons.add),
      ),
    );
  }
}
```

好吧这也是笔者第一次接触泛型，看过[官方文档](https://www.dartlang.org/guides/language/language-tour#generics)的例子后觉得还是比较好理解。`MyHomePage` 继承了拥有可变状态的 `StatefulWidget` 类，当其第一次被插入控件树中时，Flutter 框架会调用 `createState` 函数创建一个全新的 `_MyHomePageState` 实例与树中的位置相关联。当挂件的父组件重新构建（rebuild）时，父组件会重新创建一个 `MyHomePage` 实例，但是将复用已有的 `_MyHomePageState` 对象。

`_MyHomePageState` 定义了一个数字类型的 `_counter` ，另外自定义了一个 `_incrementCounter` 方法每次对 `_counter` 值加一。加一语句写在 `setState` 方法中，当被执行完后，会触发 Flutter 框架重新运行下方的 `build` 方法，以达到最终更新界面的目的。虽然推荐将状态变更的代码写在 `setState` 的回调函数中，但这么改写也是可以正常工作的...

```dart
void _incrementCounter() {
  _counter++;
  setState(() {});
}
```

最后的最后，在 `_MyHomePageState` 的 `build` 方法里，初始化并返回了一个 `Scaffold` 实例，源自 Material 组件。每当 `setState` 被触发后，就将执行一次 `build` 方法。不过 Flutter 框架号称优化过重跑 `build` 方法的性能，无需担心重新构建的成本。

`Scaffold` 类配置了三处地方：

- 新建一个 `appBar` 实例。这里通过 `widget` 属性获取到了 `MyHomePage` 挂件中的属性，此外还可以通过 [`didUpdateWidget`](https://docs.flutter.io/flutter/widgets/State-class.html#didUpdateWidget) 钩子在 `widget` 发生改变时进行操作。
- `body` 属性被赋予了 `Center` 实例，无论是 `Center` 还是 `Column` 都是布局（layout）挂件。前者可以定位到父组件的中心位置，而后者将会水平排列其子组件。`Column` 挂件有多种属性控制样式，这里使用了 `mainAxisAlignment` 将其子组件垂直居中（别糊涂，列的主轴是垂直方向）。
- 屏幕右下角的按钮由 `FloatingActionButton` 描述，使用了加号图标，绑定之前定义好的 `_incrementCounter` 函数作为 `onPressed` 事件的处理者。

好了说了这么多组件，让我们使用 Flutter tool 的 `Toggle Debug Paint` 指令直观感受一把。

![](https://ua6zcg.bn.files.1drv.com/y4mUF6sd-hueRZgEbFQx1UmVfQaYGtyEK6TXqqpD3Z-VB4Bj49dDyTKooH_yZESWfth4XK8OHc_p-WlaNIEaCBv51mZYrSlNxtjPJShjlLFWf1qLXV3-5OPc88KJQQxt2_WGdzV32Fljycb9HjfMPAaqaMUm6_tyXGZ_NJilhRUVpX92WQ8LRT1j_CQPOHxpUXajsuzAuDrht8FpZt-jc4ItA)

## End

笔者去年写了篇 Weex 从入门到放弃的上手文，说实话这次 Flutter 上手体验要比 Weex 好非常多——详实的文档，齐全的基础脚手架，轻松在手机/模拟器上运行应用。

对于没有客户端开发经验的笔者来说，能看着文档打通流程（实际编译出一个安装包并在对应平台上安装、执行）是一件非常关键的事情，它意味着小白也能使用这项技术栈独立开发简单的应用，能给学习者十足的信心。过去接触 Weex，只能使用 Playground App 扫码跑 demo，非常的“半成品”，而 Flutter 轻松几个指令，就在你的设备上跑起了你的工程，赞！

至于 Flutter 相关的信息，如学习 Dart 语言、Flutter 入门教程、代码范例、官方库接口等资料已经颇为丰富，Stack Overflow 上也有一些讨论的话题，对于一个处于 Beta 阶段的框架来很成熟了。

接下来就期待国内外有更多关于 Flutter 的线上生产实践经验，笔者有空也会接着研究并分享 Flutter 的知识。

如果你看了这篇文章感到意犹未尽，那么再提供一点延伸阅读：

- [Flutter's Rendering Pipeline](https://www.youtube.com/watch?v=UUfXWzp0-DU)
- [A Tour of the Flutter Widget Framework](https://flutter.io/widgets-intro/)

相信你能从上述两个方向发现更多一手、可靠、丰富的信息！
