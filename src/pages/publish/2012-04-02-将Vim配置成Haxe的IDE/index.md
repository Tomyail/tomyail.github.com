---
title: 将Vim配置成Haxe的IDE
tags:
  - Haxe
  - VIM
id: 967
comment: true
categories:
  - 技术
date: 2012-04-02T12:11:32.000Z
path: /vim-hexe-ide/
---

将 Vim 作为 Haxe IDE 的过程基本完成，留此文备忘。

所有线索都是从 Githubs 上的[vim-haxe 项目](https://github.com/MarcWeber/vim-haxe)开始的，在这个项目的 Readme 文件里，作者推荐我们使用[VAM](https://github.com/MarcWeber/vim-addon-manager)来安装插件，所以我照做安装了 VAM，VAM 的中文安装教程可参见[更好的管理 Vim 插件 vim-addon-manager](http://blog.syndim.org/2011/07/06/vim-addon-manager/)一文。

安装好 VAM 之后，就是安装 vim-haxe 插件了，在 Vim 里面输入

<pre>:InstallAddons vim-haxe</pre>

调用 vam 的安装 vim-haxe，经过一系列的"Y”操作之后，安装完成（这里中途报过安装插件重复的错误...)

直接在~/.vimrc 里面加入

<pre>call scriptmanager#Activate(["vim-haxe"])</pre>

让 vim 随机加载这个插件。

之后下载了一个 haxe 项目测试，我拿[Nape](https://github.com/deltaluca/nape)来做测试了。

项目 clone 下来之后发现 nape 作者用了一个叫 caxe 神马的预处理程序将 haxe 源文件变成了自定义的 cx 文件，直接导致 vim-haxe 插件成了浮云...

<!--more-->

为了解决此问题，直接在 vimrc 文件里面加入一句

<pre>autocmd BufRead *.cx set filetype=haxe</pre>

之后打开 nape 项目里的 cx 文件，代码亮了!

按照 vim-haxe 的 readme 文件，按&lt;Ctrl+X>&lt;Ctrl+O>   和&lt;Ctrl+X>&lt;Ctrl+U>能自动补全，我按了前一个弹出要我指定 hxml 文件，于是我写了一个，但之后报什么"List 作 String 使用”之类的一大堆错误 (- -!!!)

另外 vim 输入

<pre>:ActionOnWriteBuffer (文档中说是:ActionOnBufWrite，但vim找不到该命令）</pre>

选择 hxml 也没有编译 hx 文件，仔细看了文档以为是 ctag 没装引起的，于是 Google 搜索到了这篇文章[手把手教你把 Vim 改装成一个 IDE 编程环境(图文)](http://blog.csdn.net/wooin/article/details/1858917) ，索性按照上面的教材安装插件（这篇文章介绍了很多插件，我只选用了几个必要的）。

1:ctags

我是直接在 Ubuntu 软件中心找到 ctags 安装的，之后在在～目录下面新建一个.ctags 的文件，按照 vim-haxe 的说明并做了适当修改（为了支持 nape 的.cx 文件）:

<pre>--langdef=haxe
--langmap=haxe:.hx.cx
--regex-haxe=/^package[ \t]+([A-Za-z0-9_.]+)/\1/p,package/
--regex-haxe=/^[ \t]*[(@:macro|private|public|static|override|inline|dynamic)( \t)]*function[ \t]+([A-Za-z0-9_]+)/\1/f,function/
--regex-haxe=/^[ \t]*([private|public|static|protected|inline][ \t]*)+var[ \t]+([A-Za-z0-9_]+)/\2/v,variable/
--regex-haxe=/^[ \t]*package[ \t]*([A-Za-z0-9_]+)/\1/p,package/
--regex-haxe=/^[ \t]*(extern[ \t]+)?class[ \t]+([A-Za-z0-9_]+)[ \t]*[^\{]*/\2/c,class/
--regex-haxe=/^[ \t]*(extern[ \t]+)?interface[ \t]+([A-Za-z0-9_]+)/\2/i,interface/
--regex-haxe=/^[ \t]*typedef[ \t]+([A-Za-z0-9_]+)/\1/t,typedef/
--regex-haxe=/^[ \t]*enum[ \t]+([A-Za-z0-9_]+)/\1/t,typedef/
--regex-haxe=/^[ \t]*+([A-Za-z0-9_]+)(;|\([^)]*:[^)]*\))/\1/t,enum_field/</pre>

之后在 nape 的根目录运行

<pre>ctags -R</pre>

就会发现多出一个 tags 文件，里面是各种函数变量的定义，验证 tags 是否有效的方法就是将光标移到一个方法或者类上面，按&lt;CTRL+]>看能否跳到指定的定义上面去。

2:WinManager

Vim 里面输入

<pre>:InstallAddons winmanager%1440</pre>

安装好直接在 vimrc 里面加入自动启动以及

<pre>let g:winManagerWindowLayout='FileExplorer|TagList'
nmap wm :WMToggle<cr>

let Tlist_Show_One_File=1
let Tlist_Exit_OnlyWindow=1</pre>

做一些必要的配置，但此时打开.cx 文件 taglist 里面并没有任何东西，后来发现还需要添加一句

<pre>let tlist_haxe_settings='haxe;f:function;v:variable;c:class;i:interface;p:package'（注意第一个t小写！）</pre>

让 taglist 支持 haxe。

重新用 vim 打开一个 cx 文件，按 wm 就能出来一个像模像样的 IDE 界面了。

由于 vim_haxe 会让你下载 haxe 的源码，下过来之后我在其目录也生成了一个 tags 文件，并将其加入到当前 vim 的 tags 列表中，也就是在 vim 中输入如下命令：

<pre>:set tags+=/haxe-src/tags</pre>

<del>此时发现输入&lt;c_x>&lt;c_o>以及&lt;c_x>&lt;c_u>能偶尔出来代码提示，真心的偶尔...</del>

更新：

经过一段时间是试用以及其 vim 源码的阅读，发现这个插件大致是这么用的：

1：如果你是双击一个 hx 文件直接用 vim 打开，当输入&lt;c_x>&lt;c_o>时会在根目录里寻找 hxml 文件

2：如果你在有 hx 文件的目录先打开终端，然后通过终端用 vim 打开 hx 文件，此时插件会去当前目录里面寻找。

3：当输入 ActionOnWriteBuffer（或者没 Buff 的那个，这两个啥区别不知...)时，插件会根据 1，2 的目录条件在其下生成一个 tmp.hxml，而且此时不保证插件不出错。

4：用 3 方式生成的 hxml 文件指令是在一行里面的，如果让 haxe 执行这个文件会说这个类非法，需要手动将每个指令换行处理。

5：当指定 hxml 文件时，插件在每次保存(:w)时都会编译一次，如果有错误会在 quickfix 里面提示。

结论：如果你的 hxml 指令很多，能通过&lt;c_x>&lt;c_o>载入自己的 hxml 最好。只是简单的运行的话可以用 2 方式选择自动生成 hxml 代码并运行。如果你会编写 makefile 文件，可以将 hxml 文件的指令写到 makefile 里面，然后用插件自带的脚本作为代码提示的条件（因为你按&lt;c_x>&lt;c_o>时就会提示你选择 hxml 文件）。

最后截图留念..

![](<./DummyNapeMain.cx + (~-Develop-source-haxe-nape-cx-src) - VIM_024.png> "DummyNapeMain.cx + (~-Develop-source-haxe-nape-cx-src) - VIM_024")

补充：

让 ctags 支持 as：<http://vim-taglist.sourceforge.net/extend.html>
