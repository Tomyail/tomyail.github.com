---
title: 使用Git，从Git Eclipse插件开始
tags:
  - git
id: 935
comment: true
categories:
  - 技术
date: 2012-02-19T21:40:03.000Z
path: /learning-git-via-eclipse
---

对于版本控制系统，半年前从 Subversion 换到了 Git 之后就对 Git 爱不释手了。对我来说以下两个优点对我来说印象特别深刻：

1.  分布管理。我工作的第一家公司使用的版本控制系统是 SVN，管理代码的工作方式我们需要将自己写的代码交给组长，组长审核通过后合并提交到总库，然后我从总库下载并融合到本地，这是 SVN 系统下的主要工作流吧。但是这种工作方式的一个大缺点就是在我们开始写自己的模块到最后提交给组长融合的这段时间我们的代码并不再版本控制之下，因为我们没有总库的写权限，所以就会导致各种悲剧性的重复修改。使用 Git 之后你就会发现 Git 将总库的版本信息全部克隆到了本地，我们做的所有修改都可以记录到本地库的版本历史而不用考虑服务器的读写权限。
2.  快速的分支切换，有时没事 checkout 一下，看代码调试代码利器。

学习 Git 推荐一本”开源"的电子书《Pro Git》,之所以说开源是因为这本书的原始内容在 Github 上，[Pro git 中文版本下载](http://progit.org/2010/06/09/pro-git-zh.html)。等熟悉了 Git 的一些基本命令之后我们可以寻求一种快速的方法来使用 Git，避免每次提交都要使用 Terminal。这个方法就是使用[EGit](http://www.eclipse.org/egit/)（Git for Eclipse）。
Eclipse 安装插件（FlashBuilder 同理）的方法就不多说了。[EGit 的下载链接](http://www.eclipse.org/egit/download/)。（如果你不到算上传代码到服务器，这段可以忽略）稍微知道 Git 的朋友都会知道如果想要将本地的代码上传给服务器，使用 SSH 生成的密钥是个比较简便的方法，我这里假定本机已经给服务器上传了公钥了，不懂如何操作的可以看[SSH 的配置](http://help.github.com/ssh-key-passphrases/)，安装好 EGit 之后我们需要让它知道我们的 SSH 文件在本地的位置。点击 Windows-》Perferences 搜索输入 SSH 就会发现如下的页面

![](<./Preferences .png> "Preferences ")

将 SSH2Home 的路径改成自己 SSH-key 的存放目录就好了，Windows 默认好像是 C 盘当前用户名下面的。ssh 目录。这里说说使用该插件导入 Git 项目的方法，我以自己的一个小项目 asds 为例

1.  进入[asds](https://github.com/Tomyail/asds)[项目主页](https://github.com/Tomyail/asds),
2.  复制那个 SSH 协议的路径（这几个路径的区别自己看书去。。。）
3.  打开 Eclipse 点击 File-》Import 选择 Git 然后一直 next
4.  出现选择 Git 仓库的页面，点击 Clone
5.  在出现的 Git 配置页面中往 URI 中粘贴上述 SSH 地址（貌似都自动帮帖了..)
6.  点击 Next 它就开始向服务器索要项目分支了，这里我们选默认的 master 按 next
7.  之后弹出 Git 保存页面，选择自己希望保存的地方，（我保存在/home/tomyail/Develop/source/as3/asds）保存点 Finish
8.  这时 Git 仓库选择界面就多出了一个我们克隆的 asds 项目，由于我的 asds 项目里没有上传 FlashBuilder 的工程配置文件，所以接下来点 next 是没有意义的，直接点击取消。
9.  创建一个新的 Flex 项目，项目路径选择之前 Git 的保存点，也就是/home/tomyail/Develop/source/as3/asds，命名成 asds
10. 右击新创建的 asds 项目，选择 Team-》Share Project，类型选择 Git，之后弹出配置 Git 仓库选项
11. 由于之前已经做了配置，这里我们让 Git 自动寻找这个项目里面的 git 信息，选中"Use or create repository in parent folder of project”，之后点击 Finish 就 OK 了。对于配置好的包含 git 信息的项目，项目名旁边会显示当前该项目所在的分支，此时右击项目选择 Tream 会发现多了很多选项，如下图

        ![](/images/uploads/2012/02/Team-182x300.png "Team")

        点击Show in History 就能看到该项目的每次提交的改动并Checkout，对于阅读代码很有用哦。

本文大致介绍了 Egit 插件的基础配置和使用，还有很多有趣的功能可以自己挖掘。
