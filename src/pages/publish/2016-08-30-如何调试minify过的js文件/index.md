---
title: 如何调试minify过的js文件
tags:
  - js
categories:
  - 技术
date: 2016-08-29T16:43:01.000Z
path: /debug-js-without-sourcemap
---

用 webpack 开发 js 项目，生产环境和开发环境一般会使用两套配置，其中一个明显的区别就是对调试的支持。

js 的代码调试主流做法就是使用[sourcemap][1]。

webpack 通过配置参数[devtool][2]来控制 sourcemap 的几种行为，开发环境一般配个`inline-source-map`就够用了，生产环境改成`false`就不会生成 sourcemap 了。

然鹅，总有些情况奇葩情况，开发环境好好的，生产环境就是跪了，日志看半天看不出什么名堂，这个时候你最希望的就是能直接断点调生产环境的代码了。

但是缺少了 sourcemap，被压缩过的 js 根本不是给人看的，比如这个样子的：
![minified-js][minified-js]

幸亏右击 chrome 菜单，发现一个神奇的选项：
![chrome-add-source-map-menu][chrome-add-source-map-menu]

试了一下果然可以，而且这个 sorucemap 支持任意路径，如下形式都是支持的：

* `file:///User/XXX/hash.js.map`
* `http://localhost:3000/hash.js.map`
* `http://yourdomain.com/hash.js.map`

所以接下里的解决方案就比较明显了，生产环境也生产 sourcemap，只不过这个文件不显示的嵌入 js 或者 html 里面。

webpack 支持这种模式的 sourcemap，只要把`devtool`的值改成`hidden-source-map`。

之后借助 gulp 之类的任务工具把生成的 sourcemap 静态文件放在 server 某个地方，client 需要使用的时候 chrome 右击添加就可以调试了，简直爽歪歪。

[1]: http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html "JavaScript Source Map 详解"
[2]: https://webpack.github.io/docs/configuration.html#devtool "devtool"
[minified-js]: http://7xqh45.com1.z0.glb.clouddn.com/2016-08-29-minified-js.jpg "minified js without sourcemap"
[chrome-add-source-map-menu]: http://7xqh45.com1.z0.glb.clouddn.com/2016-08-29-chrome-add-source-map-menu.jpg "chrome add source map menu"
