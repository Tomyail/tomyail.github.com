---
title: Ubuntu-11.04装完之后该做的配置
tags:
  - Ubuntu
id: 873
comment: true
categories:
  - 技术
date: 2011-06-19T00:46:16.000Z
path: /configure-after-install-ubuntu
---

<div>

今天本打算折腾 Ubuntu  11.04 unity 界面的 3D 特效，最后不但没成功而且把原来的界面也弄消失了，只能使用 gnome 经典界面，对于刚刚习惯 unity 界面操作的我来说很是懊恼，最后使用各种 Google 教我的方法无效之后决定重装....

重装完之后配置是件麻烦事，所以在这里备份下我的一些操作以防万一。

### 安装 dropbox

<http://www.dropbox.com/downloading>

#### 安装 proprietary daemon（dropbox 需要的）

<http://www.dropbox.com/download?plat=lnx.x86（解压之后放入～目录）>

### 安装 vidalia

sudo apt-get install tor

sudo apt-get install sysv-rc-conf（去掉 tor 的开机启动，避免 vidalia 乱叫）

sudo apt-get install vidalia //（安装完后选择”改变启动方式"，并手动将其设置为开机启动）

通过代理（<http://goo.gl/Kwd13> ps：这里不用 google 的原因你懂的）获取网桥<https://bridges.torproject.org/>

### 安装 dconf-tools（用于指定任务栏显示的图标）

sudo apt-get install dconf-tools

用 dconf-editor 打开之后进入 desktop/unity/panel 将 systray-whitelist 里面的 value 变成['JavaEmbeddedFrame', 'Mumble', 'Wine', 'Skype', 'hp-systray', 'scp-dbus-service', 'vidalia']（添加了 vidalia 显示，干脆点改成['all']）

### 安装 chrome（之后 google 账户一键同步）

<http://www.google.com/chrome/>

### 安装 thundbird（据说是 ubuntu 11.10 默认邮件客户端）

sudo apt-get install thunderbird

sudo apt-get remove evolution（卸载默认的 evolution）

之后添加任务栏 thundbird 快速启动

sudo add-apt-repository ppa:ruben-verweij/thunderbird-indicator

sudo apt-get update

sudo apt-get install xul-ext-indicator libnotify-bin

### 安装 shutter（截图工具）

sudo apt-get install shutter

### 安装 wine

sudo apt-get install wine

### 安装 vim-gnome（相对与 vim 增加了界面外壳，可以将文件打开方式设置为 vim）

sudo apt-get install vim-gnome

### 安装 chm 阅读

sudo apt-get install kchmviewer

### 调整控制栏

默认 ubuntu 的控制栏（ 最大化，关闭等按钮）在左边，通过以下设置可以往右边移动首先 Alt+F2 调出命令行，输入 gconf-editor 打开"/apps/metacity/general”,把 button_layout 项的值改回：menu:minimize,maximize,close

### 安装 ruby on rails 环境

sudo apt-get install build-essential libopenssl-ruby libfcgi-dev

sudo apt-get install ruby irb rubygems ruby1.8-dev

sudo apt-get install sqlite3 libsqlite3-dev

sudo gem install rails

sudo gem install sqlite3-ruby

sudo apt-get install sqliteman

完成之后 vim ~/.bashrc 编辑环境变量(需要注销重新登录）export PATH=/var/lib/gems/1.8/bin:$PATH

### 安装源码控制

sudo apt-get install subversion

sudo apt-get install git

### 安装源码控制 gui

sudo apt-get install rapidsvn

sudo apt-get install giggle

### 配置 wordpress

下载 xampp 之后经过基本配置后。

#### #wordpress 需要连接信息

define("FS_METHOD", "direct");#解决 wordpress 没有写入权限在根目录任意新建一个 php 文件写入

<?php echo(exec("whoami")); ?>

比如我的到的是 nobody 得到对应的权限用户组之后命令行输入（最后那个是我存放 wordpress 的根目录）

sudo chown -R nobody /opt/lampp/htdocs/wordpress/
去掉 wordpress 设置媒体里面所有图像的设置，为了上传图片路径的清爽和移植性

打开 phpmyadmin 执行 sql 查询语句 将网上图片路径设置为本地的 UPDATE wp_posts SET post_content = replace(post_content,'tomyail.com/blog','localhost/wordpress')

### 设置邮件，聊天（傻瓜化的，略）

### 设置 FlexSDK 路径

将/home/tomyail/sdk/FlexSDK/flex_sdk_4.5.0.20967/bin:写入.bashrc

### 备份

/usr/share/ibus-ping/db 的输入法词库

### TODO

备份 vim 的配置文件

</div>
&nbsp;
