---
title: Nape的回调系统
tags:
  - 技术
  - Flash
id: 1147
date: 2013-04-05T18:54:44.000Z
path: /nape-callback/
---

Nape 的回调系统和 Flash 原生的事件系统还是有区别的,虽然它们的底层可能都是通过观察者模式来实现的,但是它们暴露给外部的 API 是不一样的,Flash 原生的事件系统中每个 EventDispatcher 是监听对象,但在 Nape 中监听对象只有 space,它通过匹配特定的模式来触发回调.

伪代码

<pre class="lang:as decode:true">//flash event version

var ball:Body = new Body();

ball.addEventListener("wake",callback);

//nape version

var ball:Body = new Body();

var cbType:CbType = new CbType();

ball.cbTypes.add(cbType);

var listener:BodyListener = new BodyListener("wake",cbType,callback)

space.listeners.add(listener);</pre>

在 Nape 中增加一个回调大致分为三步

1:定义一些标签,并根据需求为不同的 Interactor 打上不同的标签(对应代码 11 行)

2:定义一个监听器,这个监听器定义了哪些标签触发了哪种行为之后做何种回调(对应代码 15 行)

3:为 Space 注册对应的监听(对应代码 17 行)

<!--more-->

### 第一步:定义标签

这里的标签指的就是 Nape 里面的 CbTypes 类型.每个 Interactor 都有一个叫 cbTypes 的属性,方便我们根据需求添加不同的标签.

利用标签添加回调有一个有什么好处?可以举一个具体的应用场景:

场景中有 10 个球和 10 个方块,我们想在球休眠是触发 A 函数,方块激活时触发 B 函数,由于 Nape 回调没有 flash 事件那样的冒泡机制,无法给父容器添加一个监听之类的代码,所以一般的我们会想到创建 20 个监听器然后分别添加之类的代码.但是 Nape 标签概念的提出让我们只需要创建两个监听器就好了.下面是这个应用的伪代码

<pre class="lang:as decode:true">var ballTag:CbType = new CbType();

var boxTag:VbType = new CbType();

//循环10次分别为每个球添加球标签(ballTag),方块添加方块标签(boxTag)

10.times do |i|

     ballBodyVec[i].cbTypes.add(ballTag);

     boxBodyVec[i].cbTypes.add(boxTag);

end

