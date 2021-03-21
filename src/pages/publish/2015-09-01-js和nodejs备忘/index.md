---
title: js和nodejs备忘
date: 2015-08-31T22:13:45.000Z
tags:
  - 技术
  - JavaScript
path: /js-foundation/
---

## js 和 nodejs 的区别

js 是基于浏览器的脚本语言,nodejs 让 js 有能力脱离浏览器的环境直接让其跑在本地,并且具有了原生应用该有的操作.

这个 Actionscript3 和 AIR 的关系很类似,as3 是依赖于 flashruntime 的脚本语言.flashrumtime 除了我们熟知的浏览器 flash 插件外,还有一个叫做 AIR,它的运行环境是本地环境,所以通过 AIR 能让 as3 有能力在本地运行.

## npm 和 bower 的区别

bower 是对 npm 的进一步封装.

bower 是针对浏览器的包管理工具,npm 前后端通用.

在后端能直接使用`require`关键字使用对应的包.

对于浏览器需要使用 require.js 来实现.

所以浏览器不能直接使用针对 nodejs 编写的 js 文件,因为不支持`require`关键字.

使用[Browserify](http://browserify.org/)可以把`require`转换成`require.js`

#### 参考资料:

- [浏览器加载 CommonJS 模块的原理与实现](http://www.ruanyifeng.com/blog/2015/05/commonjs-in-browser.html)
- [AMD 和 CMD 的区别有哪些？](http://www.zhihu.com/question/20351507)

<!--more-->

## 如何新建一个 node 项目

    npm init

可以使用[Yeoman](http://yeoman.io/)为 js 项目指定项目类型,这样便可以以一种更加通用的项目结构创建项目.

## nodejs 面向对象相关

### 如何新建类/模块,继承,重写

假定有如下代码结构.我们想让 Child 继承 Base,并且能在 App.js 里面调用.

    .
    ├── app
    │   ├── Base.js
    │   ├── Child.js
    │   └── App.js
    └── node_modules
        └── moment

nodejs 里面模块的导出使用`module.export`来实现

`Base.js`:

```js
//http://www.ruanyifeng.com/blog/2012/10/javascript_module.html
//http://www.cnblogs.com/dolphinX/p/3485260.html
//https://stackoverflow.com/questions/15014133/util-inherits-how-to-call-method-of-super-on-instance
//https://stackoverflow.com/questions/16213495/how-to-inheritance-in-module-of-nodejs

//构造函数
var Base = function (name) {
  //var开头的变量是私有变量,外部无法访问.
  var _name = name;
  var isWolking = false;

  //this开头的是公共变量,这样写就是公共函数
  //这些不是类的函数,也就是说每次new出来的时候也会创建这些函数,这样比较占内存.如果是通用方法,需要写到原型上
  this.startWalk = function () {
    isWolking = true;
  };

  this.stopWalk = function () {
    isWolking = false;
  };

  this.isWolking = function () {
    return isWolking;
  };

  this.fly = function () {
    console.log(_name + ' fly');
  };
};

//在原型定义的函数是每个实例共用的,所以占用空间小?
Base.prototype.methodA = function () {
  console.log('methodA');
};

module.exports = Base;
```

`Child.js`

```js
//https://stackoverflow.com/questions/15014133/util-inherits-how-to-call-method-of-super-on-instance
var utils = require('util');
var Base = require('./Base');

function Child() {
  //用此方法把父类的模块方法导入进来,加了此方法后就能在此类访问父类的比如`startWalk`之类的方法
  Base.apply(this, arguments);
  var _fly = this.fly;
  this.fly = function () {
    //访问父类的方法
    _fly();
    console.log('from fly ' + this.isWolking());
  };
}

//用此方法把父类的原型方法继承进来(prototype)
//此方法必须比prototype先写,否则子类的prototype不识别
utils.inherits(Child, Base);

//定义新方法
Child.prototype.methodB = function () {
  console.log('methodB');
};

//重写父类方法
Child.prototype.methodA = function () {
  //注意是Child,不是Base
  Child.super_.prototype.methodA.call(this);
  console.log('and methodA from Child');
};

module.exports = Child;
```

`App.js`

```js
var Child = require('./Child');

var child = new Child('child');
//console.log(child);
child.methodA();
child.methodB();
child.fly();
console.log(child.isWolking());
child.startWalk();
console.log(child.isWolking());
```

## 集成工具

来源:[Grunt, Gulp, and Broccoli](https://www.youtube.com/watch?v=9JZ9gEVgoX4)

任务工具:帮助执行重复任务的工具编译工具:接受 js,产生转换后的 js

grunt:任务工具
gulp:任务工具/编译工具
broccoli:编译工具
