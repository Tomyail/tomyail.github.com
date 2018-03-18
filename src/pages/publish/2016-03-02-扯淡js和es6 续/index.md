---
title: 扯淡js和es6 续
categories:
  - 技术
tags:
  - js
date: 2016-03-02T13:42:24.000Z
path: /thinking-about-js-and-es6-2
---

事情从我使用 koa 开始吧。[koa](https://github.com/koajs/koa)是 js 界的[tj 大神](https://www.zhihu.com/question/24377059)又一力作。它是一个 server 框架，据说要成为下一代 express，主要亮点是使用 generator 替代回调以及 promise 产生的回调链，让代码看上去更加优雅。

但是，[generator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)是一个 es6 特性。如果你使用的 node 版本低于 4，必须加上`--harmony_generators`手动开启 generateor 特性（为什么等下扯）。

然后我就想，既然 generator 对 nodejs 有版本要求，那就使用 babel 把代码转译（transpiling，转换＋编译）成 es5 的代码吧。babel 是干啥的它的[中文文档](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)写的很详细。无论是使用 babel 还是 babel-node，似乎它的转换都不会自动把库代码（node_modules 里面的代码）也转换成 es5。但是 koa 依赖的`composition`库定义了一行 generator 函数`promiseToGenerator`，node 低版本又不认 generator，所以就会报\*不识别之类的语法错误。

这时的解决方案应该有三种：
1\. babel 强制转换 node_modules 里面的代码，听上去挺蠢的，我没去做。
2\. 使用 webpack 把关联代码都转换了，思路和 1 差不多只不过产出是一个打包过的大 js 文件。
3\. 给运行的的 node 加入`--harmony_generators`或者升级到 node4。

最终我应该会选择 2，因为一定有一大堆现成的参考案例可以使用。这里主要说明下 node 的`--harmony`参数。

node 版本从 0.12.7 直接跳到了 4，因为中间经历和一段 io.js 时期，具体细节可以参考[Node.js 与 io.js 那些事儿](http://www.infoq.com/cn/articles/node-js-and-io-js)。归纳下来就是 nodejs 最终和 io.js 合并，并且默认开启了一些稳定的 es6 特性，所以不需要 4 以后不需要显式的加入 harmony 参数。至于从 0 跳到 4，大概是为了和 io.js 惊人的版本迭代速度保持一致吧（集市式开发战胜教堂式开发的一个例子）。

node4 带来了哪些 es6 特性，原文如下：

> This brings with it many bonuses for Node.js users, most notably a raft of new ES6 features that are enabled by default including block scoping, classes, typed arrays (Node's Buffer is now backed by Uint8Array), generators, Promises, Symbols, template strings, collections (Map, Set, etc.) and, new to V8 v4.5, arrow functions.

es6 的完整特性可以参考[ECMAScript 6](https://github.com/lukehoban/es6features)。对比就会发现 node4 和 harmony 没有实现两个 es6 特性：Modules（import 写法），Destructuring（对象解构）。这两个特性其实还蛮好用的，所以遇到这种情况还得使用 babel 来转换。

以上就是在使用 es6 时遇到的一些小坑，相信等 es6 标准完全确定之后，这些技术细节都会被统一，到时候搞 js 就不用在 care 这些几枝末节了。
