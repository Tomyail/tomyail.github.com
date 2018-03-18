---
title: Flex Application的加载顺序
tags:
  - Flex
id: 58
comment: false
categories:
  - 技术
date: 2010-06-14T20:27:39.000Z
path: /flex-application-srartup-sequence
---

对于 Flex 中的容器和非容器，Flex 执行**preinitialize->initialize->creationComplete ->applicationComplete**的事件顺序，只有当一个容器的子容器初始化之后父容器才能初始化，也就是说子容器先于他的父容器初始化。但是 creationComplete 事件只有在一个容器的父容器初始化之后（如果有父容器）才触发。

一个例子

    --Application

    ----Canvas
    --------VBox
    -------------Button
    -------------TextInput
    --------HBox
    -------------Label
    -------------Image

以上组件事件发生的先后分别为：

    1.  Application preinitialize;
    2.  Canvas preinitialize;
    3.  VBox preinitialize;
    4.  Button preinitialize;
    5.  Button initialize;
    6.  TextInput preinitialize;
    7.  TextInput initialize;
    8.  VBox initialize;
    9.  HBox preinitialize;
    10.  Label preinitialize;
    11.  Label initialize;
    12.  Image preinitialize;
    13.  Image initialize;
    14.  HBox initialize;
    15.  Canvas initialize;
    16.  Application initialize;
    17.  Button creationComplete;
    18.  TextInput creationComplete;
    19.  Label creationComplete;
    20.  Image creationComplete;
    21.  VBox creationComplete;
    22.  HBox creationComplete;
    23.  Canvas creationComplete;
    24.  Application creationComplete.
    25.  Application applicationComplete。

## preinitialize

应用程序 application 已实例化，但此时还未创建任何相关的孩子组件（child component）

## initialize

此时，创建了相应的孩子组件，但还未对这些子组件进行布局

## creationComplete

应用程序 application 完成全部实例化，并完成所有子组件的布局

## apllicationComplete

上面三处事件的完成，表明 application 内部启动的整个进程完成，接下来便会通知 SystemManager 派发 applicationComplete 事件。此时，启动程序启动完成并准备运行.

源码下载：[下载](http://cid-80c695601fb3b6c2.office.live.com/embedicon.aspx/Pulbic/Source/EventSequence.rar)；

更多信息：[more](http://livedocs.adobe.com/flex/2/docs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=LiveDocs_Parts&file=00001426.html)
