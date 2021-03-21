---
title: 使用travis自动部署hexo日志
tags:
  - 技术
  - CI
path: /writing-hexo-blog-with-travis-ci/
created_at: 2016-09-04T15:44:21.000Z
updated_at: 2016-09-04T15:44:21.000Z
---

## 起因

最近打算好好写博客，所以又重新打理起了自己的日志。现在我写日记的流程基本是这样的。

1.  首先本地有两个`git`目录`a`，`b`分别指向同一项目的不同分支。
    2\. 目录`a`对应`master`分支，是 hexo 发布后的内容
    3\. 目录`b`对应`draft`分支，是 hexo 的原始`markdown`内容
2.  想到一个主题
3.  先用[mweb][1]在`b`目录的`draft`文件夹中写好内容
4.  完成后使用`hexo publish {name}`把日志移到`post`文件夹
5.  调用`hexo g`更新 public 文件夹
6.  调用`rsync`把`b`里面的`public`内容复制到`a`目录
7.  然后把`a`目录下的所有文件提交

最后三步 hexo 提供了一个插件`hexo-deploy-git`，不过我觉得自定义不强，因为 commit 的日志就是简单的日期，没有任何意义。所以就自己写了一个[shell][2]脚本来处理了这块逻辑，提交的时候会自动获取`draft`的最后一次提交记录作为`master`分支的 commit。

这样做的另一个好处是规范自己写`git commit`的格式，如果有人对一篇日志的修改记录感兴趣，直接翻 git 日志就好了。关于如何写好 git 提交记录，可以参考[这篇文章][3]。

可是问题是最后三步虽然脚本化了，但依然需要本地调用，占用本地资源。

**有没有一种方法，可以让自己在提交了`draft`分支后，自动触发编译，然后发布到`master`呢？而且整个过程都有日志可以查询，而且是在 server 进行的？**

答案是肯定的，这个过程有个专门的名次叫做[可持续集成(continuous integration)][4]，简称 ci。

之前在公司写过一点，使用 jenkins，然后可以自己 ssh 到 server 配环境。

不过 github 上最火的 ci 系统是[travis][5]，所以借这个小项目学一下 travis 的配置。

<!-- more -->

## 配置细节

首先网上查了下关于这方面的文章，发现了几篇[1][6],[2][7],[3][8],教程都大同小异，我就简单总结下自己遇到的坑吧。

### travis-ci 网页配置

首先是连通 travis 和 github，这一步基本没什么问题，把项目打个勾就启用了。
![][img1]

接着点击右边的齿轮，切换到`setting`页面的截图长这样

![][img2]

1.  点击`C`区域，可以获取当前项目的状态图片，加到项目的 EREADME 文件里面就可以看到当前项目的编译状态。
2.  `D`区域的环境变量坑了我三十来次编译次数，后面细说。

### travis-ci 本地配置

#### 编写.travis.yml 文件

travis 通过识别项目根目录下的`.travis.yml`文件来确认需要执行的命令。所以现在本地项目根目录建一个空的文件`.travis.yml`

以下是我项目的初始配置。

    language: node_js

    node_js: #node 版本
    - stable

    os: # 虚拟机系统
    - osx

    cache: #缓存不更新的文件
      apt: true
      directories:
      - node_modules

把这个文件 push 到 github，稍等片刻你应该能看到 travis 会自动触发编译并且报告编译成功。

到此，基本的 ci 系统已经能运行了，快去庆祝下。

#### 配置 Travis 提交 github 项目的权限

github 提供了[四种方式][10]让我们提交代码。接下来主要说明基于 ssh 的和基于 oauth 的，两种方式都能让 travis 有权限提交 github 项目。

##### 基于 ssh 的权限配置

基于 ssh 的权限配置包括 SSH agent，参考（[1][11]，[2][12]，[3][13]）和[Deploy key][10]。

在 travis 上面，ssh agent 都是要配置的。

deploykey 基于个人喜好，如果你想为项目提供单独的公私钥匙，使用 deploykey。否则，可以使用 github 的全局公钥（这里假定`~/.ssh/id_rsa*`已经存在，并且作为了 github 的全局 ssh key）。

如果使用默认的全局 sshkey，那么就允许了 travis 拥有了我们 github 账户的所有权限。

如果设置了 deploykey，那么 travis 只能提交包含对应 ssh pub key 的 github 项目。但是有一个麻烦之处：**github 不允许我们多次使用同一个 ssh key**，否则会报`key is already in use`之类的错误。

查了下是否可以通过 ssh_config 让同一个 ssh key 在多个项目使用，[这篇文章][14]写了方法，但是方法已经失效。因为 github 针对我们的 git 项目，早就把 git 的 url 从`repA.github.com`,`repB.github.com`换成了所以`username.github.com/repoA`,`username.github.com/repoB`。**所以如果你的 travis 项目需要访问自己的多个 github 项目，不要使用 deploykey 这种方式。而是直接使用全局 ssh key**

本着不折腾会死的原则，我在这里介绍下 deploykey 的设置。

###### 生成 ssh key

命令行输入：

    ssh-keygen -t rsa -b 4096 -C "youremail"

**在询问我们保存路径的时候，不要按回车**，不然会覆盖`～/.ssh/id_rsa*`(假设已经有）。我们重命名一下，比如输入`id_rsa_repo`，这个时候就会在**命令行当前目录**生成一对 ssh 秘钥（id_rsa_repo 和 id_rsa_repo.pub)

