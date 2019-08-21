---
title: 使用Flash单元测试框架asunit
tags:
  - unittest
id: 1045
comment: false
categories:
  - 技术
date: 2012-06-28T23:00:00.000Z
path: /using-asunit/
---

### 一些废话

在使用 asunit 之前我只是短短的接触过 Flexunit，对单元测试框架的 API 接口并不是很熟悉，所以很多对于我来说觉得很有用的功能概念可能在其他单元测试框架中也有，也请看客对我的孤陋寡闻多多包涵。

### 关于版本

在 asunit 的官网上能下载到的版本对应于 github 上的这个[仓库](https://github.com/lukebayes/asunit)，但是我使用的是最新版本也就是原作者的[版本](https://github.com/patternpark/asunit)，后者在前者的基础上去掉了一些不必要的类并使用了[swiftsuspenders](https://github.com/tschneidereit/SwiftSuspenders)类提供的注入方式代替自身实现的版本。

### 一个最简单的 asunit 单元测试

首先建立一个文档类：

<pre>package
{
    import asunit.core.TextCore;

    import flash.display.Sprite;

    public class as3injectionTest extends Sprite
    {
        private var core:TextCore;
        public function as3injectionTest()
        {
            core = new TextCore();
            core.start(AllTest,null,this);
        }
    }
}</pre>

之后编写测试套件：

<pre>package
{
    import test.AsynTest;
    import test.ClassA;
    import test.ClassB;
    import test.EventAsynTest;
    import test.InjectorTest;
    import test.TempTest;

    [Suite]
    public class AllTest
    {
        public function AllTest()
        {
        }

        public var injectorTest:InjectorTest;
        public var tempTest:TempTest;
        public var ca:ClassA;
        public var cb:ClassB;
        public var asynTest:AsynTest;
        public var eventasyn:EventAsynTest;
    }
}</pre>

完成测试套件里面的具体测试单元就可以了，具体代码就不贴在这里了，本工程的全部源码在[这里](http://sdrv.ms/KOQvhP)。

<div>

<!--more-->

asunit 框架很低调，相关的文档也不多，所以对于没深入接触过单元测试框架的我来说刚开始有点摸不着边，通过这个框架提供的一套测试用例以及对源码的阅读总算入了门，此框架提供的测试功能可能不算强大但对我来说已经够用：

* 断言
* 利用特定的 Meta 控制测试
* 异步测试这是这个框架本身能提供的功能，借助[asmock](http://asmock.sourceforge.net/)能实现 Mock 测试，借助[ProjectSprouts](http://projectsprouts.org/)能获得一些代码自动生成以及自动测试方面的支持

### 断言

断言应该是所有单元测试框架最主要的功能，asunit 支持的断言类型包括如下几种：

<pre>assertEquals
assertEqualsArraysIgnoringOrder
assertEqualsFloat
assertFalse
assertMatches
assertNotNull
assertNotSame
assertNull
assertSame
assertThrows
assertThrowsWithMessage
assertTrue
fail</pre>

在源码对应的 test 包下都有相关的测试代码，有兴趣的可以看看。

### Meta 标签测试

asunit 提供的 meta 还是很丰富的，框架本身能识别如下形式的 meta

* [Suit]：写在类前面，声明此 meta 的类 asunit 会自动实例化其公开属性并将其看作是一个小的单元测试类并执行其中的具体测试代码。

* [BeforeClass]：在单元测试类实例化之前执行，标记有该 meta 的函数应该是静态函数，一个测试类里面可以包含多个此标签，但无法精确控制每个函数的执行次序

* [Before]：在每个标记有 Test 的 meta 函数之前都会先执行此 meta 标记对应的函数

* [After]：在每个标记有 Test 的 meta 函数之后都会执行此 meta 标记对应的函数

* [AfterClass]：在单元测试类实例化之后执行，标记有该 meta 的函数应该是静态函数，一个测试类里面可以包含多个此标签，但无法精确控制每个函数的执行次序

* [Test]：标记有此 meta 的函数表示需要测试

* [Test(expects="someError")]：测试此函数并忽略特定的错误抛出

* [Test(order=2)]：order 越低执行优先级越高，可以是负数，默认是 0

asunit 内部对带有 meta 的函数执行了两次排序，第一次是按函数名字，第二次是按 order，所以对于没有标记有 order 的函数我们不能确定其执行的准确顺序

* [Ignore]：这个 meta 可以和其他 meta 一起存在，标有该 meta 的函数将被忽略执行

通过查看以下这个测试类对应的输出就能很清楚的了解这几个 meta 的执行逻辑了：

    package test
    {

        public class ClassA
        {

            [AfterClass]
            public static function ac():void
            {
                trace("ac");
            }

            [BeforeClass]
            public static function bc1():void
            {
                trace("bc1");
            }

            [BeforeClass(order = -1)]
            public static function bc2():void
            {
                trace("bc2");
            }

            public function ClassA()
            {
            }

            [After]
            public function a():void
            {
                trace(this , "a");
            }

            [Before]
            public function b():void
            {
                trace(this , "b");
            }

            [Test]
            public function test1():void
            {
                trace(this , "Test1");
            }

            [Test(order = -1)]
            public function test2():void
            {
                trace(this , "Test2");
            }

            [Ignore(description = "the ignore function")]
            [Test]
            public function test3():void
            {
                trace(this , "Test3");
            }
        }
    }

输出：

<pre>bc1
bc2
[object ClassA] b
[object ClassA] Test2
[object ClassA] a
[object ClassA] b
[object ClassA] Test1
[object ClassA] a
[object ClassA] b
[object ClassA] a
ac</pre>

* [RunWith(someclass)]&#x3A;用自定义的 Runner 代替框架内部的 Testunner 或者 SuiteRunner，需要实现 IRunner 接口，是个高级 meta 接口，如果使用 asmock 框架，需要利用此接口。

还包括一个[swiftsuspenders](https://github.com/tschneidereit/SwiftSuspenders)框架实现的 meta

* [Inject]&#x3A;利用此 meta 能够实现[依赖注入](http://www.martinfowler.com/articles/injection.html)，对于这项技术我还没有理解透彻，回头有时间看看这个框架以及 robotleg。利用这个 meta 我们能够在运行时获取 asunit 里面的几个对象

1：async 异步测试需要用到此类

2：context 在启动 asunit 的代码中，我们传入的三个对象是一个显示对象容器，asunit 的任何结果都是往这个容器里面输出的，但是如果我们的测试代码也需要往这个容器中添加显示对象，有两种方法

（1):让你的测试类继承 TestCase 并访问父类的 context 属性

（2）:测试类不需要继承任何类，但需要声明一个 Sprite 类型的公开变量并给它一个 Inject meta，那么这个类对这个属性的访问就是对 asunit 内部的 context 属性的访问，可能这就是传说中的依赖注入吧，代码如下:

<pre>[Inject]
public var view：Sprite；
[Test]
public function test（）：void
{
   view.addChild(new Sprite());//view就是asunit内部的context
}</pre>

### 异步测试

asunit 为我们提供两种异步测试模型：

1：检测某个函数的执行情况，如果在指定时间内被执行就运行对应的测试，否测抛出异步测试超时

2：第二中在第一种测试的基础上加了事件监听机制，如果在指定的时间内捕获到了对应的事件就运行对应的测试，否则抛出超时异常。

这是第一种异步测试的最简单版本：

    package test
    {
        import asunit.framework.IAsync;

        import flash.events.Event;
        import flash.net.URLLoader;
        import flash.net.URLRequest;

        public class AsynTest
        {
            public function AsynTest()
            {
            }

            [Inject]
            public var asyn:IAsync;

            [Test]
            public function asynTest():void
            {
                var loader:URLLoader = new URLLoader();
                loader.addEventListener(Event.COMPLETE,asyn.add(loadComplete,500));
                loader.load(new URLRequest("someurl"));
            }

            private function loadComplete(e:Event):void
            {
                //assertSomeThing
            }
        }
    }

这是第二种异步测试的简单版本：

    package test
    {
        import asunit.events.TimeoutCommandEvent;
        import asunit.framework.Async;
        import asunit.framework.IAsync;
        import asunit.framework.TimeoutCommand;

        import flash.events.Event;
        import flash.events.EventDispatcher;

        public class EventAsynTest
        {
            public function EventAsynTest()
            {
            }

            [Inject]
            public var async:IAsync;
            private var dispatcher:EventDispatcher;

            [Test]
            public function eventAsynTest():void
            {
                dispatcher = new EventDispatcher();
                var asyn:Async = new Async();
                asyn.proceedOnEvent(dispatcher , Event.ACTIVATE , 200);
                /**以下两种监听虽然能检测到是否超时但是超时警告不会加入测试结果，如果需要在测试结果中反馈，使用async注入*/
                (asyn.getPending()[0] as TimeoutCommand).addEventListener(TimeoutCommandEvent.CALLED , onCall);
                (asyn.getPending()[0] as TimeoutCommand).addEventListener(TimeoutCommandEvent.TIMED_OUT , onTimeout);
                /**这种方式会在超过500ms如果没执行onCall函数会在结果中报告超时异常*/
                //(asyn.getPending()[0] as TimeoutCommand).addEventListener(TimeoutCommandEvent.CALLED,async.add(onCall,500));
                /**这个事件在需要的时候发出*/
                //dispatcher.dispatchEvent(new Event(Event.ACTIVATE));
            }

            /**call when dispatcher dispatch an Event.Active Event*/
            private function onCall(e:TimeoutCommandEvent):void
            {
                //someAsserttest
            }

            /**/
            private function onTimeout(e:TimeoutCommandEvent):void
            {
                //timeout
            }
        }
    }

如果觉得这两个例子不知所云，可以查看作者写的异步测试代码

[AsyncTest](https://github.com/patternpark/asunit/blob/master/asunit-4.0/test/asunit/framework/AsyncTest.as)
[AsyncMethodTest](https://github.com/patternpark/asunit/blob/master/asunit-4.0/test/asunit/framework/AsyncMethodTest.as)
[ProceedOnEventTest](https://github.com/patternpark/asunit/blob/master/asunit-4.0/test/asunit/framework/ProceedOnEventTest.as)
