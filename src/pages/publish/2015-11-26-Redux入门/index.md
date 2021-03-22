---
title: Redux入门
tags:
  - 技术
  - JavaScript
path: /introduction-of-redux/
created_at: 2015-11-25T22:59:39.000Z
updated_at: 2015-11-25T22:59:39.000Z
---

# 前言

最近项目需要，开始研究使用 JS 开发原生 Web 应用。用到了[Electron](http://electron.atom.io/)，界面方面打算使用[React](https://facebook.github.io/react/)，然而在学习 React 的同时接触到了和它配套的 MC 框架[Flux](https://facebook.github.io/flux/)，但是奇怪的是这个例子[flux-react-router-example](https://github.com/gaearon/flux-react-router-example)写了半天最终却推荐使用[Redux](https://github.com/rackt/redux)，于是就有了这篇文章。

<!--more-->

# 代码预览

Redux 框架本身非常小，代码量也很少，所以在介绍 Redux 之前把 Redux 的基本代码先展示一下应该是个好主意。

```js
import { createStore, combineReducers } from 'redux';

//action 1
function addItem(name, itemType) {
  return {
    type: 'ADD_ITEM',
    item: name,
    itemType: itemType,
  };
}

//action 2
function changeUserName(name) {
  return {
    type: 'CHANGE_USER',
    name: name,
  };
}

//reducer
var itemReducer = function (state = { items: [] }, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [
          ...state.items,
          { item: action.item, itemType: action.itemType },
        ],
      };
    default:
      return state;
  }
};

//reducer
var userReducer = function (
  state = { user: { name: 'default user' } },
  action
) {
  switch (action.type) {
    case 'CHANGE_USER':
      return { ...state, user: { name: action.name } };
    default:
      return state;
  }
};

//combine multi reducers to one reducer
var combinedReducer = combineReducers({
  user: userReducer,
  item: itemReducer,
});

//creae store using combined reducer
var store = createStore(combinedReducer);

//subscribe
store.subscribe(function () {
  console.log('current state', store.getState());
});

//dispatch action
store.dispatch(addItem('item1', 1));
store.dispatch(addItem('item2', 2));
store.dispatch(addItem('item3', 3));
store.dispatch(changeUserName('newName'));
```

输出结果

    current state { user: { user: { name: 'default user' } },item: { items: [ [Object] ] } }
    current state { user: { user: { name: 'default user' } },item: { items: [ [Object], [Object] ] } }
    current state { user: { user: { name: 'default user' } },item: { items: [ [Object], [Object], [Object] ] } }
    current state { user: { user: { name: 'newName' } },     item: { items: [ [Object], [Object], [Object] ] } }

# Redux 入门介绍

## Redux 是什么

解释一：是一套事件发送接收系统，并且有能力管理发送事件时产生的数据和状态的框架。

解释二：是一套生成 Action，将 Action 里面的数据以 State 的形式保存到 Store 里面,并且通过 Store 的事件发送以及侦听能力,把 State 数据传递到需要关系的业务模块上到框架

这里不引入传统 MVC 框架的概念，纯粹以 Redux 定义的概念来阐述。一方面我觉得因为每个人对 MVC 的认识深度不一样，所以概念统一度上有偏差；另一方面学一个新的框架，放下以往所有的偏见和经验重新开始，等入了门再比较结合，也不失为一种好的学习方式吧。

接下来将针对解释二逐步解释各个术语的概念。

## Action 和 Action 创建函数

上述代码中`addItem`和`changeUserName`函数的**返回值**是 Action，这两个函数**本身**被成为 Action 创建函数。

- 约定上，Action 对象至少需要一个`type`字段用来作为此 Action 的唯一标志。
- Action 创建函数的作用是为 Action 指定动态数据。
- 通过 Middleware 能让 Action 创建函数有能力处理具体的业务逻辑，这个等下细说。

## Reducer

JS 的数组有一个[reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)函数，作用就是将数组里面的当前元素和下个元素进行一个操作（自定）然后把结果再作用于下一个元素直到末尾。

Reduce 不会对原有的数据产生影响

以下是官网的摘录：

> reducer 就是一个函数，接收旧的 state 和 action，返回新的 state。之所以称作 reducer 是因为和 Array.prototype.reduce(reducer, ?initialValue) 格式很像。保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作：
> 修改传入参数；
> 执行有副作用的操作，如 API 请求和路由跳转。

将 Action 里面的瞬时数据"持久化"到 state 里面.然后通过 store 集中管理.这就是 reducer 函数的作用。

上面代码中`itemReducer`和`userReducer`就是两个 Reducer。

### 如何新增 Reducer

reducer 函数接收两个参数，`state`和`action`

state 是持有当前 reducer 状态的值，第一次传入的时候需要指定一个默认值，否则这个 state 就是未定义对象。

通过对 action `type`的判断进入相应的 state 操作逻辑。

由于对 state 的操作不能有副作用，所以 reducer 返回的新 state 基本是上一个 state 的复制。\*

＊：当然有特殊情况，当 action 不符合任何一条判断时，需要返回原来的 state。

产生新对象的方法有好多，官网文档大致用到了三种：

一：[Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

```js
Object.assign({}, state, {
  didInvalidate: true,
});
```

二： [ecmascript-rest-spread](https://github.com/sebmarkbage/ecmascript-rest-spread)

    //Object Spread
    { ...state, message: action.value}

三： [immutable](https://facebook.github.io/immutable-js/)

```js
var Immutable = require('immutable');
var map1 = Immutable.Map({ a: 1, b: 2, c: 3 });
var map2 = map1.set('b', 50);
map1.get('b'); // 2
map2.get('b'); // 50
```

### 如何合并多个 Reducer

通常来说一个 Reducer 处理一个业务模块，多个 Reducer 可以通过`combineReducers`来合并。

上述例子中

```js
var combinedReducer = combineReducers({
  user: userReducer,
  item: itemReducer,
});
```

这个就属于合并多个 reducer。

合并后的 reducer 在每次通过 dispatch 触发行为后，每个 reducer 只会接收到自己关心的那一部分 state。

比如上面两个 reducer 里面，userReducer 传入的 state 不会包含 itemState；同理，itemReducer 里面也不会包含 userState。

## Store

入口,维护 State 树,需要 Reducer

获取当前状态树 getState()

发送 Action dispatch(action)

注册 Action 回调 subscribe(listener)

替换当前的运行逻辑(热重启) replaceReducer(reducer)

## Middleware

> Middleware 是一个[高阶函数](https://zh.wikipedia.org/wiki/%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0)，它将 dispatch function 组合并返回一个新的 dispatch function。它通常将 异步 actions 变为 actions。

Middleware 提供了一种途径，让 action 在被 dispatch 之前有能力处理一些额外的业务逻辑，当然包括异步。

有了 Middleware，Action 里面就可以编写异步请求多而且业务逻辑很复杂的代码了。

只有异步 Action,没有异步 Reducer。

由于刚入 js 不久，文档看下来感觉这个 Middleware 是一个亮点

相关的源代码如下

<https://github.com/rackt/redux/blob/v1.0.0-rc/src/utils/applyMiddleware.js>
<https://github.com/rackt/redux/blob/v1.0.0-rc/src/utils/compose.js>
<https://github.com/rackt/redux/blob/v1.0.0-rc/src/utils/composeMiddleware.js>

这种函数套函数看得我头都晕了，瞬间觉得 js 高大上有木有～

#### 编写自己的 Middleware

`applyMiddleware`的实现方式决定了一个 Middleware 的大致写法，先直接上代码：

普通写法

```js
var yourMiddleware = function ({ dispatch, getState }) {
  return function (next) {
    return function (action) {
      // YOUR MIDDLEWARE LOGIC HERE
      // return ?
    };
  };
};
```

文艺写法(箭头函数)

```js
var yourMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  // YOUR MIDDLEWARE LOGIC HERE
  // return ?
};
```

可以看出一个 Middleware 由三层传值和两次函数 return 组成。

看看这几个形参的含义：

dispatch:store 的 dispatch 函数引用 ＊
getState:store 的 getState 函数引用 ＊
next:进行原先的函数逻辑
action:具体的 action

＊：思考下为何不直接传 state 而是它的两个函数引用

Middleware 函数将 dispatch 收到的参数先做一次“过滤”（通常是对特定的 action 做特定的逻辑，比如把 action 当作函数执行）再发往给对应的 reducer 处理，middleware 函数会在每次触发 dispatch 的时候都执行，所以尽量不把业务逻辑写到这里面来。

看一下官方提供`redux-thunk`实现的抽象 middleware

```js
export default function thunkMiddleware({ dispatch, getState }) {
  return (next) => (action) =>
    typeof action === 'function' ? action(dispatch, getState) : next(action);
}
```

非常抽象和通用，只要 action 是个函数，就把 action 当作函数执行。

为了验证 middleware 的用法，我增加了一些代码：

```js
function getUserName() {
  return (dispatch, getState) => {
    dispatch(startGetUser());
    setTimeout(() => {
      dispatch(endGetUser('fromRemote'));
      dispatch(changeUserName('fromServer'));
    }, 3000);
  };
}

//状态,配合UI
function startGetUser() {
  return {
    type: 'START_GET_USER',
  };
}

function endGetUser(name) {
  return {
    type: 'END_GET_USER',
  };
}
```

最后通过`applyMiddleware`把 middleware 混合到`createStore`函数里面。并使用这个函数创建 store（有点绕。。）

```js
var createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
var store = createStoreWithMiddleware(combinedReducer);
```

##### 自定义 action 创建函数返回值

只要有能解析特定类型的 action，其实 action 可以是任何对象。比如我把上面的`getUserName`改一下：

```js
function getUserName2() {
  return {
    cb: (dispatch, getState) => {
      dispatch(startGetUser());
      setTimeout(() => {
        dispatch(endGetUser());
        dispatch(changeUserName('fromServer'));
      }, 3000);
    },
    type: 'GET_USER',
  };
}
```

那么我们的 middleware 可以写成这样：

```js
var getUserMiddleware = function ({ dispatch, getState }) {
  return function (next) {
    return function (action) {
      if (action.type != 'GET_USER') {
        return next(action);
      }
      return action.cb(dispatch, getState);
    };
  };
};
```

作用和第一种差不多，只不过第二种把具体的业务逻辑写到了 middleware 里面，比较不推荐，你们感受下～

## 总结

- 注意每个 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据。换句话说不能从 Reducer 里面获取全局 State,建议将这些逻辑提到 Action
- Reducer 每次都执行,但传入的 state 是它关心的那一部分
- Middleware 是中间件,每次 dispatch 他都参与执行
- Middleware 可以是抽象的,也可以是具体的
- Action 的返回值可以是任意类型,只要有合适的 Middleware 处理
- redux-thunk 定义了一个抽象的,通用的,Action 模板,让 Action 有自身的逻辑处理传入的数据,此时 Action 就有点 Command+Controller 的味道
- 使用箭头函数简写
- （埋坑）现在还在接触 react，等入门了总结下怎么和 redux 结合。
- 说了这么多，其实学习 redux 最好的方法就是看源码，代码量不大，就是有点绕。

## 参考链接

1.  [Redux 中文文档](https://camsong.github.io/redux-in-chinese/)
2.  [Learn how to use redux step by step](https://github.com/happypoulp/redux-tutorial)
3.  [Awesome list of Redux examples and middlewares](https://github.com/xgrommx/awesome-redux)
4.  [深入到源码：解读 redux 的设计思路与用法](http://div.io/topic/1309)
5.  [A Comprehensive Guide to Test-First Development with Redux, React, and Immutable](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)
6.  [A Soundcloud client built with React / Redux](https://github.com/andrewngu/sound-redux/)