之后把`id_rsa_repo.pub` 里面的内容复制到 github 项目里面。具体在项目下面的`settings`，里面有个`deploy keys`，我就不截图了。

###### 上传 ssh 私钥到 travis

travis 可以看成是一个无状态的虚拟机，每次触发一个任务的时候，它都会初始化系统环境。所以我们不能直接把生成的`id_rsa_repo`私钥上传到 travis 服务器。travis 的做法是把`id_rsa_repo`私钥“直接”放在 github 的项目文件里面，在每次触发任务的时候，读取项目里面的 ssh 私钥，然后和 github 通信。

但是`id_rsa_repo`私钥其实就相当于 ssh 会话的密码，放在 github 项目里面，就等于公开了自己的密码，这样无论谁拿到`id_rsa_repo`，都能修改我们的 github 项目了。

这就是我在上面那句话的“直接”加引号的原因，**travis 需要我们加密我们的私钥**。

为了加密我们的私钥，首先我们需要下载 travis 提供的命令行工具（travis-cli）。

    gem install travis

安装成功之后，使用 github 账号登陆

    travis login --auto

登陆方式你可以选择使用用户名密码，或者[github-token][9]。

如果使用 token 登录，命令改成如下方式登录

    travis login --github-token 'yourToken'

通过 `travis whoami`确认登陆是否成功。

之后输入加密我们的`id_rsa_repo`文件：

    travis encrypt-file id_rsa_repo

不出意外会在当前目录多出来一个`id_rsa_repo.enc`文件，同时 travis 的项目网页 setting 里面会多出来两行**加密**过的环境变量`encrypted_XXX_key`和`encrypted_XXX_iv`。

此时`id_rsa_repo`文件就被我们加密成了`id_rsa_repo.enc`文件，通过`encrypted_XXX_key`和`encrypted_XXX_iv`这两个值能还原成`id_rsa_repo`文件。但是`encrypted*`这两个文件的具体值被 travis 加密过，所以也就只有 travis 能解密了。

增加 ssh_config 文件，它的的作用是明确告诉 ssh 哪些域名用哪些 ssh key，避免 ssh 客户端的询问框打断 travis 的自动编译。

ssh_config 文件如下：

    Host github.com
        User git
        StrictHostKeyChecking no
        IdentityFile ~/.ssh/id_rsa
        IdentitiesOnly yes

最后修改 `.travis.yml`文件，加入解密代码以及 ssh agent 的配置。

    before_install:
    - openssl aes-256-cbc -K $encrypted_XXX_key -iv $encrypted_XXX_iv -in id_rsa_repo.enc -out ~/.ssh/id_rsa -d
    - chmod 600 ~/.ssh/id_rsa
    - eval $(ssh-agent)
    - ssh-add ~/.ssh/id_rsa
    - cp ssh_config ~/.ssh/config

##### 基于 oauth 的权限配置

如果你的 travis 项目涉及到多个 github 项目，我建议使用这种方式。

oauth 的方式需要使用`github-token`，上面文章有提到，你需要先生成一个。

基于 ssh 的权限配置，你需要使用 ssh 协议，所以你的 github 仓库远程路径如下:

    git@github.com:username/reponame.git

但是如果使用 oauth，你需要使用 https 方式，你的 git 远程路径需要改成

这里的 GH_TOKEN 是 travis 环境变量，我们需要手动加上:

![][img3]

    https://$GH_TOKEN@github.com/username/reponame.git

所以你可以在`.travis.yml`文件加入如下命令修改仓库地址

    before_install:
    - git remote rm origin
    - git remote add origin https://$GH_TOKEN@github.com/username/reponame.git

之后其他 github 仓库也需要按照上面这种格式重写 url。

最后可以参考下我的最终配置

<https://github.com/Tomyail/tomyail.github.com/blob/draft/.travis.yml>

### 总结

程序员就得懒，能自动做掉的尽量自动化，保持 dry 原则。travis 能配置的东西很多,此文章只是用来入门以及记录自己遇到的坑。更多细节需要查阅 travis 文档以及对 shell 脚本有一定的了解。

[1]: http://zh.mweb.im/ 'mweb'
[2]: https://github.com/Tomyail/tomyail.github.com/blob/draft/script/publish.sh
[3]: http://chris.beams.io/posts/git-commit/ 'How to Write a Git Commit Message'
[4]: http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html
[5]: https://travis-ci.org/
[6]: http://w3cboy.com/post/2016/03/travisci-hexo-deploy/
[7]: https://xuanwo.org/2015/02/07/Travis-CI-Hexo-Autodeploy/
[8]: http://lotabout.me/2016/Hexo-Auto-Deploy-to-Github/
[9]: https://github.com/settings/tokens
[10]: https://developer.github.com/guides/managing-deploy-keys/
[11]: https://developer.github.com/guides/using-ssh-agent-forwarding/
[12]: http://www.unixwiz.net/techtips/ssh-agent-forwarding.html
[13]: https://wiki.archlinux.org/index.php/SSH_keys_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)
[14]: https://gist.github.com/gubatron/d96594d982c5043be6d4 'multiple-deploy-keys-multiple-private-repos-github-ssh-config.md'
[img1]: ./2016-09-04-travis-setting1.jpg
[img2]: ./2016-09-04-travis-setting2.jpg
[img3]: ./2016-09-10-add-custom-env-var.jpg
