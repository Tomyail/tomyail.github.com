---
title: 使用sublime记录evernote
id: 1251
tags:
  - 技术
path: /using-sublime-to-update-evernote/
created_at: 2015-01-21T18:22:15.000Z
updated_at: 2015-01-21T18:22:15.000Z
---

evernote 的格式化编辑功能一直很弱,我平时写文档习惯使用 markdown 保持简单的格式.以前使用马克飞象编辑 markdown 文件然后同步到 evernote.

但问题是马克飞象貌似只支持单项同步,也就说我只能从飞象同步到印象,印象中已经存在的笔记同步到飞象里面编辑似乎不行,而且飞象不是永久免费的,当然这不是关键...

然后发现了一个神器[Evernote Package](https://packagecontrol.io/packages/Evernote)

怎么使用的文档其实软件写的很清楚,狂点[这里](https://github.com/bordaigorl/sublime-evernote/wiki/_pages)查看.

鉴于本人英文略水,所以还是把一些关键点记一下吧.

<!--more-->

#### 安装

evernote 插件只在 sublime 3 中使用,2 中木有,所以需要先升级到 sublime3

安装的方式有三种,详情查看[这里](https://github.com/bordaigorl/sublime-evernote/wiki/Installation)

我是利用 **PackageControl** 安装的,安装 PackageControl 的方法在[这](https://packagecontrol.io/installation#st3)

装好之后按 `ctrl+shift+p` (Win, Linux) 或 `cmd+shift+p` (OS X),在弹出的框里输入`Install Package`,回车之后输入`Evernote`,之后回车安装插件.

使用

##### 验证

首先需要获取往 evernote 读写的权限,默认走 evernote 那一套.如果你是使用印象笔记的,需要自己做额外的配置,插件的作者很贴心的写了[中文说明](https://github.com/bordaigorl/sublime-evernote/wiki/First-Use),好感动有木有!!!

##### 一般使用

支持的功能还挺多,更新,创建,查找什么的都有,详情懒得写了,自己看官网文档.

希望本地保存的时候直接同步线上 evernote 的,可以把配置项里面的`update_on_save`设置为`true`

##### 快捷键绑定

每次`cmd+shift+p`然后打`evernote`然后找命令略蛋疼,可以设置自定义的键盘绑定,关于键盘绑定的详细文档在[这里](http://docs.sublimetext.info/en/latest/customization/key_bindings.html)

这个是官网推荐的配置,还挺合手..

```js
[
  {
    keys: ['super+e'],
    command: 'show_overlay',
    args: { overlay: 'command_palette', text: 'Evernote: ' },
  },
  { keys: ['ctrl+e', 'ctrl+s'], command: 'send_to_evernote' },
  { keys: ['ctrl+e', 'ctrl+o'], command: 'open_evernote_note' },
];
```

##### 同步配置到 dropbox

[Syncing](https://packagecontrol.io/docs/syncing)

##### 一般工作流

打开 st3,`ctrl+e,n` 新建文档,`cmd+s`保存到 dropbox,然后写啊写,写的差不多保存,然后用 mou 预览下,ok 的话更新只 evernote.

##### 不足

不会保存 session,当编辑完文本关掉 st3 之后,下次打开本地的 markdown 文件并不会自动和 evernote 上的笔记对应,必须先从 evernote 上拿最新的文本编辑之后才能关联上.所以我的办法一般都是把本地的编辑好了之后整个文档复制一下,然后从 evernote 里面拿到对应的文本粘贴下,之后更新 evernote,然后保存本地文本.
