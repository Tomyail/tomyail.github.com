---
title: 一些对TLF和FTE的思考
tags:
  - Actionscript3
  - FTE
id: 139
comment: false
categories:
  - 技术
date: 2010-07-20T09:49:55.000Z
path: /some-thoughts-on-the-tlf-and-fte
---

原文链接:<http://www.gskinner.com/blog/archives/2010/07/some_thoughts_o_1.html>

几个月前我一直在思考关于 TLF 的一些事情,不仅仅是如何使用它,哪些特征是我喜欢的或者我发现了什么新 bug.而是关于它的原理和建立其基础的底层模型.

###### 背景

###### <span style="font-weight: normal;font-size: 13px">flash player 10 引入和新的 flash.text.engine.*(FTE)包,这个包中提供了一些处理低级别文本的能力.FTE 继承了 flashx.textLayout.*包下面的一组类,而被称为 Text Layout Framework (TLF)在 FTE 的基础上实现了"高级功能”。,这个框架能同时被 flex 和 flash 共享.这些类提供了一些抽象 FTE 的接口,但依然相当的低级别.</span>

Flash 通过 TLFTextField 组件引入 TLF,这个组件集成在 IDE 里面提供了类似 TextField Api 的高级别抽象方法,并且提供多种文字排版特征.这些特征包括多列文本,文本线程(text treads 又称链接文本域),右到左和垂直的文字,以及一些对印刷的增强.

Flex4 框架通过 3 个基本组件实现 TLF:Label,RichText 以及 RichEditableText,这些组件提供了一些改进级别的文字处理能力.Label 显示单行具有一些特定格式的文本,RichText 支持可以嵌入图形和全格式的多行文本.RichEditableText 增加了链接,编辑,滚动以及选择.但 Flex 并不支持文本线程.

###### 原理

TLF 只暴露一些非常低级别的播放器 API,然后在其之上建立一个"统一"的高级别 AS3 API.这样做的原因主要考虑到减小播放器的尺寸.并且使 TLF 库的发展不依赖于播放器的升级而变化.这意味着开发人员可以不必等新版本播放器发布出来之前就能利用新的 TLF 特征.

其意图是好的,但我并不觉得这是最好的解决办法.为了文本功能导入的 Actionscript 库所引发的各种问题个人觉得远远超过了上述所说的各种优点.

###### 文件大小

核心 TLF 库的大小大约是 160Kb.他是通过 RSL(.swz 格式 ps:runtime shared library)导出的.这意味着一旦用户下载了这个 swz 文件.它将存储在本地缓存中并且下次不用重新下载就可重复使用,多的域名也是使用这个 swz 的.

在 flash 专业版中使用 TLFTTextField 类将使你的 swf 增加 60kb.对于 HelloWorld 这种仅仅将文字写到舞台上的程序来说,60KB 未免有些大了.

###### 性能

由于 TLF 是用 as 写的,所以它和别的 as 代码一样同样面临性能和内存问题.

相比于 TextField,TLF 使用更多的 CPU 资源计算以及处理显示对象,基于这个原因 Adobe 不建议将 TLF 用于手机产品.

另外 TLF 同样比 TextField 占用更多的内存.里面有大量 Object 描述文本的架构和排版,另外还有大量的显示对象(TextLine)需要内存.

更糟糕的是这些占用内存的对象始终渲染所有对象,而不是只渲染只显示在屏幕上的东西或者滚动条内可见部分的对象.这样导致的结果就是 fp 无法回收这部分内存.

###### 一致性和复杂性

TLF 被寄予 flash 和 flex 团队的一次重大合作的厚望.这些团队真正需要共同努力以创造一个统一的组件框架和综合创造平台.但不幸的是我认为这还有点距离.

对于 flash 方面来说问题还好,但是对于 Flex 来说没有类似的高级别控制文本.即使是 TextArea 也缺乏 TextField 的大部分功能.为了实现更简单的任务比如像定位一个字符串的具体位置就不得不使用 TLF 了
