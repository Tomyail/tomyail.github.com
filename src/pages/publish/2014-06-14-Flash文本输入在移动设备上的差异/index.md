---
title: Flash文本输入在移动设备上的差异
tags:
  - 技术
  - Flash
id: 1245
path: /flash-text-mobile-difference/
created_at: 2014-06-13T16:46:53.000Z
updated_at: 2014-06-13T16:46:53.000Z
---

最近在用 Flash 做一个文本编辑器,能让用户在指定位置输入几个单词,并且整段文本会有很多不一样的格式,所以用到了大量`TextField`的方法.总体思路是记住最后一次光标输入的位置,然后监听键盘事件,在键盘输入字符时改变光标位置的字符,这个`Textfield`本身不是输入(`Input`)文本,而是一个动态(`Dynamic`)文本.
一切在 PC 上都能完好的工作,但是在移动设备上跑一个 Demo 各种不正常所以打算总结下这几天的小折腾.

<!--more-->

以下所有测试结果基于自己的机器:

> Android 手机: 4.1.2
>
> Ipad 平板:7.1.1

#### PC 正常但移动设备无法正常工作的一些例子

##### 一:文本的链接事件响应有问题.

`TextField`的`TextEvent.Link`无法很灵敏的响应,有时干脆直接不响应.Ipad 上也是响应了一次之后就无法在收到第二次响应了.
因为在编辑器中有些文本在点击它时需要获取一些额外数据,我通过 Link 事件并获得`TextEvent.text`的值来获取这部分额外数据.\
解决方法:[Text URL in AIR iOS app not selectable](http://stackoverflow.com/questions/12627757/text-url-in-air-ios-app-not-selectable)

##### 二:键盘行为的差异

这一块坑最多..

首先,移动设备不像 PC 那样能很容易的获取到键盘,所以直接监听键盘事件在移动设备上是无法工作的.

- 默认情况下当应用的焦点位于输入文本位置时,软键盘会自动弹出.但是问题在于我的文本不是输入文本,所以不会自动弹出键盘,而且我不能将我的文本设置成输入文本,不然用户就能**随便编辑**这段文本,而且之前应用的文本样式会**全部消失**.
- 我无法接收到`KeyDown`之类的键盘输入事件,因此就算给这段文本增加`needsSoftKeyboard=true`或者`requestSoftKeyboard()`;这类的代码也没什么作用,因为就算能弹出键盘但是监听不到键盘输入也是没用的.
- 输入文本在 Ipad 上只能发出`Change`事件,所以只能通过对比`Change`前后的文本差异来推算用户输入了什么字符.

解决方法:
由于移动设备的键盘行为和 PC 有一定的不同,这里后来想出了两种解决方法.

1.  不使用系统的软键盘,而是自己写一个.后来发现真有人做了一个[as3-virtual-keyboard.git](https://github.com/nidin/as3-virtual-keyboard.git)
2.  依然使用系统的键盘.在点击本文 A 的时候获取用户正在点击的那个字符串的坐标,然后在那个位置增加一个输入文本 B,并使其处于激活状态,之后监听这个输入文本 B 的`Change`事件,在此事件触发后改变 A 的文本.这里的操作需要程序控制文本的焦点,但是我发现使用`stage.focus`居然没法设置焦点...一番谷歌之后发现 Adobe 专门为移动设备提供了一个新的文本[StageText](http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/flash/text/StageText.html).但这个文本有一个问题,在**安卓**系统中它的`Change`事件会在设置其`text`时直接派发,而 IOS 不会派发...
3.  无论是手动还是调用代码的方法选中一段文本,就会自动弹出一些系统菜单,不知道这个怎么禁用.
4.  输入文本移动光标两个系统的操作不同,如果想手指那光标移动到哪需要自己监听 MouseClick 事件实现
