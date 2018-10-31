---
title: 2018 Javascript 测试概观
date: 2018-10-29 21:26:06
tags:
- javascript
- test
- jest
---

> 源文链接：[An Overview of JavaScript Testing in 2018](https://medium.com/welldone-software/an-overview-of-javascript-testing-in-2018-f68950900bc3)
> 原文链接：



*（注：图片均来自原文，如无法正常查看请进行“网络加速”）*

**摘要：使用 Jest 进行单元和集成测试，使用 TestCafe 进行 UI 测试。**



## 引子

看看 Facebook 推出的测试框架 Jest 的 logo：

![jest-logo](https://cdn-images-1.medium.com/max/1600/1*MvrDMspvVYwVpmupxJVWRg.png)

你可以看到他们的口号承诺“无痛”地进行 JavaScript 测试，然而“[评论中的有些人](https://news.ycombinator.com/item?id=13128146#13128900)”指出：

![no-painless-testing](https://cdn-images-1.medium.com/max/1600/1*pnzf1V-QrauJf9gaGDYFFQ.png)

不过 Facebook 确实有一个很棒的理由使用这个口号。通常 JS 开发者都[不太喜欢网站测试](http://2016.stateofjs.com/2016/testing/)，JS 测试意味着受限制、很难实现、进度缓慢有时候代价昂贵。尽管如此，只要使用正确的策略和正确的工具组合，一次接近全覆盖的测试也可以完成得有组织、简单且相对快速。

## 测试的类型

你可以通过[这里](http://stackoverflow.com/questions/520064/what-is-unit-test-integration-test-smoke-test-regression-test)、[这里](https://www.sitepoint.com/javascript-testing-unit-functional-integration/)以及[这里](https://codeutopia.net/blog/2015/04/11/what-are-unit-testing-integration-testing-and-functional-testing/)更深入地了解不同的测试类型。大体上，对于一个网站来说，最重要的几类测试有：

- **单元测试 (Unit Tests)**：通过输入和预期的输出结果测试独立的函数或者类
- **集成测试 (Integration Tests)**：测试流程或者组件的表现是否符合预期，包括副作用
- **UI 测试 (UI Test)**（又名**功能测试 (Functional Tests)**）：在浏览器中对产品进行一些使用场景测试，无视其内部结构，只保证行为符合预期

## 测试工具的类型

测试工具可以划分为以下功能类型，其中一些提供单一功能，而另一些则提供功能组合。为了功能性更加灵活，使用组合工具也很常见，即使存在一款工具可以实现类似的功能。

1. 提供一个**测试结构 (testing structure)** ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Cucumber](https://github.com/cucumber/cucumber-jshttps://github.com/cucumber/cucumber-js))
2. 提供**断言函数 (assertions functions)** ([Chai](http://chaijs.com/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Unexpected](http://unexpected.js.org/))
3. 生成、**展示 (display) 并观察 (watch)**测试结果 ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Karma](https://karma-runner.github.io/))
4. 生成并对比组件和数据结构的**快照 (snapshots)**确保早先运行中的变化符合预期 ([Jest](https://facebook.github.io/jest/), [Ava](https://github.com/avajs/ava))
5. 提供 **mocks**、**spies** 和 **stubs** ([Sinon](http://sinonjs.org/), [Jasmine](http://jasmine.github.io/), [enzyme](http://airbnb.io/enzyme/docs/api/), [Jest](https://facebook.github.io/jest/), [testdouble](https://github.com/testdouble/testdouble.js))
6. 生成**代码覆盖率 (code coverage)** 报告 ([Istanbul](https://gotwarlost.github.io/istanbul/), [Jest](https://facebook.github.io/jest/), [Blanket](http://blanketjs.org/))
7. 提供**浏览器或近似浏览器环境 (browser or browser-like environment)** 并可以在场景执行时进行控制([Protractor](http://www.protractortest.org/)**,** [Nightwatch](http://nightwatchjs.org/), [Phantom](http://phantomjs.org/)**,** [Casper](http://casperjs.org/))

让我们解释上述提到的一些术语：

**测试结构 (testing structure)** 指的是测试的组织方式。如今测试经常被组织成支持[行为驱动开发](https://en.wikipedia.org/wiki/Behavior-driven_development) (behavior-driven development) 的 **BDD 结构 (BDD structure)** 。通常看起来像这样：

```javascript
describe('calculator', function() {
  // describes a module with nested "describe" functions
  describe('add', function() {
    // specify the expected behavior
    it('should add 2 numbers', function() {
       //Use assertion functions to test the expected behavior
       ...  
    })
  })
})
```

**断言函数 (assertions functions)** 确保被测试的变量包含预期值。它们通常看起来像这样，其中最流行的写法莫过于前两种方式：

```javascript
// Chai expect (popular)
expect(foo).to.be.a('string')
expect(foo).to.equal('bar')

// Jasmine expect (popular)
expect(foo).toBeString()
expect(foo).toEqual('bar')

// Chai assert
assert.typeOf(foo, 'string')
assert.equal(foo, 'bar')

// Unexpected expect
expect(foo, 'to be a', 'string')
expect(foo, 'to be', 'bar')
```

*TIP: 这里有一篇关于高级 Jasmine 断言的[好文](https://medium.com/@boriscoder/the-hidden-power-of-jest-matchers-f3d86d8101b0)。*

**[Spies](http://sinonjs.org/releases/v2.1.0/spies/)** 提供了函数相关的信息：函数被调用了多少次，在什么情况下被调用，被谁调用？在集成测试中我们会使用 它确保一个流程中的副作用符合预期，例如在下面的场景中观察该方法是否只执行了一次？

```javascript
it('should call method once with the argument 3', () => {
  
  // create a sinon spy to spy on object.method
  const spy = sinon.spy(object, 'method')
  
  // call the method with the argument "3"
  object.method(3)

  // make sure the object.method was called once, with the right arguments
  assert(spy.withArgs(3).calledOnce)
  
})
```

[**Stubbing** 或 **dubbing**](http://sinonjs.org/releases/v4.2.2/stubs/) （好比电影中的替身演员）通过替换选中的函数来测试模块的正确性。如果我们在测试另外的组件时希望 `user.isValid()` 总是返回 `true`，可以这么做：

```javascript
// Sinon
sinon.stub(user, 'isValid').returns(true)

// Jasmine stubs are actually spies with stubbing functionallity
spyOn(user, 'isValid').andReturns(true)
```

也可以使用 promise 的方式：

```javascript
it('resolves with the right name', done => {
  
  // make sure User.fetch "responds" with our own value "David"
  const stub = sinon
    .stub(User.prototype, 'fetch')
    .resolves({ name: 'David' })
  
  User.fetch()
    .then(user => {
      expect(user.name).toBe('David')
      done()
    })
})
```

[**Mocks** 或 **Fakes**](http://sinonjs.org/releases/v4.2.2/mocks/) 是假装成某一模块或行为测试一系列过程中的不同情况。举例来说，Sinon 能仿冒一个服务器离线和网络状况良好的情况来测试期望的应答。

```javascript
it('returns an object containing all users', done => {
  
  // create and configure the fake server to replace the native network call
  const server = sinon.createFakeServer()
  server.respondWith('GET', '/users', [
    200,
    { 'Content-Type': 'application/json' },
    '[{ "id": 1, "name": "Gwen" },  { "id": 2, "name": "John" }]'
  ])

  // call a process that includes the network request that we mocked
  Users.all()
    .done(collection => {
      const expectedCollection = [
        { id: 1, name: 'Gwen' },
        { id: 2, name: 'John' }
      ]
      expect(collection.toJSON()).to.eql(expectedCollection)
      done()
    })
  
  // respond to the request
  server.respond()
  
  // remove the fake server
  server.restore()
})
```

**快照测试 (Snapshot Testing)** 会对某一数据结构与期望值进行比较。[下面的例子来自 Jest 官方文档](https://facebook.github.io/jest/docs/en/snapshot-testing.html)，展示了某一 `Link` 组件的快照测试。

```javascript
it('renders correctly', () => {
  
  // create an instance of the Link component with page and child text
  const linkInstance = (
    <Link page="http://www.facebook.com">Facebook</Link>
  )
  
  // create a data snapshot of the component
  const tree = renderer.create(linkInstance).toJSON()
  
  // compare the sata to the last snapshot
  expect(tree).toMatchSnapshot()
})
```

在此过程中不会真正渲染该组件并截图，而是在一个独立的文件中保存其内部数据结构，大概长这样：

```javascript
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```

当新产生的快照与上一次不同时，将提示开发者是否同意此次改动是有意为之。

![snapshot-changed](https://cdn-images-1.medium.com/max/1600/0*wqUDMDebG-ipMs5d.png)

> **注意：**快照通常用来比对表现数据的组件，其实它们也可以比较其他的数据类型，如 redux stores 或应用中不同单元的内部结构。

**浏览器或近似浏览器环境 (Browser or browser-like environment)** 可以是以下三种之一：

- [**jsdom**](https://github.com/jsdom/jsdom) —— 一个模拟真实浏览器的纯 JavaScript 环境。它没有 UI 也不做渲染，只提供浏览器 JS 运行时所需的 window, document, body, location, cookies, selectors 等接口。
- **无头浏览器环境 (Headless Browser Environment)** —— 一个为了响应速度更快而缺省 UI 的浏览器。
- **真实浏览器环境 (Real Browser Environment)** —— 一个运行你测试用例的真实浏览器。

## 把所有东西放在一起...

如果可以，我们建议面对所有测试类型都使用同一套工具：相同的**测试结构和语法 (1)**、**断言函数 (2)**、结果报告以及**监控机制 (4)**。

我们还建议创建两个不同的流程，一个运行单元和集成测试，另一个则运行 UI 测试。这是因为 UI 测试需要耗费更长的时间，尤其在跨浏览器测试时通常会使用外部提供的多设备、多浏览器付费服务（这个后续还会讨论），因此相比第一类流程你不会想跑更多的 UI 测试，譬如只在合并一条特性分支前才运行一次。

### 单元测试

应当覆盖应用中所有小而纯粹的单元：工具 (utils)、服务 (services) 以及助手 (helpers)。给这些单元简单和边界情况的输入并**使用断言函数 (3)** 确保输出正确。另外也需要使用**覆盖率报告工具 (6)** 了解哪些单元被测试到了。

> 单元测试是尽可能使用函数式编程以及纯函数的理由之一——你的应用越纯粹就越容易被测试。

### 集成测试

> 老派的测试往往注重单元测试，这导致了应用的各个微观部分功能正常，但是所有流程合在一起时就会出错。
>
> 当你修复了某个问题，但是又破坏了其他部分时，集成测试（包含快照）可以从另一个角度捕捉许多未知的错误。
>
> 同样需要记住的是，在这个真实的世界存在因各种理由而出现的不完美的设计和广泛应用的黑盒子，并不是所有单元模块都是纯函数，也不是所有单元都可以被测试——有一些单元仅作为一个大的流程中的一部分而能被测试到。

集成测试需要覆盖重要的跨模组间流程。相较于单元测试，你可能会使用 **spies (5)** 确保一些预期的副作用而非只对输出做断言，同时使用 **stubs (5)** 模拟、修改在特定测试中不存在的部分流程。

并且与单元测试相反，**一个浏览器或近似浏览器环境 (7)** 可以支持依赖 `window` 、渲染某一组件或与组件交互的各种流程。

**组件快照测试 (4)** 也属于此类测试。它们提供了一种无需真实渲染或使用浏览器就可以测试流程对选中组件影响的方式。

### UI 测试

有时候快速高效的单元和集成测试还不够。

UI 测试总是运行在**一个浏览器或近似浏览器环境 (7)** 中，模拟用户行为（点击，输入，滚动等等...），确保这些场景在终端用户眼中确实工作。

需要记得这类测试是最难准备的。设想你自己创建一个环境在不同的机器、设备、浏览器类型和版本上运行一个测试... 这就是为什么有[很多服务商](https://www.keycdn.com/blog/browser-compatibility-testing-tools)为你提供这项服务。[你还可以在这里发现更多](https://www.guru99.com/top-10-cross-browser-testing-tools.html)。

### 常见的知名测试工具

#### [Jsdom](https://github.com/jsdom/jsdom)

jsdom 是 WHATWG DOM 和 HTML 标准的一个 JavaScript 实现。换言之 jsdom 仅用纯 JS 模拟了一个浏览器环境。之前提过，在这样的模拟浏览器环境中，测试运行的速度十分快。缺点则是在一个真实浏览器之外 jsdom 无法模拟所有，因此这会限制你的测试范围。

值得一提的是 JS 社区很快改进了它，目前的版本已经非常接近真实浏览器。

#### [Istanbul](https://istanbul.js.org/)

Istanbul 会告诉你代码中有多少被单元测试所覆盖。它从状态、行数、函数和分支覆盖维度报告百分比情况以便你更好地理解哪些部分代码没有被覆盖到。

#### [Karma](https://karma-runner.github.io/2.0/index.html)

Karma 允许你在浏览器和近似浏览器环境甚至 jsdom 中进行测试。它运行的测试服务器有一个特殊网页可以让你的测试运行在页面环境中，而这个页面还可以跨浏览器运行。这也意味着测试可以通过 [BrowserStack](https://www.browserstack.com/) 之类的服务远程执行。

#### [Chai](https://github.com/chaijs/chai)

Chai 是最流行的断言库。*（译者注：人狠话不多啊...）*

#### [Unexpected](https://github.com/unexpectedjs/unexpected)

Unexpected 是一个与 Chai 的语法稍有不同的断言库。其可扩展性衍生出了一些使断言功能更高级的库例如 [unexpected-react](https://github.com/bruderstein/unexpected-react) ，你可以从[这里](https://medium.com/@bruderstein/enzyme-vs-unexpected-react-ee9cb099d12b)了解更多。

#### [Sinon.js](http://sinonjs.org/)

Sinon 是一个强大的 spies, stubs 和 mocks 独立库，可与任何单元测试框架配合工作。

#### [testdouble.js](https://github.com/testdouble/testdouble.js)

testdouble 是一个声称比 Sinon 更加优秀但名气稍逊的库。其设计、哲学和特性与 Sinon 略有不同使其在许多情况下更实用，你可以从[这里](https://www.sitepoint.com/javascript-testing-tool-showdown-sinon-js-vs-testdouble-js/)、[这里](https://spin.atomicobject.com/2016/03/21/javascript-mocking-testdouble/)和[这里](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html)读到更多。

#### [Wallaby](https://wallabyjs.com/)

Wallaby 是另一款值得一提的工具。尽管需要付费，但很多用户推荐购买。它运行在你的 IDE （支持所有主流 IDE）之上，执行代码变更相关的测试，并在失败后实时定位到代码级别报错。

![wallaby](https://cdn-images-1.medium.com/max/1600/1*b-jNPVyrwyAJssbHNYPwtQ.png)

#### [Cucumber](https://github.com/cucumber/cucumber-js)

Cucumber 通过按验收准则文件 (accpetance criteria files，使用 **Gherkin** 语法) 划分并与之对应的方式帮助编写 BDD 结构的测试用例。框架支持的多种语言都可以编写测试用例，包含我们关注的 JS：

```shell
# like-article.feature
Feature: A reader can share an article to social networks
  As a reader
  I want to share articles
  So that I can notify my friends about an article I liked
Scenario: An article was opened
    Given I'm inside an article
    When I share the article
    Then the article should change to a "shared" state
```

```javascript
// like-article.step.js
module.exports = function() {
  this.Given(/^I'm inside an article$/, function(callback) {
    // functional testing tool code
  })

  this.When(/^I share the article$/, function(callback) {
    // functional testing tool code
  })

  this.Then(/^the article should change to a "shared" state$/, function(callback) {
    // functional testing tool code
  })
}
```

许多团队会发现这种语法比 TDD 更方便。

## 选择你的单元和集成测试框架

你应该做的第一个选择也许是框架与其支持库。建议使用框架内提供的工具直到依赖某些独一无二工具的需求出现。

> * 简而言之，如果你只想入门或针对大型功能寻找一款够快的框架，选择 **Jest**。
> * 如果你想要灵活和可扩展的配置，选择 **Mocha**。
> * 如果你喜欢简单选择 **Ava**。
> * 如果你想要非常底层的框架，选择 **tape**。

这里有一份介绍主流工具及其特性的列表：

#### [mocha](https://github.com/mochajs/mocha)

Mocha 是当前被使用最多的库。不像 Jasmine，它使用第三方的断言、mocking 和 spying 工具（通常是  Enzyme 和 Chai ）。这意味着 Mocha 在初始配置时有一定难度并需要了解更多库，但这也会变的更加灵活、更开放去扩展。

举例来说，如果你想要[特殊的断言逻辑](https://mochajs.org/#assertions)，你可以 fork Chai 并在你的断言库中只替换 Chai。