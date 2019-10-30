---
title: 从 electron 2 迁移到 5 遇到的坑
categories:
  - 技术
tags: 
  - electron
path: /migration-from-electron-2-to-5/
---


从 2 升级到 5，发现 electron 在安全性提升了很多。这也导致迁移遇到了一堆问题

一: 原来的 webview 标签在默认可以使用,现在必须在创建 BrowserWindow 是显式使用 `webviewTag`开启.

二: 当 BrowserWindow 开启了 `nodeIntegration` 之后, 原来 webview 里面的内容可以直接使用 `require` 引用模块并执行 node 代码. 升级到新版之后, 要想在webview 里面使用, 必须给 BrowserWindow 传入 `nodeIntegrationInSubFrames`.

三: 新增的 `nodeIntegrationInSubFrames` 属性不但让 webview 里面的 js 有能力执行 node代码, 连 iframe 里面的 js 也有了. 这导致当我使用了一个不受控制的的第三方 script 标签，而这个script 标签又动态的创建了一个 iframe 并且在这个 iframe 使用了 jquery 时，会报 `jQuery is not defined`. stackoverflow 给出了[解决方案](https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined). 但是这个解决方案的问题是他假定我们可以随意修改引用 jQuery 的那段代码. 但我们的问题是那段代码不受我们控制,属于第三方. 是在运行时动态下载脚本的. 所以我们要做的是拦截请求,在其代码执行前将 module 设置成 undefined.

electron 为我们提供了解决方法: [WebRequest](https://electronjs.org/docs/api/web-request). 大致思路就是匹配第三方包含 jQuery 的 vendor 脚本 url, 然后用 `onBeforeRequest` 拦截 url ,下载 url 的内容,在内容的头部插入 `module = undefined`, 然后保存文件并跳转. 具体 api 请参考 [onBeforeRequest的定义](https://electronjs.org/docs/api/web-request#webrequestonbeforerequestfilter-listener).
