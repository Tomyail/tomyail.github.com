---
title: 网件路由R6300 V2
date: 2015-08-10T19:58:41.000Z
categories:
  - 技术
path: /shadowsocks-on-netgear-R6300-v2
---

家里需要联网的设备越来越多,一直在用的极路由无线性能不行,玩 LOL 延迟一直 100ms 以上还时不时跳 ping.虽然使用电力猫转接有线的方式暂时解决了,但笔记本一直被一根网线约束着也不是办法.所以决定重新买一个路由器.本着要么不买,要么买高大上的原则,入了一个网件的 R6300 V2.

<!--more-->

实际用下来无线确实给力,玩游戏 ping 一直稳定在 45ms,即使还开着一台电脑看视频.

就是发热量有点大,用一阵子看看会不会死机.

所以原来的极路由和电力猫可以退休了.

原来的极路由按照[这里][1]给的固件轻松刷成了带有 ss(shadowsocks)功能的 OpenWrt,但是查了下,没有专门给 6300 定制的自带 ss 的固件，所以又要开始折腾了.

**更新**

1:玩 lol 依然跳 ping，应该和我的网卡有关，但是，后来我戒了 lol。。
2:兴致一过依旧是个普通的稳定路由器，玩不动了。。

## 固件选择

现阶段 R6300 用的最多的固件应该是 DD-Wrt,有篇完整的教程在[这里][2],我把里面的固件换成了[最新版][4],信息来自[这里][3].

## 基本设置

不出意外的话,刷好后就能通过`192.168.1.1`进入路由器了.

1.  修改界面语言
2.  修改路由器网页管理密码
3.  修改路由器无线密码
4.  重命名 5G 无限名称
5.  开启 SSH

    方法:

    1.  服务->服务->Secure Shell,启用`SSHd`
    2.  管理->管理->远程管理,启用`SSH管理`

6.  开启 JFFS2 支持

    方法:
    管理->管理->JFFS2 支持,启用`JFFS2`

7.  开启 USB 自动挂载

    方法:
    服务->USB,启用`核心USB支持`和`自动挂载磁盘`

    注:我使用了内置的 flash,有多余 usb 的可以用外置的.

## 安装 opkg

使用 ssh 登陆到路由器

`ssh root@192.168.1.1` 密码登陆密码

然后发现固件没有内置`ipkg`,通过[这篇文章][5]了解最新版本已经使用 opkg 代替[ipkg][6]了.

但是我使用`bootstrap`并不能自动安装`opkg`,提示`404`,所以得自己手动安装 opkg 了.

最后通过[这篇文章][7]得知通过安装[entware][8]可以安装`opkg`.

不过 Entware 默认的 package 是针对 CPU 是 Mips 架构,R6300V2 使用的[BCM4708A0][9]属于[ARM 架构][10].

最后通过[这篇文章][11]找到了针对 ARM 的包目录.

安装之前挂载 jffs 磁盘

    mkdir /jffs/opt
    mount -o bind /jffs/opt /opt

之后安装教程安装就可以了.

## 安装 ss

这个网上教程一大堆,基本大同小异,最全的应该是[这个][12].

ss 在 opkg 库里面自带,直接

`opkg install shadowsocks-libev`

然后启动 ss

    ss-redir -b 0.0.0.0 -l 1080 -s yourserverip -p yourserverport -k yourserverpassword -m aes-256-cfb -t 60 -f /var/run/ss-redir.pid
    ss-tunnel -b 0.0.0.0 -l 7777 -s yourserverip -p yourserverport -k yourserverpassword -m aes-256-cfb -t60  -L 8.8.8.8:53  -u

然后克隆这个代码库更新 dnsmasq 设置

`git clone git://github.com/felixonmars/dnsmasq-china-list`

我采用白名单模式,也即是只有国内的走国内的 dns,国外的全部走 ss,简单省事..

所以把里面的`accelerated-domains.china.conf` 扔到自己的 dnsmasq 配置目录`/jffs/etc/dnsmasq.d`

dd-wrt 里面的 dnsmasq 使用 conf 文件貌似手动改无效,所以我复制了一份然后自己修改了一下.

最后重启 dnsmasq

    killall dnsmasq
    dnsmasq --conf-file=/jffs/etc/dnsmasq.conf

最后一步更新 iptables,这个也是教程里面现成的.

几个问题

1.  ddwrt 每次在 web 界面修改之后都会清空 iptable,所以可以搞一个自动检测的,没做.
2.  dnsmasq 意外重启之后会使用默认配置,所以也可以搞一个自动检测,用自己的配置,依然没做.

然后就能访问互联网了..

## 配置环境

[1]: https://openwrt-hiwifi.github.io/ "OpenWrt for HiWifi"
[2]: https://www.dd-wrt.com/wiki/index.php/Netgear_R6300v2 "Netgear R6300v2 DDWrt刷机教程"
[3]: https://www.dd-wrt.com/phpBB2/viewtopic.php?t=177556 "Support for netgear R6300 / R6300v2"
[4]: http://www.desipro.de/ddwrt/K3-AC-Arm/ "R6300V2 DDWrt固件最新地址"
[5]: http://n3yang.com/archives/2014/10/30/%E8%A7%A3%E5%86%B3%E5%88%B7dd-wrt-kongac-build%E5%90%8E%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8ipkg-update/ "解决刷dd-wrt-kongac-build后无法使用ipkg-update"
[6]: https://home.tianxiaohui.com/index.php/2014/05/03/ipkg--opkg-%E4%B8%8E-openWRT.html "ipkg和opkg的区别"
[7]: http://www.right.com.cn/Forum/forum.php?mod=viewthread&action=printable&tid=159910 "6300V2 关于opkg安装 和软件"
[8]: https://github.com/Entware/entware "The Entware. A modern Optware replacement"
[9]: https://wikidevi.com/wiki/Netgear_R6300_v2 "Netgear_R6300_v2"
[10]: https://www.broadcom.com/products/Wireless-LAN/802.11-Wireless-LAN-Solutions/BCM4707-4708-4709 "BCM4707/4708/4709"
[11]: https://gist.github.com/dreamcat4/6e58639288c1a1716b85 "Quick install Entware on ARM devices"
[12]: https://www.gitbook.com/book/softwaredownload/openwrt-fanqiang/details "巴拉巴拉"
