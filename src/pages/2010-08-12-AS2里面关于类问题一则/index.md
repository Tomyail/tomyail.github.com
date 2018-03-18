---
title: AS2里面关于类问题一则
tags:
  - ActionScript2
  - Flash
id: 208
comment: false
categories:
  - 技术
date: 2010-08-12T11:48:20.000Z
path: /as2-class-question
---

as2 里面的面向对象还不是很完善,下面举一个例子

    class Test
    {
        private var count:Number = 0;

        public function Test()
        {
            trace("OK");
            doSth();
        }

        public function doSth():Void
        {
            trace("doSth");
            this.countPlus();
        }

        private function countPlus():Void
        {
            trace("++count " + ++count);
        }
    }

这里我定义了一个 Test 类,然后在主文件中调用

```js
var test = new Test();

var keyListener: Object = new Object();

keyListener.onKeyDown = test.doSth;

Key.addListener(keyListener);
```

trace 之后的消息我发现只有在构造函数中调用了 countPlus,

主文件间接调用无效.

但是如果单独调用`test.doSth()`,则 countPlus 还是会执行的.后来得到帮助才得力理解其中的原因

因为`KeyListener.onKeyDown= test.doSth`,

as2 将其理解为

```js
keyListener.onKeyDown = function(): Void {
  trace("doSth");

  this.countPlus();
};
```

所以他在当前的函数作用域中找不到 contPlus 的定义,所以这个定义在类中的函数也就没有执行
