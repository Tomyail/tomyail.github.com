---
title: electron 集成 addon 方案简介
categories:
  - 技术
tags:
  - electron
  - node-addon
path: /introducing-node-addon-development-with-electron/
date: 2020-04-18T13:10:59.333Z
---

## addon 简介

node 提供了一种调用 c++ 写的库的方式,叫 [addon](https://nodejs.org/api/addons.html). 需要我们写一层 c++ wrapper 暴露各种 api 给 node 使用. 本文不讲 addon 开发细节. 讲一下 addon 在开发 electron 项目方便的一些工程化实践.

由于 node 版本更新快,接口更新频繁,导致和 c++ 交互的 [abi](https://en.wikipedia.org/wiki/Application_binary_interface) 接口经常发生变更,这时需要重新编译 addon 的 c++ 源码适配对应的 abi. 虽然 node 开源了一个叫 [nan](https://github.com/nodejs/nan) 的库可以帮助我们编写不基于具体 node 版本的 addon. 但是依然无发改变每次更新 node 版本都要重新编译 addon 的事实.

细心的同学可能会发现我们在用 yarn 安装依赖时, 第一次安装最后一步 (Building fresh packages) 通常要等很久.这是因为这个时候其实 node 在帮助我们重新编译 addon(或者下载预编译好的).

## 编译 addon

绝大多数 addon (比如 [node-sqlite3](https://github.com/mapbox/node-sqlite3)) 一般使用预编译的方式发布. 通过读取本地的 node 版本动态的拉取远程编译好的,此时只要保证开发机网络通畅一般就不会有太多问题. 可以使用 [node-pre-gyp](https://github.com/mapbox/node-pre-gyp) 快速搭建工作流程.

另一种方法就是在开发机通过源码编译, mac 天然开发友好型系统,一般不用特别的配置. 至于 window 你需要 c++ 全家桶.可以参考 [node-gyp 关于 window 的配置指南](https://github.com/nodejs/node-gyp#on-windows). 如果你后面要 debug addon, 建议直接下载 Visual Studio (vs 版本切换可能是个坑..).

等你把 c++环境配好了,node-gyp 就可以舒舒服服的工作了..

### node-gyp

[node-gyp](https://github.com/nodejs/node-gyp) 包装了 gyp. [gyp](https://gyp.gsrc.io/) 是谷歌玩剩下的一套构建系统(他们现在用 Ninja,不过 gyp 可能比 makefile 先进..). node-gyp 会读取项目的 `binding.gyp` 配置然后动态生成编译配置(生成后的配置 mac 上给 xcode 消费,window 上给 visualStudio 消费).所以一般的,如果你在一个 node 项目里面看到这个 gyp 文件,大概率这是一个 addo 项目.

c++ 编译 addon 首先需要下载 node 和 v8 的 c++ 头文件. 这个过程是 node-gyp 自动完成的. 这些头文件多数放在国外,所以很可能 node-gyp 都配好了但是因为网络不给力导致头文件下载失败或者下载不全,最终让 addon 编译失败. 不过头文件什么的问题国内淘宝镜像一般都帮我们解决了,装一下 [mirror-config-china](https://www.npmjs.com/package/mirror-config-china)即可.

### electron rebuild

好,说了半天 node 编译 addon. 我们来说一下这和 electron 有啥关系. 由于不同版本的 electron 内嵌了不同的 Chromium; 不同的 Chromium 又带了不同的 node 版本. 也就是说 electron 内置的 node 版本和我们开发机上的 node 并不是同一个版本. 当你在 yarn 编译 addon 时,node-gyp 是按照本地 node 版本去编译 addon 的. 我们期望 node-gyp 按照 electron 里面的 node 版本去重新编译. 此时你需要 [electron-rebuild](https://github.com/electron/electron-rebuild). 这个库的作用就是读取你安装的 electron 版本,然后按照其内置的 node 版本去 [调用 node-gyp](https://github.com/electron/electron-rebuild/blob/master/src/rebuild.ts#L364) 编译 addon.

显而易见,如果是使用 addon,预编译的方式更加方便. 但是如果你是开发 addon;升级 electron 版本等,从源码编译会更加适合你.

## 持续集成

开发编译 addon 的流程大致介绍到这. 接下来是持续集成(ci)的问题了.

因为 addon 的编译必须依赖平台, 在 mac 上运行的 addon 必须用 mac 操作系统编译, 在 window 上运行的必须用 window 编译. 如果你在 mac 上编译了 window 的 addon,可能会报一个`这不是一个有效的 32 位程序`. 所以编译 addon 的 [ci runner](https://docs.gitlab.com/runner/) 的运行环境不能是 docker,只能是真实的 mac 或者 window 操作系统 + shell. 这也是我们一开始 ci 的运行方案: 编译 window 用 window ci runner,编译 mac 用 macos.

后来我们需要排查 addon crash 导致的各种问题,在集成 electron 的 [crashReport](https://electronjs.org/docs/api/crash-reporter) 时,文档推荐了几个第三方 crash 收集平台. 我们试了下 sentry 和 Backtrace. 最终觉得 Backtrace 更加专业.

addon 的事后 debug 和 js 差不多. 首先编译后的时候把 sourcemap 和 编译包分离开来. 编译包交给用户. sourcemap 自己上传到 backtrace. 当 crash 发生之后, crashReporter 会自动上传错误堆栈到 backtrace.

![breakpad.png](./breakpad.png)

[图片来源](https://chromium.googlesource.com/breakpad/breakpad/+/master/docs/getting_started_with_breakpad.md)

### 32 位 64 位问题

有些 c++库（比如早期的声网 rtc）在 window 上只提供了 32 位，所以我们需要确保编译 addon 也是按照 32 位编译的。由于现在绝大多数 window 都是 64 位。你下载的 node 也是 64 位。node 自带的 npm 下载的 electron 当然也是 64 位。当你使用过了 64 位 electron 时，通过 electron-rebuild 编译出来了 64 位的 addon，但是它调用的 c++ 确实 32 位的，然后凉了。。

解决方法是安装 32 位 electron（用 64 位 electron 编译没用的）

```
npm install --arch=ia32 electron
```

之后再 package.json 里面定义 `arch:ia32`

## 后记

今天整理印象笔记忽然发现这篇没有写完的文章。这篇文章上一次更新应该还是去年 12 月份。如今虽然我已经换了项目组，不再折腾 electron 开发。但是开发 addon 的这段经历确实还是挺好玩的。它可以让一个 web 开发人员接触到他们的终极梦想：chrome 源码，v8 引擎，libuv。后面有机会继续折腾~
