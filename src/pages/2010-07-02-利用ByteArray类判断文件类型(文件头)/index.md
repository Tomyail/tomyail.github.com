---
title: 利用ByteArray类判断文件类型(文件头)
tags:
  - Actionscript3
  - Flash
id: 122
comment: false
categories:
  - 技术
date: 2010-07-02T08:37:22.000Z
path: /bytearray-judge-file-type
---

一个文件只是简单的通过拓展名来判断文件类型是很不安全的,因为一些恶意木马就是通过改变拓展名来伪装自己从而让用户误点激活病毒,而且对于上传之类的应用,简单的判断拓展名很容易引发注入之类的攻击,所以有效的判断文件类型是很重要的.通常一个文件的一个文件开头几字节和末尾几字节都是文件的标志,里面有包含文件类型的说明,所以判断开头几字节(文件头)是一个有效的检测文件类型的方法.

思路知道了,接下来说说具体实现方法,以 as3 语言为例.As3 中新增的 ByteArray 很强大,通过这个类就能实现上述的方法

以图片为例:

```js
var encoder: JPGEncoder = new JPGEncoder(); //图片格式转换类
var bytes: ByteArray = encoder.encode(Bmp.bitmapData); //把加载进来的位图转码
bytes.position = 0;
var p0: int = bytes.readUnsignedByte(); //读取第一个字节的值
var p1: int = bytes.readUnsignedByte(); //读取下一个字节的值
if (po.toString(16) == "ff" && p1.toString(16) == "d8") trace("jpg格式");
else if (other) {
  //其他格式文件头可以去网上查阅;
}
trace("文件大小为:" + bytes.length);
```
