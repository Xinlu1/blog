---
title: 2018 年 JavaScript 测试概观
date: 2018-10-29 21:26:06
updated: 2018-12-14 00:00:00
categories:
- Web 前端
tags:
- javascript
- test
- unit test
- integration test
- ui test
- mocha
- jasmine
- jest
- cucumber
- chai
- unexpected
- karma
- ava
- sinon
- enzyme
- testdouble
- istanbul
- blanket
- protractor
- nightwatch
- phantom
- casper
- selenium
- appium
- webdriverio
- testcafe
- cypress
- puppeteer
- nightmare
- codeceptjs
---


> 源文链接：[An Overview of JavaScript Testing in 2018](https://medium.com/welldone-software/an-overview-of-javascript-testing-in-2018-f68950900bc3)


**摘要：使用 Jest 进行单元和集成测试，使用 TestCafe 进行 UI 测试。**
<!-- more -->


## 引子

看看 Facebook 推出的测试框架 Jest 的 logo：

![](https://ua6ucg.bn.files.1drv.com/y4mzt4dGxfvhghwHmJ1cOG61-jm4I3sK7rl1JeHhEqMY9t8bKW2Ednwn7ntduQywMmbQ6WAA0aKyvkcuTySVHOV4mgEJG8jxro9Cowdfi_oi8PBPK7A8muv2Rfq5rUQ4KAYyucW79coT9KXdQBtOvfTgIrhI0x2b-sIuloCLvSrNnNMXGJ3UoulMDRbZ2mSAuvL_HX5-kdXVt0fKl7GcvhTTg)

你可以看到他们的口号承诺“无痛”地进行 JavaScript 测试，然而“[评论中的某些人](https://news.ycombinator.com/item?id=13128146#13128900)”指出：

![](https://uq63cg.bn.files.1drv.com/y4mBInnhjMSj7yDXlFnklP4Ts-MyNAfN0ptQlUnrBzA5yEC2mA2vP4uxB347fuh86GLCNnQJwqNuQgvkCcLWqoW3ZdOrnS-tAJO4fbma7Ri8cE2kbu2c3EAl4jXPiyobqVKhrSb6gLuqG8UTlLuBAuw3vJ2jAqhjKktMsZn867h0MyMk_oyA_hRLbmSjUh8WGaeAtPPt90-dHU-znudYdueZA)

不过 Facebook 确实有一个很棒的理由使用这个口号。通常 JS 开发者都[不太喜欢网站测试](http://2016.stateofjs.com/2016/testing/)，JS 测试意味着受限制、很难实现、进度缓慢且时而代价昂贵。尽管如此，只要使用正确的策略和正确的工具组合，一次接近全覆盖的测试也可以完成得有组织、简单并相对快速。



## 测试的类型

你可以通过[这里](http://stackoverflow.com/questions/520064/what-is-unit-test-integration-test-smoke-test-regression-test)、[这里](https://www.sitepoint.com/javascript-testing-unit-functional-integration/)以及[这里](https://codeutopia.net/blog/2015/04/11/what-are-unit-testing-integration-testing-and-functional-testing/)更深入地了解不同的测试类型。大体上，对于一个网站来说，最重要的几类测试有：

- **单元测试 (Unit Tests)**：通过输入和预期的输出结果测试独立的函数或者类；
- **集成测试 (Integration Tests)**：测试流程或组件的表现是否符合预期，包括副作用；
- **UI 测试 (UI Test)**（又名**功能测试 (Functional Tests)**）：在浏览器中对产品进行一些使用场景测试，无视其内部结构，只保证行为符合预期。



## 测试工具的类型

测试工具可以划分为以下功能类型，其中一些提供单一功能，而另一些则提供功能组合。为了功能性更加灵活，使用组合工具也很常见，即使存在一款工具可以实现类似的功能。

1. 提供一个**测试结构 (testing structure)** ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Cucumber](https://github.com/cucumber/cucumber-jshttps://github.com/cucumber/cucumber-js))
2. 提供**断言函数 (assertions functions)** ([Chai](http://chaijs.com/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Unexpected](http://unexpected.js.org/))
3. 生成、**展示 (display) 并观察 (watch)**测试结果 ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Karma](https://karma-runner.github.io/))
4. 生成并对比组件和数据结构的**快照 (snapshots)**确保早先运行中的变化符合预期 ([Jest](https://facebook.github.io/jest/), [Ava](https://github.com/avajs/ava))
5. 提供 **mocks**、**spies** 和 **stubs** ([Sinon](http://sinonjs.org/), [Jasmine](http://jasmine.github.io/), [enzyme](http://airbnb.io/enzyme/docs/api/), [Jest](https://facebook.github.io/jest/), [testdouble](https://github.com/testdouble/testdouble.js))
6. 生成**代码覆盖 (code coverage)** 报告 ([Istanbul](https://gotwarlost.github.io/istanbul/), [Jest](https://facebook.github.io/jest/), [Blanket](http://blanketjs.org/))
7. 提供**浏览器或近似浏览器环境 (browser or browser-like environment)** 并可以在场景执行时进行控制 ([Protractor](http://www.protractortest.org/)**,** [Nightwatch](http://nightwatchjs.org/), [Phantom](http://phantomjs.org/)**,** [Casper](http://casperjs.org/))

让我们解释上述提到的一些术语：

**测试结构**指的是测试的组织方式。如今测试经常被组织成支持[行为驱动开发](https://en.wikipedia.org/wiki/Behavior-driven_development) (behavior-driven development) 的 **BDD 结构 (BDD structure)** 。通常看起来像这样：

```javascript
describe('calculator', function() {
  // 使用嵌套 "describe" 函数描述一个模组
  describe('add', function() {
    // 详述预期行为
    it('should add 2 numbers', function() {
       // 使用断言函数测试预期行为
       ...  
    })
  })
})
```

**断言函数**确保被测试的变量包含预期值。它们通常看起来像这样，其中最流行的写法莫过于前两种方式：

```javascript
// Chai expect (流行)
expect(foo).to.be.a('string')
expect(foo).to.equal('bar')

// Jasmine expect (流行)
expect(foo).toBeString()
expect(foo).toEqual('bar')

// Chai assert
assert.typeOf(foo, 'string')
assert.equal(foo, 'bar')

// Unexpected expect
expect(foo, 'to be a', 'string')
expect(foo, 'to be', 'bar')
```

*TIP: 这里有一篇关于进阶的 Jasmine 断言[好文](https://medium.com/@boriscoder/the-hidden-power-of-jest-matchers-f3d86d8101b0)。*

**[Spies](http://sinonjs.org/releases/v2.1.0/spies/)** 提供了函数相关的信息：函数被调用了多少次，在什么情况下被调用，被谁调用？在集成测试中我们会使用它确保一个流程中的副作用符合预期，例如在下列场景中观察该方法是否只执行了一次？

```javascript
it('should call method once with the argument 3', () => {
  
  // 创建一个 sinon spy 来监视 object.method
  const spy = sinon.spy(object, 'method')
  
  // 调用方法，入参为 "3"
  object.method(3)

  // 确保在入参正确的情况下 object.method 只被调用了一次
  assert(spy.withArgs(3).calledOnce)
  
})
```

[**Stubbing** 或 **dubbing**](http://sinonjs.org/releases/v4.2.2/stubs/) （好比电影中的替身演员）通过**替换选中的函数**来测试模块的正确性。如果我们在测试另外的组件时希望 `user.isValid()` 总是返回 `true`，可以这么做：

```javascript
// Sinon
sinon.stub(user, 'isValid').returns(true)

// Jasmine stubs 实际是有 stubbing 功能的 spies
spyOn(user, 'isValid').andReturns(true)
```

也可以使用 promise 的方式：

```javascript
it('resolves with the right name', done => {
  
  // 确保 User.fetch "回复"的是我们配置的值"David"
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

[**Mocks** 或 **Fakes**](http://sinonjs.org/releases/v4.2.2/mocks/) 通过**伪装成某些模块或行为**测试一系列过程中的不同情况。举例来说，Sinon 能[仿冒一个服务器](http://sinonjs.org/releases/v4.2.2/fake-xhr-and-server/)离线和网络状况良好的情况来测试期望的应答。

```javascript
it('returns an object containing all users', done => {

  // 创建并配置一个假的服务器取代原生的网络请求
  const server = sinon.createFakeServer()
  server.respondWith('GET', '/users', [
    200,
    { 'Content-Type': 'application/json' },
    '[{ "id": 1, "name": "Gwen" },  { "id": 2, "name": "John" }]'
  ])

  // 调用一个包含我们模拟网络请求的流程
  Users.all()
    .done(collection => {
      const expectedCollection = [
        { id: 1, name: 'Gwen' },
        { id: 2, name: 'John' }
      ]
      expect(collection.toJSON()).to.eql(expectedCollection)
      done()
    })

  // 响应请求
  server.respond()
  
  // 移除假服务器
  server.restore()
})
```

**快照测试 (Snapshot Testing)** 会对某一数据结构与期望值进行比较。[下面的例子来自 Jest 官方文档](https://facebook.github.io/jest/docs/en/snapshot-testing.html)，展示了某一 `Link` 组件的快照测试。

```javascript
it('renders correctly', () => {
  
  // 创建一个包含页面链接和内部文字的 Link 组件实例
  const linkInstance = (
    <Link page="http://www.facebook.com">Facebook</Link>
  )
  
  // 创建一个组件的数据快照
  const tree = renderer.create(linkInstance).toJSON()
  
  // 比较数据和上一次快照
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

![](https://uq62cg.bn.files.1drv.com/y4mTfqnysoW01bKk4CWz60Y2v43G_VRxvulJeWDZklZz0IJY5Bs-Vjxkn1ALXo8Jp5jMsm6e2_4gJiQ5nRu8UEHRvZfU_xKZ_mFYaAcwd4bpWB5b7l0ySjfzhlQx84BTU3dMQZ-g7Z-4WmvjjxQUBg-I_TJ5sHhDU9QJ3SOXbHQDGej28ivoAikmDz3Cn9P30gQqGE5PjxVoc25P7oIgp7Lrg)

> **注意：**快照通常用来比对体现数据的组件，其实它们也可以比较其他的数据类型，如 redux stores 或应用中不同单元的内部结构。

**浏览器或近似浏览器环境**可以是以下三种之一：

- [**jsdom**](https://github.com/jsdom/jsdom) —— 一个模拟真实浏览器的纯 JavaScript 环境。它没有 UI 也不做渲染，只提供浏览器 JS 运行时所需的 window, document, body, location, cookies, selectors 等接口。
- **无头浏览器环境 (Headless Browser Environment)** —— 一个为了响应速度更快而缺省 UI 的浏览器。
- **真实浏览器环境 (Real Browser Environment)** —— 一个运行你测试用例的真实浏览器。



## 把所有东西放在一起...

如果可以，我们建议面对所有测试类型都使用同一套工具：相同的**测试结构和语法 (1)**、**断言函数 (2)**、**结果报告**以及**监控机制 (4)**。

我们还建议创建两类不同的流程，一类运行单元和集成测试，另一类则运行 UI 测试。这是因为 UI 测试需要耗费更长的时间，尤其在跨浏览器测试时通常会使用外部提供的多设备、多浏览器付费服务（这个后续还会讨论），因此相比第一类流程你不会想跑更多的 UI 测试，譬如只在合并一条特征分支前才运行一次。

### 单元测试

应当覆盖应用中所有小而纯粹的单元：工具 (utils)、服务 (services) 以及助手 (helpers)。给这些单元简单和边界情况的输入并**使用断言函数 (3)** 确保输出正确。另外也需要使用**覆盖率报告工具 (6)** 了解哪些单元被测试到了。

> 单元测试是尽可能使用函数式编程以及纯函数的理由之一——你的应用越纯粹就越容易被测试。

### 集成测试

> 老派的测试往往注重单元测试，这导致了应用的各个微观部分功能正常，但是所有流程合在一起时就会出错。
>
> 当你修复了某个问题，但是又破坏了其他部分时，集成测试（包含快照）可以从另一个角度捕捉许多未知的错误。
>
> 同样需要记住的是，在这个真实的世界存在因各种理由而出现的不完美的设计和广泛应用的黑盒子，并不是所有单元模块都是纯函数，也不是所有单元都可以被测试——有一些单元仅作为某个更大流程中的一部分而能被测试到。

集成测试需要覆盖重要的跨模组流程。相较于单元测试，你可能会使用 **spies (5)** 确保一些预期的副作用而非只对输出做断言，同时使用 **stubs (5)** 模拟、修改在特定测试中不存在的部分流程。

并且与单元测试相反，**一个浏览器或近似浏览器环境 (7)** 可以支持依赖 `window` 、渲染某一组件或与组件交互的各种流程。

**组件快照测试 (4)** 也属于此类测试。它们提供了一种无需真实渲染或使用浏览器就可以测试流程对选中组件影响的方式。

### UI 测试

有时候快速高效的单元和集成测试还不够。

UI 测试总是运行在**一个浏览器或近似浏览器环境 (7)** 中，模拟用户行为（点击，输入，滚动等等...），确保这些场景在终端用户眼中确实工作。

请记住这类测试是最难准备的。设想你自己创建一个环境在不同的机器、设备、浏览器类型和版本上运行一个测试... 这就是为什么有[很多服务商](https://www.keycdn.com/blog/browser-compatibility-testing-tools)为你提供这项服务。[你还可以在这里发现更多](https://www.guru99.com/top-10-cross-browser-testing-tools.html)。

### 常见的知名测试工具

#### [Jsdom](https://github.com/jsdom/jsdom)

jsdom 是 WHATWG DOM 和 HTML 标准的一个 JavaScript 实现。换言之 jsdom 仅用纯 JS 模拟了一个浏览器环境。之前提过，在这样的模拟浏览器环境中，测试运行的速度十分快。缺点则是在一个真实浏览器之外 jsdom 无法模拟所有功能，因此这会限制你的测试范围。

值得一提的是 JS 社区很快改进了它，目前的版本已经非常接近真实浏览器。

#### [Istanbul](https://istanbul.js.org/)

Istanbul 会告诉你有多少代码被单元测试所覆盖。它通过报告状态、行数、函数和分支覆盖维度的百分比情况以便你更好地理解哪些部分代码没有被覆盖到。

#### [Karma](https://karma-runner.github.io/2.0/index.html)

Karma 允许你在浏览器和近似浏览器环境甚至 jsdom 中进行测试。它运行的**测试服务器有一个特殊网页**可以让你的测试运行在页面环境中，而这个页面还可以跨浏览器运行。这也意味着测试可以通过 [BrowserStack](https://www.browserstack.com/) 之类的服务远程执行。

#### [Chai](https://github.com/chaijs/chai)

Chai 是最流行的断言库。*（译者注：此处人狠话不多）*

#### [Unexpected](https://github.com/unexpectedjs/unexpected)

Unexpected 是一个与 Chai 的语法稍有不同的断言库。其可扩展性衍生出了一些使断言功能更高级的库例如 [unexpected-react](https://github.com/bruderstein/unexpected-react) ，你可以从[这里](https://medium.com/@bruderstein/enzyme-vs-unexpected-react-ee9cb099d12b)了解更多。

#### [Sinon.js](http://sinonjs.org/)

Sinon 是一个强大的 spies, stubs 和 mocks 独立库，可与任何单元测试框架配合工作。

#### [testdouble.js](https://github.com/testdouble/testdouble.js)

testdouble 是一个声称比 Sinon 更加优秀但名气稍逊的库。其设计、哲学和特性与 Sinon 略有不同使其在许多情况下更实用，你可以从[这里](https://www.sitepoint.com/javascript-testing-tool-showdown-sinon-js-vs-testdouble-js/)、[这里](https://spin.atomicobject.com/2016/03/21/javascript-mocking-testdouble/)和[这里](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html)读到更多。

#### [Wallaby](https://wallabyjs.com/)

Wallaby 是另一款值得一提的工具。尽管需要付费，但很多用户推荐购买。它运行在你的 IDE （支持所有主流 IDE）之上，执行代码变更相关的测试，并在失败后实时定位错误代码。

![](https://uq60cg.bn.files.1drv.com/y4mYsR4FCiOSU6upwCHNy5GuzHpJwYIOc1EDSs688BAdAmiY280rv-rbSgsEufXYttC34OqCpq3B-z2w2AVYIfLRy1CzjjxMto8H0BGMOGIMBd9h1F5ZPNAzwU86jayH4ylT2NC17YNmrwbGXABhEvm1xPBxcHn1QUoGd72g1rmq55T8flw-jAiv2iM7kOK_B6QQ9DUNHe3-n_7RU3PWTEnIw)

#### [Cucumber](https://github.com/cucumber/cucumber-js)

Cucumber 通过按验收准则文件 (accpetance criteria files，使用 **Gherkin** 语法) 划分并按与之对应的方式协助编写 BDD 结构的测试用例。框架支持的多种语言都可以编写测试用例，包含我们关注的 JS：

```shell
# Filename: "like-article.feature"
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
// Filename: "like-article.step.js"
module.exports = function() {
  this.Given(/^I'm inside an article$/, function(callback) {
    // 函数式测试工具代码
  })

  this.When(/^I share the article$/, function(callback) {
    // 函数式测试工具代码
  })

  this.Then(/^the article should change to a "shared" state$/, function(callback) {
    // 函数式测试工具代码
  })
}
```

许多团队会发现这种语法比 TDD 更方便。



## 选择你的单元和集成测试框架

第一个选择你应该做得也许是框架与其相关函数库。建议使用框架内提供的工具直到依赖某些绝无仅有工具的需求出现。

> * 简而言之，如果你只想入门或针对大型功能寻找一款够快的框架，选择 **Jest**。
> * 如果你想要灵活和可扩展的配置，选择 **Mocha**。
> * 如果你喜欢简单选择 **Ava**。
> * 如果你想要非常底层的框架，选择 **tape**。

这里有一份介绍主流工具及其特性的列表：

### [mocha](https://github.com/mochajs/mocha)

Mocha 是目前最常用的库。不像 Jasmine，它使用第三方的断言、mocking 和 spying 工具（通常是  Enzyme 和 Chai ）。这意味着 Mocha 在初始配置时有一定难度并需要了解更多库，但这也会变的更加灵活、更开放去扩展。

举例来说，如果你想要[特殊的断言逻辑](https://mochajs.org/#assertions)，可以 fork Chai（*译者注：此处怀疑是笔误，fork Mocha 看起来更合理*）并使用自己的断言库仅替换 Chai。虽说这在 Jasmine 中也可以实现，但这种修改在 Mocha 中更显而易见。

- **社区 (Community)**：有许多插件和扩展来测试独特的场景。
- **扩展性**：插件、扩展和例如 Sinon 之类的库包含了许多 Jasmine 没有的特性。
- **全局变量 (Globals)**：默认会创建测试结构的变量，但是显然不像 Jasmine 那样包含了断言、spies 和 mocks ——有些人对这种看似不一致的变量感到吃惊。

### [Jest](https://facebook.github.io/jest/)

Jest 是 Facebook 推荐的测试框架，基于我们将会讨论的 Jasmine 开发。不过现如今 Facebook [已经替换了大多数 Jasmine 的功能](https://jestjs.io/blog/2016/09/01/jest-15.html)并在顶层新增了许多特性。

> 在阅读了大量文章和博客之后，人们对 Jest 速度与便利的印象深刻令人难以置信。

- **性能 (Performance)**：Jest 首要考虑的是通过实现一个[灵活的并行测试机制](https://jestjs.io/blog/2016/03/11/javascript-unit-testing-performance.html)使得处理包含大量测试文件的大型工程速度更快（以我们的经验和一些博客为例：[这里](https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f)，[这里](https://medium.com/@kentcdodds/migrating-to-jest-881f75366e7e)，[这里](https://medium.com/@gethylgeorge/testing-a-react-redux-app-using-jest-and-enzyme-b349324803a9)，[这里](https://medium.com/aya-experience/testing-an-angularjs-app-with-jest-3029a613251)）。

- **用户界面**：清楚方便。

- **直接上手 (Ready-To-Go)**：自带和 Sinon 功能相同的断言、spies 和 mocks 库。如果你需要一些额外的特性，使用函数库也很容易。

- **全局变量**：与 Jasmine 类似，Jest [默认创建了测试相关的全局变量](https://jestjs.io/docs/en/api.html)因此不用导入它们。虽然这可能导致测试不够灵活和可控而被诟病，但在绝大多数情况下都让测试更加容易：

  ```javascript
  // "describe" 已经在全局范围中，因此不需要这些导入代码：
  // import { describe } from 'jest'
  // import { describe } from 'jasmine'
  
  describe('calculator', function() {
    ...
  })
  ```

- **快照测试**：Facebook 开发并维护了 [jest-snapshot](https://github.com/facebook/jest/tree/master/packages/jest-snapshot)，不过它也可以作为工具集成的一部分被绝大多数框架使用，或通过正确的插件来使用。

- **改进后的模组仿真 (Improved modules mocking)**：Jest 提供了一种简单的方法模拟任务繁重的模组以提升测试速度。例如一项服务可以通过 resolve 一个 promise 模拟一次网络请求。

- **代码覆盖**：包含一个基于 [Istanbul](https://github.com/gotwarlost/istanbul) 的功能强大、高效的内置代码覆盖工具。

- **可靠性 (Reliability)**：尽管这是一个相对年轻的函数库，但从 2017 年 Jest 逐步稳定直到现在被认为可靠，且被所有主流 IDEs 和相关工具所支持。
- **开发 (Development)**：Jest 会对测试文件进行增量更新，因此在观察模式下的测试速度非常快。

### [Jasmine](https://github.com/jasmine/jasmine)

既然有了基于 Jasmine 构建的 Jest，为什么还要使用 Jasmine 呢？答案是后者存在得时间更久，有大量来自社区的文章和工具可以参考。同时，Angular 依然推荐使用它而非 Jest，尽管 Jest 目前也已完美适配 Angular 测试，且有很多人在使用。

- **直接上手**：包含所有测试所需的东西。
- **全局变量**：在全局范围内提供所有重要的测试特性。
- **社区**：自从 2009 年问世以来积攒了海量文章、建议及工具。
- **Angular**：Angular 的所有版本都支持 Jasmine，并在[其官方文档](https://angular.io/guide/testing)中推荐使用。

### [AVA](https://github.com/avajs/ava)

Ava 是一个并行执行测试的极简 (minimalistic) 测试库。

- **直接上手**：包含所有测试所需的东西（除了可以秒加 spying 和 dubbing）。在测试结构使用以下语法、断言函数，并在 Node.js 中运行：

  ```javascript
  import test from 'ava'
  
  test('arrays are equal', t => {
    t.deepEqual([1, 2], [1, 2])
  })
  ```

- **全局变量**：上文可见，Ava 没有创建任何测试相关的全局变量，因此你对你的测试有更多控制。

- **简单 (Simplicity)**：支持许多高级特性时有着简单的结构和断言函数，摒弃了复杂的 API。

- **开发**：Ava 会对测试文件进行增量更新，因此在观察模式下的测试速度很快。

- **速度 (Speed)**：以独立 Node.js 进程的方式并行执行测试。

- **快照测试**：[作为框架的一部分被支持](https://github.com/avajs/ava#snapshot-testing)。

### [tape](https://github.com/substack/tape)

Tape 是这些框架中最简单的。它仅有一个 Node.js 文件和一个非常简短的 API。

- **简单**：简约的结构和断言函数，没有一个复杂的 API，甚至超越了 Ava。
- **全局变量**：不创建任何测试相关的全局变量因此你可以更多地掌控你的测试。
- **测试间无共享状态 (No Shared State between tests)**：Tape 不鼓励使用 "beforeEach" 之类的函数以确保测试模块化以及对于测试周期的用户最大化控制。
- **无命令行界面 (No CLI)**：Tape 在任何 JS 可以运行的地方都能跑。



## UI 测试工具

首先就像之前提过的，你可以在[这里](https://www.keycdn.com/blog/browser-compatibility-testing-tools)和[这里](https://www.guru99.com/top-10-cross-browser-testing-tools.html)找到有关服务提供商的好文，这些服务提供商提供主机帮助你在不同的设备和浏览器上执行你的测试。

长期以 UI 测试为目标的工具从实现、哲学到 API 都多种多样，因此强烈建议花时间理解不同的解决方案并在你的产品中检验它们。

- *简短说，如果你只想通过一个可靠、设置简单的多浏览器合一的工具入门，使用 **TestCafe**。*
- *如果你想要随波逐流并获得最多的社区支持，**WebdriverIO** 是正道。*
- *如果你不在乎跨浏览器支持，使用 **Puppeteer**。*
- *如果你的应用没有复杂的交互和图像，例如一个充满表格和导航的系统，可以使用跨浏览器无头工具如 **Casper**。*

### [selenium](https://github.com/SeleniumHQ/selenium)

Selenium 使用浏览器自动化模拟用户行为。它并不是专为测试创造，通过暴露一个在浏览器上模拟用户行为的服务器来达到多种用途。

Selenium 可以被多种方式控制，支持许多编程语言，甚至搭配一些工具后无需任何实际编程。

对我们的需求而言，通过一个 [Selenium WebDriver](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html) 提供通信层供我们的 NodeJS 代码与操作浏览器的 Selenium 服务器通信从而实现控制。

​	**Node.js <=> WebDriver <=> Selenium Server <=> FF/Chrome/IE/Safari**

WebDriver 被引入测试框架后，测试代码可参考如下的部分代码：

```javascript
describe('login form', () => {
 
  before(() => {
    return driver.navigate().to('http://path.to.test.app/')
  })
  
  it('autocompletes the name field', () => {
    driver
      .findElement(By.css('.autocomplete'))
      .sendKeys('John')
    
    driver.wait(until.elementLocated(By.css('.suggestion')))
    
    driver.findElement(By.css('.suggestion')).click()
    
    return driver
      .findElement(By.css('.autocomplete'))
      .getAttribute('value')
      .then(inputValue => {
        expect(inputValue).to.equal('John Doe')
      })
  })
  
  after(() => {
    return driver.quit()
  })
  
})
```

WebDriver 本身对你来说可能已经足够，实际上[一些人](https://marmelab.com/blog/2016/04/19/e2e-testing-with-node-and-es6.html)也建议使用它本体，不过还是有许多库通过分支或包装的形式扩展了它。包装后的 WebDriver 可能添加了多余的代码导致调试更加困难，而分支方式则可能偏离 [2018 年正在活跃开发中](https://github.com/SeleniumHQ/selenium/commits/master)的 WebDriver 。

就算这样，一些人仍偏向不直接使用它，所以让我们看看有关 Selenium 操作的库吧。

### [Appium](https://github.com/appium/appium)

Appium 提供类似 Selenium 的 API 测试移动设备上的站点，同时使用了以下工具：

- **iOS 9.3+**： Apple 的 [XCUITest](https://developer.apple.com/reference/xctest)
- **Before iOS 9.3**： Apple 的 [UIAutomation](https://developer.apple.com/library/ios/documentation/DeveloperTools/Reference/UIAutomationRef/)
- **Android 4.2+**： Google 的 [UiAutomator/UiAutomator2](http://developer.android.com/tools/help/uiautomator/index.html)
- **Android 2.3+**： Google 的 [Instrumentation](http://developer.android.com/reference/android/app/Instrumentation.html). （通过打包一个独立的工程提供指令支持, [Selendroid](http://selendroid.io/)）
- **Windows Phone**： Microsoft 的 [WinAppDriver](http://github.com/microsoft/winappdriver)

因此如果你使用 Selenium 或基于 Selenium 开发的工具，你同样可以使用 Appium 在移动设备上测试。

### **[Protractor](https://github.com/angular/protractor)**

Protractor 是一个包装 Selenium 并支持 Angular 增强语法以及特殊内置钩子的库。

- **Angular**：尽管可以成功接入其他 JS 框架，但针对 Angular 提供了特殊的钩子。[Angular 官方文档](https://angular.io/guide/testing)也推荐使用该工具。
- **错误报告 (Error reporting)**：很好的机制。
- **支持 (Support)**：目前已支持 Typescript，库本身由庞大的 Angular 团队更新维护。

### [WebdriverIO](http://webdriver.io/)

WebdriverIO 实现了另一个版本的 Selenium WebDriver：

- **语法**：非常容易和可读。
- **灵活**：一个简单、灵活和可扩展的库。
- **社区**：拥有良好支持和热心开发者社区提供的丰富插件及扩展。

### **[Nightwatch](http://nightwatchjs.org/)**

Nightwatch 也实现了又一个 Selenium WebDriver，并提供了自己的测试框架包含一个测试服务器、断言和一些工具。

- **框架**：也可以与其他框架搭配使用，不过在你想要运行功能性测试而非作为其他框架的一部分时特别有用。
- **语法**：看起来是最简单和最可读的。
- **支持**：不支持 Typescript，大体上看这个库似乎比其他库的支持要少一丢丢。

### **[TestCafe](https://devexpress.github.io/testcafe/)**

TestCafe 是基于 Selenium 的不错替代品，在 2016 年底重写并**开源**。

**它仍有一款[付费版本](https://testcafe.devexpress.com/)提供一些免编程的测试工具**例如测试录制和用户支持，这很重要，因为有许多过时的文章错误地陈述其代码已停止开发并将这视为库的缺点。

与 Selenium 不同的是它通过 JavaScript 脚本的形式注入到网站中来控制浏览器。这使得 TestCafe 可以**运行在任意浏览器中，包含移动设备**，并完全控制 JavaScript 的执行循环。

TestCafe 是 JavaScript 和测试导向的。尽管已经被认为稳定和功能丰富，但目前仍然处于大规模开发状态。

- **快速构建 (Fast to set up)**：随意打开一个浏览器就可以跑你的测试。
- **跨浏览器和设备 (Cross Browser and Devices)**：支持许多浏览器和设备，可与提供设备和浏览器测试的 [SauceLabs](https://saucelabs.com/) 或 [BrowserStack ](https://www.browserstack.com/) 配合使用。这包含了在[无头 Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome) 和[无头 Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode) 中运行测试，将会在后续讨论到。
- **并行测试 (Parallel Testing)**：TestCafe 可以[一次在多个浏览器实例中运行你的测试](https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/concurrent-test-execution.html)。这个实践可以显著地缩短你的测试时间。
- **方便的错误报告 (Convenient Error Reporting)**
- **自有生态系统 (Own Ecosystem)**：[TestCafe 使用自己的测试结构](https://testcafe-discuss.devexpress.com/t/interacting-with-browser-using-testcafe-apis-but-without-testcafe-test-runner/300/6)。这可能很方便，尤其因为 UI 测试经常与其他测试分开执行，[不过有些人并不喜欢](https://medium.com/tech-quizlet/cypress-the-future-of-end-to-end-testing-for-web-applications-8ee108c5b255)。

```javascript
import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `https://devexpress.github.io/testcafe/example`

// 自己的测试结构
test('My first test', async t => {
    await t
        .typeText('#developer-name', 'John Smith')
        .click('#submit-button')
        .expect(Selector('#article-header').innerText)
        .eql('Thank you, John Smith!')
})
```

### [Cypress](https://www.cypress.io/)

Cypress 是 TestCafe 的直接竞争对手之一。他们做的事情类似，如注入测试到网站中，但 Cypress 尝试将其做得更加现代化、灵活和方便。

Cypress 非常年轻，[刚从封闭 beta 版推进到公开 beta 版](https://www.cypress.io/blog/2017/10/10/cypress-is-now-public-beta/)（在 2017 年十月），却已经有[很多发烧友](https://medium.com/tech-quizlet/cypress-the-future-of-end-to-end-testing-for-web-applications-8ee108c5b255)。

- **不支持跨浏览器**：目前仅支持 Chrome （[也不支持无头版](https://github.com/cypress-io/cypress/issues/832)）。不过这个问题已经被创建，开发者也正在为之努力。
- **缺乏高级功能**：相较 TestCafe 而言缺少并行测试和专有测试工具，不过这些都已经在产品的路线图中了。
- **文档**：详实且清楚。
- **调试工具**：在测试过程中容易调试和打日志。
- **Mocha**：使用 Mocha 作为其测试结构的提供者，确保使用起来非常标准，UI 测试可与其他测试构建在同一结构中。

```javascript
describe('My First Cypress Test', function() {
  it("Gets, types and asserts", function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // 应在一个包含 '/commands/actions' 的新 URL 上
    cy.url().should('include', '/commands/actions')

    // 取一个输入，打字填入其中，并验证其值已经更新
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

### **[Puppeteer](https://github.com/GoogleChrome/puppeteer)**

Puppeteer 是一个 Google 开发的 Node.js 库，提供了方便的 Node.js API 操控[无头 Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)。

无头 Chrome 就是一个运行了 `--headless` 标志位的常规 Chrome v59+。当 Chrome 运行在无头模式时，会暴露出 API 供外界管理，而 Puppeteer 就是 Google 提供控制它的 JavaScript 工具。

值得一提的是 Firefox 在 2017 年底也推出了[无头模式](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode)。

注意其他不同的测试工具如 TestCafe、Krama 也可以使用无头 Chrome 和 Firefox。

- Puppeteer 相对较新，但它有一个很大的社区使用、开发工具和二次封装。
- **原生 (Native) 的所以快，并且使用了最新的 Chrome 引擎**，不像 [PhantomJS 构建在旧 WebKit 的分支上](https://about.gitlab.com/2017/12/19/moving-to-headless-chrome/)。（下一小节会讨论）
- 无头 Chrome 的（因此也是 Puppeteer 的）一个主要缺点是它[不支持一些扩展](https://bugs.chromium.org/p/chromium/issues/detail?id=706008)，比如 Flash 扩展（并且近期也可能不会支持）。

### [PhantomJS](http://phantomjs.org/)

Phantom 通过实现 Chromium 引擎创建了一个可控的类 Chrome 无头浏览器。不过自从[谷歌宣布自家的 Puppeteer](https://www.chromestatus.com/features/5678767817097216) 后，Phantom 的创始人和维护者 [Vitaliy Slobodin](https://medium.com/@vitallium) 便[不再对其投入精力](https://groups.google.com/forum/#!msg/phantomjs/9aI5d-LDuNE/5Z3SMZrqAQAJ)，因此从 2017 年中开始维护和开发速度就大幅下降，尽管还是有人在维护。

那么，为什么还要使用 Phantom 而非 Puppeteer？

- 首先它有**更多的特性**和许多教程、工具。
- 它也被许多实用工具如后面会讨论的 **CasperJS** 使用。
- 它使用更早的 WebKit 因此可以模拟旧版 Chrome。
- 此外之前提过，Phantom **支持如 Flash 扩展**，[与无头 Chrome 相反](https://bugs.chromium.org/p/chromium/issues/detail?id=706008)。

### [Nightmare](https://github.com/segmentio/nightmare)

Nightmare 是一款测试语法特别简单的优秀 UI 测试库，使用与 Phantom 类似的 [Electron](https://electronjs.org/) 开发。Electron 基于更新版本的 Chromium，处在活跃维护与开发阶段，主要目标是使用 JavaScript、HTML 和 CSS 构建跨平台的桌面应用。

同样 Nightmare 也在[讨论](https://github.com/segmentio/nightmare/issues/1092)和[实验](https://github.com/segmentio/nightmare/pull/1211)使用无头 Chrome。以下是 Nightmare 和 Phantom 代码的比较：

```javascript
// 译者注：Nightmare 代码

yield Nightmare()
  .goto('http://yahoo.com')
  .type('input[title="Search"]', 'github nightmare')
  .click('.searchsubmit')
```

```javascript
// 译者注：Phantom 代码

phantom.create(function (ph) {
  ph.createPage(function (page) {
    page.open('http://yahoo.com', function (status) {
      page.evaluate(
        function () {
          var el = document.querySelector('input[title="Search"]')
          el.value = 'github nightmare'
        },
        function (result) {
          page.evaluate(
            function () {
              var el = document.querySelector('.searchsubmit')
              var event = document.createEvent('MouseEvent')
              event.initEvent('click', true, false)
              el.dispatchEvent(event)
            },
            function (result) {
              ph.exit()
            }
          ) // page.evaluate
        }
      ) // page.evaluate
    }) // page.open
  }) // ph.createPage
}) // phantom.create
```

### [Casper](https://github.com/casperjs/casperjs)

Casper 基于 PhantomJS 和 [SlimerJS](https://slimerjs.org/) （与 Phantom 相同只不过使用了 Firefox 的 Gecko）编写，抽象了在创建 Phantom 和 Slimer 时复杂的异步脚本，从而提供导航、脚本执行和测试工具。

Slimer 尽管被认为是试验性的产品但已被长期广泛使用，并在 2017 年底**释出了 beta 版本**——使用新版[无头 Firefox](https://developer.mozilla.org/en-US/Firefox/Headless_mode) 的 `1.0.0-beta.1`，目前正在为稳定后发布 `1.0.0` 版本而努力。

Casper 近期可能会从 PhantomJS 移植到 Puppeteer，预期 2.0 版本成为通吃无头 Chrome 和无头 Firefox 的工具，敬请期待吧。

### [CodeceptJS](https://github.com/codeception/codeceptjs/)

类似上面讨论过的 CucumberJS，CodeceptJS 通过不同的函数库 API 提供另一层抽象，哲学上期待你的测试更多关注用户行为。

它大概长这这样：

```javascript
Scenario('login with generated password', async (I) => {
  I.fillField('email', 'miles@davis.com');
  I.click('Generate Password');
  const password = await I.grabTextFrom('#password');
  I.click('Login');
  I.fillField('email', 'miles@davis.com');
  I.fillField('password', password);
  I.click('Log in!');
  I.see('Hello, Miles');
});
```

以下是可以使用这段代码执行的函数库，在前文都讨论过：

[WebDriverIO](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/WebDriverIO.md), [Protractor](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Protractor.md), [Nightmare](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Nightmare.md), [Appium](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Appium.md), [Puppeteer](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Puppeteer.md).

如果你相信这种语法更适合你的需求，那就试试看吧。



## 总结

我们看完了web 开发社区中最流行的测试策略和工具，希望你能更加轻松地测试你的站点。

> 最后，如今关于应用架构的最佳决策是在理解活跃开发社区提出的通用解决模式、与自身经验做结合且考虑应用的特性和特殊需求下做出的。

噢，然后编码，再重新编码，再重新编码，再重新编码后，测试不同的解决方案 :)

![](https://uq61cg.bn.files.1drv.com/y4m5Hsf55vPDgt2WkOq0qHEeEdQ7dj27ovAZLK4_JyfnwxaZNreWgW8Mh0lNUTdXRIzl2xmx_Oh_gWTPCGuqQuerACxTrxD4McCE5SaLCcWAOSrnDonVPapk7j1L-B3_4WImEfBIGeDsMHpgEgyEG2hRZlJg9_F0gXokxSvAK1RcWWovEWHrIOYkjt5ZEQ5PJtP4Bq6aNi5aI2X4Y1CwLPHmA)



测试快乐 :)

谢谢 :)



## 推荐阅读

### 最佳

- [**Javascript tools for end-to-end testing** web applications (July 2017)](http://mo.github.io/2017/07/20/javascript-e2e-integration-testing.html)
- [**Top 5 Most Rated Node.js Frameworks for End-to-End Web Testing**(March 2017)](https://medium.com/@adrian_lewis/top-5-most-rated-node-js-frameworks-for-end-to-end-web-testing-f8ebca4e5d44)
- [Top **UI Test Automation Best Practices** You Should Follow (November 2017)](https://www.blazemeter.com/blog/top-15-ui-test-automation-best-practices-you-should-follow)
- [How to set up E2E browser testing for your **GitHub project (With TestCafe)** (February 2017)](https://hackernoon.com/how-to-set-up-e2e-browser-testing-for-your-github-project-89c24e15a84)
- [Introduction to **Headless Browser Testing** (September 2017)](https://blog.logrocket.com/introduction-to-headless-browser-testing-44b82310b27c)
- [**Web Scraping in 2017**: Advanced Headless Chrome Tips & Tricks (august 2017)](https://blog.phantombuster.com/web-scraping-in-2017-headless-chrome-tips-tricks-4d6521d695e8)
- [How GitLab switched to **Headless Chrome for testing (From Phantom)**(December 2017)](https://about.gitlab.com/2017/12/19/moving-to-headless-chrome/)

### 概览

- [The **Top 8 Essential JavaScript Automation Frameworks** (June 2016)](https://www.joecolantonio.com/2016/06/14/top-8-essential-javascript-automation-frameworks/)
- [JavaScript Testing: **Unit vs Functional vs Integration Tests** (April 2016)](https://www.sitepoint.com/javascript-testing-unit-functional-integration/)
- [What are **Unit Testing, Integration Testing and Functional Testing**? (April 2015)](https://codeutopia.net/blog/2015/04/11/what-are-unit-testing-integration-testing-and-functional-testing/)
- [Top 12 Browser Compatibility Testing Tools (June 2017)](https://www.keycdn.com/blog/browser-compatibility-testing-tools/)
- [Top 10 Cross Browser Compatibility Testing Tools In 2018 (2018)](https://www.guru99.com/top-10-cross-browser-testing-tools.html)

### spies 和 stubs

- [Bye-Bye, Sinon — **Hello, testdouble** (March 2016)](https://spin.atomicobject.com/2016/03/21/javascript-mocking-testdouble/)
- [JavaScript Testing Tool Showdown: **Sinon.js vs testdouble.js** (April 2017)](https://www.sitepoint.com/javascript-testing-tool-showdown-sinon-js-vs-testdouble-js/)
- [**testdouble.js vs. sinon.js** (March 2016)](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html)
- [**enzyme vs unexpected-react** (April 2017)](https://medium.com/@bruderstein/enzyme-vs-unexpected-react-ee9cb099d12b)

### 测试框架对比

- [React Testing — **Jest or Mocha?** (May 2017)](https://spin.atomicobject.com/2017/05/02/react-testing-jest-vs-mocha/)
- [Testing React Applications with **Karma, Jest or Mocha** (August 2016)](http://instea.sk/2016/08/testing-react-applications-with-karma-jest-or-mocha/)
- [Let’s Compare **Javascript Testing Framework** (August 2016)](https://medium.com/cardinal-solutions/lets-compare-javascript-testing-frameworks-bb500f0b1006)
- [**Jasmine vs. Mocha, Chai, and Sinon** (Updated February 2016)](http://thejsguy.com/2015/01/12/jasmine-vs-mocha-chai-and-sinon.html)
- [**Jasmine vs. Mocha**- JavaScript Testing Framework Comparison
  (January 2017)](http://www.tisa-software.com/news/blog/217-jasmine-mocha-javascript-testing-framework-comparison)

### Jest

- [How to **Snapshot** Test Everything in Your **Redux App With Jest**
  (December 2016)](https://hackernoon.com/how-to-snapshot-test-everything-in-your-redux-app-with-jest-fde305ebedea)
- [**Migrating to Jest** on the P2P team at PayPal (November 2016)](https://medium.com/@kentcdodds/migrating-to-jest-881f75366e7e)
- [**Jest**- From 0 to 100% Coverage Real Quick (January 2017)](https://hackernoon.com/from-0-to-100-coverage-real-quick-d71dda7069e5)
- [The Hidden Power of **Jest Matchers** (January 2017)](https://medium.com/@boriscoder/the-hidden-power-of-jest-matchers-f3d86d8101b0)
- [Testing **React components with Jest and Enzyme** (December 2016)](https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f)
- [Testing a **React-Redux app using Jest and Enzyme** (January 2017)](https://medium.com/@gethylgeorge/testing-a-react-redux-app-using-jest-and-enzyme-b349324803a9)
- [**Snapshot** Testing React Components with **Jest** (January 2017)](https://semaphoreci.com/community/tutorials/snapshot-testing-react-components-with-jest)
- [Testing an **AngularJS** app with **Jest** (October 2016)](https://medium.com/aya-experience/testing-an-angularjs-app-with-jest-3029a613251)

### Ava

- [Effortless unit testing with **AVA** (April 2016)](https://wecodetheweb.com/2016/04/19/effortless-unit-testing-with-ava/)
- [Javascript Testing with **AVA** (February 2017)](https://atendesigngroup.com/blog/javascript-testing-ava)
- [Unit testing front-end JavaScript with **AVA and jsdom** (November 2016)](https://tech.just-eat.com/2016/11/10/unit-testing-front-end-javascript-with-ava-and-jsdom/)
- [Testing the Bejeezus out of React Native Apps with **AVA** (June 2016)](https://shift.infinite.red/testing-the-bejeezus-out-of-react-native-apps-with-ava-330f51f8f6c3)

### Tape

- [Why I use **Tape Instead of Mocha** & So Should You (July 2015)](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)
- [Learn **Tape**](https://github.com/dwyl/learn-tape)

### UI 测试

- [Hybrid Application Testing with **Protractor and Appium** (March 2017)](https://moduscreate.com/blog/hybrid-application-testing-with-protractor-and-appium/)
- [**Headless Chrome vs PhantomJS Benchmark** (September 2017)](https://hackernoon.com/benchmark-headless-chrome-vs-phantomjs-e7f44c6956c)
- [**Protractor vs WebdriverIO vs NightWatch** (November 2016)](http://www.webdriverjs.com/protractor-vs-webdriverio-vs-nightwatch/)
- [End to End (e2e) Testing React Apps With **Selenium WebDriver And Node.js** is Easier Than You Think (April 2016)](https://marmelab.com/blog/2016/04/19/e2e-testing-with-node-and-es6.html)
- [**WebdriverIO**- Using JavaScript to Drive Selenium Tests (August 2016)](https://blog.dmbcllc.com/using-javascript-to-drive-selenium-tests/)
- [JavaScript Functional Testing with **Nightwatch.js** (August 2016)](https://www.sitepoint.com/javascript-functional-testing-nightwatch-js/)
- [Node.js End-to-End Testing with **Nightwatch.js** (March 2017)](https://blog.risingstack.com/end-to-end-testing-with-nightwatch-js-node-js-at-scale/)
- [**Nightmare** of End-to-End Testing (September 2016)](http://dsheiko.com/weblog/nightmare-of-end-to-end-testing)
- [**Protractor vs WebdriverIO vs NightWatch** (November 2016)](http://www.webdriverjs.com/protractor-vs-webdriverio-vs-nightwatch/)
- [Stack Overflow- What is the difference between **nightwatch.js And webdriver.io?** (March 2016)](http://stackoverflow.com/questions/35981605/what-is-the-difference-between-nightwatch-js-and-webdriver-io)
- [**Comparison of JavaScript browser automation and test specification libraries** (December 2015)](https://watirmelon.blog/2015/12/08/comparison-of-javascript-browser-automation-and-test-specification-libraries/)
- [What is **PhantomJS** and How is it Used? (June 2016)](https://scotch.io/tutorials/what-is-phantomjs-and-how-is-it-used)
- [Setting up End-to-End Testing in Angular Project with **CodeceptJS**(December 2017)](https://medium.com/@armno/setting-up-end-to-end-testing-in-angular-project-with-codeceptjs-ac1784de3420)

### TestCafe

- [Which automated testing tool to pick — **Testcafe or Selenium WebDriver**? (January 2016)](http://onpathtesting.com/automated-testing-tool-testcafe-or-selenium-webdriver/)
- [**Introducing TestCafe** — Open Source Testing Framework (Octobeer 2016)](https://devexpress.github.io/testcafe/blog/introducing-testcafe-open-source-testing-framework.html)
- [Why not use Selenium? (October 2016)](https://testcafe-discuss.devexpress.com/t/why-not-use-selenium/47)
- [Functional Testing With **TestCafe** (March 2017)](http://mherman.org/blog/2017/03/19/functional-testing-with-testcafe)
- [UI Test Automation Frameworks Showdown: **TestCafé versus Nightwatch.js** (Fabruary 2018)](http://www.pqatesting.com/our_ideas/blog/u)

### Cypress

- [**Cypress**: The future of end-to-end testing for web applications (Fabruary 2018)](https://quizlet.com/blog/cypress-the-future-of-end-to-end-testing-for-web-applications)

