---
title: 如何利用同一个函数监听多个httpService的事件
tags:
  - Actionscript3
id: 137
comment: false
categories:
  - 技术
date: 2010-07-14T11:38:18.000Z
path: /how-to-addeventlistener-to-multi-httpservice-event
visible: false
---

加载一张图片是我们经常需要利用同一个函数判断不同的事件类型来做相应的事情,比如可以这样.

```js
var fileFoader: Loader = new Loader();
fileLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, loadHandler);
fileLoader.contentLoaderInfo.addEventListener(
  ProgressEvent.PROGRESS,
  loadHandler
);
fileLoader.contentLoaderInfo.addEventListener(
  IOErrorEvent.IO_ERROR,
  loadHandler
);

function loadHandler(event: Event): void {
  switch (event.type) {
    case Event.COMPLETE:
      fileLoader.contentLoaderInfo.removeEventListener(
        Event.COMPLETE,
        loadHandler
      );
      fileLoader.contentLoaderInfo.removeEventListener(
        ProgressEvent.PROGRESS,
        loadHandler
      );
      fileLoader.contentLoaderInfo.removeEventListener(
        IOErrorEvent.IO_ERROR,
        loadHandler
      );
      break;
    case ProgressEvent.PROGRESS:
      _loadbar.txt.text =
        Math.round(
          event.target.bytesLoaded * 100 / event.target.bytesTotal
        ).toString() + "%";
      break;
    case IOErrorEvent.IO_ERROR:
      trace("error");
  }
}
```

多个不同类型的事件利用同一个函数 然后判断对象的 type 来区别.在 flex 中一些常用组件还可以通过 id 来区别,但 HttpService 这个组件却没有像通过(e.target.id)来判断的.

后来知道其 send()方法返回一个 AsyncToken,帮助文档里明确说了"该对象与 result 或 fault 事件的 token 属性中的对象相同",所以我们就可以利用这个来判断了类似于以下代码:

```js
var http1: HttpService = new HttpService();
http1.url = "www.yourdomain1.com";
http1.addEentListener(ResultEvent.RESULT, Completed_handler);
var _getSeasonalRates1: AsyncToken = http1.send();
var http2: HttpService = new HttpService();
http2.url = "www.yourdomain2.com";
http2.addEentListener(ResultEvent.RESULT, Completed_handler);
var _getSeasonalRates2: AsyncToken = http2.send();

function Completed_handler(event: ResultEvent): void {
  if (event.token == _getSeasonalRates1) trace("1");
  else if (event.token == _getSeasonalRates2) trace("2");
}
```
