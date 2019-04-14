---
title: Javascript 简洁之道：如何使用类重构
date: 2018-08-06 10:29:06
updated: 2018-08-06 10:29:06
categories:
- Web 前端
tags:
- javascript
- refactor
- react
- hoc
---


> 源文链接：[JavaScript code cleanup: how you can refactor to use Classes](https://medium.freecodecamp.org/javascript-code-cleanup-how-you-can-refactor-to-use-classes-3948118e4468)


在一些小规模的 React 工程中，将组件里所用的所有方法维护在组件内部没什么问题。不过到了中等规模的项目时，你可能会将那些方法从组件抽取到一个 "helper" 里。本文将展示如何使用类（而非导出独立的函数和变量）来组织代码。
<!-- more -->

注：我使用 React，因此这里讨论的例子也均是 React 所写。

## 典型的重构

一次典型的重构中，我们通常会把组件中的函数维护在一个帮助文件里。

从：

```javascript
const MyComponent = () => {
  const someFunction = () => 'Hey, I am text'
  return (
    <div>
      {someFunction()}
    </div>
  )
}
```

到：

```javascript
import { someFunction } from 'functionHelper.js'
const MyComponent = () => {
  return (
    <div>
      {someFunction()}
    </div>
  )
}
```

和

```javascript
export const someFunction = () => 'Hey, I am text'
```

这个例子很二，不过你可以从中看到重构的思路：

1. 将你的函数复制粘贴到一个独立的文件；
2. 导入它们并像之前一样调用。

当逻辑复杂起来，你将不得不传一些如控制状态的对象、函数到这些函数里。如今我就遇到一个问题：我有三个入参相同（一个 `资源` 和一个更新 `资源` 的函数）的函数希望从组件中提取出来。于是乎就酝酿出了更好的方法...

## 使用类重构

我为本文做了一个隆重的演示，你可以在 [GitHub](https://github.com/AmberWilkie/class-demo) 上查阅源码。初始的提交显示所有功能都写在主组件中（`App.js`），而随后的提交逐渐使用了类重构代码。



![](https://ua6wcg.bn.files.1drv.com/y4mYy_pu9AzJk55bWAa0HOHDdjZDUp6QId12MxyJKxSSyBDQX8L-w321hFpMC47CYkQCl1Hly1JCATTUeP6-KTjE05cxDg46eOARJogyaVeodrYaM3bm3i8hcPo9dbhQ7wQOq0A2SAkUGdhaeS1C7xX2Do4yLK_ThI45fsjemuXGxGAb0UeuqpqghFkUUr-kqnLmw7AQZVQh1-kHQTP9mkTYQ)



你可以尝试运行该工程，不过请记得 `yarn install` 安装依赖。

我们从一个"获取"对象（通常是请求一个 API 接口）的组件开始，它有一些确切的属性：repeat（盒子的个数），side（高和宽），text，color。接着我们有一系列操作视图的方法——改变色彩，更新文字，等等。每次视图更改后，我们展示一条信息。

举个例子，这是我们改变宽高的方法：

```javascript
changeSide = side => {
  const obj = {...this.state.obj, side};
  this.fetchObject(obj);
  this.setState({ message: `You changed the sides to ${side} pixels!` });
}
```

可能有些方法中也需要类似的操作，或许这些方法大不相同。这时候我们可能开始考虑将这段代码放到一个帮助文件里，然后创建另一个方法调用 `setState` ，同时需要将状态对象、`side` 参数以及 `this.fetchObject` 传入其中。如果类似的方法多了起来，那么就会存在大量的参数传递，从而导致代码重构起不到作用（或缺乏可读性）。

取而代之，我们可以使用类的构造函数方法来实现：

```javascript
export default class ObjectManipulator {
  constructor( { object, fetchObject, markResettable, updateMessage, updateStateValue } ) {
    this.fetchObject = fetchObject;
    this.markResettable = markResettable;
    this.updateMessage = updateMessage;
    this.updateStateValue = updateStateValue;
  }

  changeSide = ( object, side ) => {
    const newObject = { ...object, side };
    this.fetchObject(newObject);
    this.updateMessage(`You changed the sides to ${side} pixels!`);
    this.markResettable();
    this.updateStateValue('side', side);
  };
};
```

这允许我们创建一个能在主组件中调用其函数的对象：

```javascript
const manipulator = new ObjectManipulator({
  object,
  fetchObject: this.fetchObject,
  markResettable: this.markResettable,
  updateMessage: this.updateMessage,
  updateStateValue: this.updateStateValue,
});
```

上述代码创建了一个对象 `manipulator` —— `ObjectManipulator` 类的实例。当我们调用 `manipulator.changeSide(object, '800')` 时，将执行之前定义好的 `changeSide` 方法。这里无需传递 `updateMessage` 或任何其他方法——当实例创建时已经在构造函数中对这些方法赋好了值。

可以想象如果我们有许多类似的方法需要处理时这招将变得非常管用。就我而言，我需要在一个异步事件后调用 `.then(res => myFunction(res))` 。相比于将 `myFunction` 传入每个函数的做法，在类实例中提前定义它节省了不少代码。

## 保持所有事情井井有条

这种组织方法还可以促进代码互不越界。例如在前文的范例里，按钮的颜色维护在一个对应的数组之中，将此常量放到 `ObjectManipulator` 可以确保其不会与应用中的其他 `colors` 冲突：

```javascript
export default class ObjectManipulator {
  [...]

  colors = ['blue', 'red', 'orange', 'aquamarine', 'green', 'gray', 'magenta'];
};
```

鉴于其他地方存在全局 `colors` 常量的可能性，我可以使用 `manipulator.colors` 正确地获取我想要的颜色。

## 引用

[Good old Mozilla Class docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