space.listener.add(new BodyListener(CbEvent.SLEEP,ballTag,ballSleepCallback);

space.listener.add(new BodyListener(CbEvent.WAKE,boxTag,boxWakeCallback);</pre>

我们不用 new 20 遍监听器,而是只要给 20 个刚体都新增一个标签的引用,单从性能角度来看增加引用的成本比新增监听器的成本低得多.

### 第二步:定义监听器(**Listener**)

定义监听器在整个添加回调过程中可能是最复杂的,因为它涉及到很多细节.

首先 Nape 定义了四个特定类型的监听器来处理不同的情况.我们需要根据需要创建不同的监听器.

这几个监听器的构造函数的构造函数是不一样的.

对于它们共有的 event,options,handler,precedence 先做一个简要的说明.

event:CbEvent 定义的几个常量,分别对应几种不同的物理行为,有点类似于 flash 事件的 Event 里面的常量类型

**handler**:具体的回调.

**precedence**:如果 space 监听了多个相同类型的 Listener,那么这个字段可以决定那个 Listener 的回调先触发,值越大优先级越高.

**options**:触发条件,是针对 CbType 而言的.

**opinion**可是多种类型:CbType,OptionType, CbTypeList, Array<CbType>, flash.Vector<CbType>.借助 OpinionType 类型可以衍生出很多有趣的过滤规则,下面这段话来自官方手册:

<pre>// match against any object having the SPIKE type.
options = SPIKE

// match against any object having - inclusively - the SPIKE or COLLECTABLE type
options = [SPIKE, COLLECTABLE]

// match against any object having the SPIKE type, but that does not have the COLLECTABLE type.
options = SPIKE.excluding(COLLECTABLE)

// match against any object having - inclusively - the SPIKE OR COLLECTABLE type// but that does not have either one of the COLLECTOR type or SPIKEABLE type.
options = new OptionType([SPIKE, COLLECTABLE]).excluding([COLLECTOR, SPIKEABLE])// or
options = SPIKE.including(COLLECTABLE).excluding(COLLECTOR).excluding(SPIKEABLE)//</pre>

通常对于 nape 的监听可以这么翻译:当 event 的物理行为触发时寻找 opinion 里面的条件,如果条件满足执行 handler.

#### Nape 定义的四种 Listener

##### BodyListener:针对单个刚体状态的监听器

<pre class="lang:as decode:true">new BodyListener(event, options, handler, precedence = 0)</pre>

某物(options)在某时(event)干什么(handler);

这里的 event 只接受两种类型(如果用的是 dev 版本,传入非法 event 会有人性化的报错)

- CbEvent.SLEEP 目标休眠
- CbEvent.WAKE 目标激活回调(handler)接受一个 BodyCallback 类型的参数,**返回 Void**

##### **ConstraintListener:针对 Nape 里面物理约束的状态监听,先掠过**

- CbEvent.SLEEP
- CbEvent.WAKE
- CbEvent.BREAK

##### InteractionListener:交互监听,可以用来监听两两刚体的交互状态

<pre class="lang:as decode:true">new InteractionListener(event, interactionType, options1, options2, handler, precedence = 0)</pre>

物体 1(options1)和物体 2(options2)在某时(event)发生某事(interactionType)时做什么(handler)

- CbEvent.BEGIN 交互开始
- CbEvent.ONGOING 紧接在 Begin 之后,表示正处于交互中
- CbEvent.END 交互结束时回调(handler)接受一个 InteractionCallback 类型的参数,**返回 Void**

##### **PreListeners**

这是一种特殊的 InteractionListener,能根据需要在两物体发生交互前改变一些状态(比如之前定义两个物体能发生交互,可以在这个监听里面让他们不交互),nape 在检测到两个物体交互发生时但还没做进一步的物理演算时会触发的. 之后才触发 InteractionListener 的回调.

<pre class="lang:as decode:true">new PreListener(interactionType, options1, options2, handler, precedence = 0, pure = false)</pre>

这个监听没有 event 这个参数,因此默认在注册此监听的情况下,它会在交互的任何阶段都触发(具体来说就是在交互过程中每次触发 step 函数都会执行这个 handler)

除了 handler 之外其他参数和 Interlistener 功能都类似

老规矩 handler 接受的参数是 PreCallback,但是它的回调除了是 Void 之外还可以是 PreFlag 类型,

###### Nape 定义了四个不同的 PreFlag 常数

**PreFlag**.**ACCEPT**

如果返回此 Flag,说明交互在这一步和接下来的所有((触发 CbEvent.End 之前))step 函数执行中都是允许交互的.并且这个回调(handler)将在 CbEvent.End 前只触发这一次.

**PreFlag**.**IGNORE**

如果返回此 Flag,说明交互在这一步和接下来的所有((触发 CbEvent.End 之前))step 函数执行中都是忽略交互的.并且这个回调(handler)将在 CbEvent.End 前只触发这一次.

**PreFlag**.**ACCEPT_ONCE**

如果返回此 Flag,说明交互只在这一步 step 函数执行中是允许交互的.这个回调在 CbEvent.End 前的每一次 step 都会继续执行用来判断 Preflag 的值

**PreFlag**.**IGNORE_ONCE**

如果返回此 Flag,说明交互只在这一步 step 函数执行中是忽略交互的.这个回调在 CbEvent.End 前的每一次 step 都会继续执行用来判断 Preflag 的值

###### pure 参数的作用:

当 Body 在一定时间内没有速度变化时,它的状态会自动由 awake 状态变成 sleep 状态时,即使在两个物体发生交互时也会触发,当 Body 变成 Sleep 后任何注册的监听都不会被触发.

PreListener 的最后一个参数 pure 如果是 false 可以让两个物体不进入休眠状态,这样就能一直得到回调了. 当然这个参数在 PreFlag 是 Accept 或者 Ignore 时是没有多少意义的,因为这两个 flag 会导致这个 handler 只触发一次.

### 3:为 Space 注册对应的监听

在创建好了 Listener 之后,最后一步是将这个 Listener 加入到 Space 的 Listener 列表中这样这个监听才会生效.

最后放一个 demo 测试.这个 demo 中 test 开头的是三个回调测试,下面的日志表示当前状态.

<embed src="/images/uploads/2013/04/CallbackTest.swf" width="500" height=380>

### 参考资料

[demo 源码](https://github.com/Tomyail/mixTest/blob/master/src/nape/CallbackTest.as)

[官方文档](http://napephys.com/help/manual.html#Callbacks)
