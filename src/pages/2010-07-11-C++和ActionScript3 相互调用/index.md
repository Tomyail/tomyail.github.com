---
title: C++和ActionScript3 相互调用
tags:
  - Actionscript3
  - C++
id: 131
comment: false
categories:
  - 技术
date: 2010-07-11T00:05:56.000Z
path: /c-actionscript3-interface
---

记得自己刚接触 As3 的时候.我的任务就是做几个 Flash 界面供 C++程序调用,当时用的方法就是 ExternalInterface 类下面的两个静态方法"call"和"addCallBack 折腾来折腾去.不过那时的情况是 Flash 这方面只是一个供 C++程序调用的素材而已,所以这个方法是可以用的.

但如果项目是基于 as 端的而不是 C++端的,也就是说整个工程最终编译是由 as 方面编译完成的比如 Flex 编译的可能情况就不一样了,因为 as 端得清楚 C++的接口是放在那里让 flash 调用的,C++没有 swf 这种导出格式吧- -!最终还是在群里问到了答案,有一个项目叫做 Alchemy,中文名"炼金术",这个工程会先把 C++程序编译成 swc 文件,然后 flex 这方面导入那个 swc 素材库就行了,接下来就是调用 C++写好的接口了.

但我这里有个小小的疑问?C++编译成 swc 之后是在还能保持 C++的高效性吗?不懂...

应该说这个项目是我负责的,因为最终是我负责编译整个程序.
