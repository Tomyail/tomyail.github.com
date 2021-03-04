---
title: async-flow:一个帮助我们用声明式的代码风格编写复杂异步逻辑的轮子
categories:
  - 技术
tags: 
  - rxjs
  - 异步编程
path: /write-asynchronous-logic-in-declarative-coding-style-with-async-flow/
date: 2020-06-07T14:10:59.333Z
---


我们有个关于作业的app 启动后需要先获取一个作业 id 列表（请求 A），然后根据 id 列表的长度构建 n 个页面。 当用户翻到某一页时，根据这个 id 获取当前作业的详细情况（请求 B）。

这是基本流程，但是这个 app 还有很多不同的模式，会根据角色和场景请求不同的 API。 比如老师角色，有布置作业，预览作业，批改作业模式。作为学生也包含很多模式，比如练习作业，订正作业，回看作业等。

不同模式对应的 api 接口和数据结构可能都有一定的区别。

* 老师布置模式，请求的不是接口 A，而是接口 A'（对应的接口数据解析逻辑也不一样）。
* 老师批改和学生回看作业，除了获取作业详细情况外(请求 B），还需要额外获取学生的做题答案（请求 C）。
* 学生订正模式，获取做题答案方式是和请求 A 同时发送的。

所以我的想法是把这些根据模式导致的异步逻辑的差异性封装起来，对外部不可见。外部调用后只要返回统一的数据格式就好了。于是乎用 RxJS 造了一个异步流程控制的轮子。这个轮子主要解决什么问题？

1. 可以用一种声明式的方式定义每个不同的异步逻辑块
2. 不同异步逻辑块之间的依赖关系可以是先后依赖，或者并发关系。而且每个异步逻辑有能力创建子异步逻辑。
3. 每个异步逻辑不管怎么处理，最后汇总到统一的上下文上，后续业务逻辑只要消费这个数据就好了。
4. 隐藏 rxjs 操作符的复杂性，只要会 promise 就可以使用

好了先放主角： [asnyc-flow](https://github.com/Tomyail/async-flow)

async-flow 的详细用法在项目主页的 readme 文档写了，这里主要说明下如何用结合这个实际例子使用 async-flow

由于有很多不用的模式，所以我们可以创建不同的异步逻辑配置：

```javascript

import * as apis from "./api";

const getHomeWorkList = {
  name: "getHomeWorkList",
  flow: (context) => {
    return apis.getHomeWorkList(context.homeworId);
  },
  map: (result, context) => {
    //对作业列表做一些数据处理,比如 jsonapi 格式转换啥的,这里略
    const finalResult = doSomeParse(result);
    //context 可以定义额外的属性方便后续异步逻辑获取
    context.exerciseId = finalResult[0].id;
    context.list = finalResult;
    return finalResult;
  },
};
const getPreviewList = {
  name: "getPreviewList",
  flow: (context) => {
    return apis.getPreviewList(context.previewIds);
  },
  map: (result, context) => {
    //我们假设预览模式获取的结果不用 parse,可以直接使用
    context.exerciseId = result[0].id;
    context.list = result;
    return result;
  },
};
const getExerciseDetetail = {
  name: "getExerciseDetetail",
  flow: (context) => {
    //由于我们约定 getExerciseDetetail 一定是在 getPreviewList 或者 getHomeWorkList 之后运行的
    //所以可以获得他们执行完后注入的 exerciseId
    const exerciseId = context.exerciseId;
    return apis.getExerciseDetetail(exerciseId);
  },
  map: (result, context) => {
    //对作业列表做一些数据处理,比如 jsonapi 格式转换啥的,这里略
    return result;
  },
};
const getUserAnswerById = {
  name: "getUserAnswerById",
  flow: (context) => {
    return apis.getUserAnswerById(context.exerciseId);
  },
  map: (result, context) => {
    return result;
  },
};
const getUserAnswerList = {
  name: "getUserAnswerList",
  flow: (context) => {
    return apis.getUserAnswerList(context.homeworId);
  },
  map: (result, context) => {
    return result;
  },
};
```

我们先用声明式的方法定义每个异步阶段的具体请求逻辑和数据解析逻辑。

如上述代码展示的，我们定义了老师布置模式需要获取的作业列表`getPreviewList`，其他模式获取作业列表的方式 `getHomeWorkList`。 为了统一后续获取` exerciseId` 的方式，这里还给 `context ` 注入了 `exerciseId`。

另外我们还定义统一的获取当前作业详情的 `getExerciseDetetail` 。 这个异步逻辑使用 `context` 定义的 `exerciseId`， 所以它不知道这个 `exerciseid` 来自哪个流程。

最后定义了两个获取用户答案的接口。

在定义完所有异步流程后，剩下的就是把他们组装起来了。

```javascript

import {buildFlow} from '@tomyail/async-flow';

//老师布置,先获取 getPreviewList,再获取 getExerciseDetetail
const teacherPreviewFlow = (context) =>
  buildFlow(context, [getPreviewList, getExerciseDetetail]);

//学生练习,先获取 getHomeWorkList,再获取 getExerciseDetetail
const studentPractice = (context) =>
  buildFlow(context, [getHomeWorkList, getExerciseDetetail]);

//老师批改,先获取 getHomeWorkList,然后同时获取 getExerciseDetetail 和 getUserAnswerById
const teacherComment = (context) =>
  buildFlow(context, [
    //使用 children 属性在父异步逻辑执行完毕后执行子异步队列
    { ...getHomeWorkList, children: [getExerciseDetetail, getUserAnswerById] },
  ]);

//学生订正,先获取同时获取 getHomeWorkList 和getUserAnswerList,然后在获得getExerciseDetetail
const studentReview = (context) =>
  //使用对象定义并发异步逻辑,使用数组定义队列异步逻辑
  buildFlow(context, {
    ...{ ...getHomeWorkList, children: [getExerciseDetetail] },
    getUserAnswerList,
  });
```

组装完毕之后，异步流不会自动执行，需要调用 subscribe 才能运行。
所以最后的运行代码如下：

```
const getMode = (mode, context) => {
  switch (mode) {
    case "studentRevise":
      return studentRevise(context);
    case "teacherComment":
      return teacherComment(context);
    case "studentPractice":
      return studentPractice(context);
    case "teacherPreviewFlow":
      return teacherPreviewFlow(context);
  }
};

//假设值学生做题模式
getMode("studentPractice", { homeworId: "123" }).subscribe((data) => {
  data.getHomeWorkList; //作业列表
  data.getExerciseDetetail; //作业详情
  data.getUserAnswerById; //用户答案
});
```

封装这个库的初衷是降低 rxjs 的使用门槛(我之前写过一篇 rxjs 的[简介](https://blog.tomyail.com/introducing-reactive-programming-with-rxjs/)可以参考）。目前从项目内的使用情况来看目的达到了。后续我将会把错误处理完善一下,感兴趣的帮忙点个星(星星眼~)

