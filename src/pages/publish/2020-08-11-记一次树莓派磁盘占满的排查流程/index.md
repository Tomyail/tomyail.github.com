---
title: 记一次树莓派磁盘占满的排查流程
tags:
  - Unix-like
  - 技术
path: /troubleshooting-for-raspberry-pi's-out-of-disk-space/
created_at: 2020-08-11T09:34:43.853Z
updated_at: 2020-08-11T09:34:43.853Z
---

买来的树莓派积攒了一段时间灰之后想再次使用发现 vnc 连不上了,一直报远程关闭了连接. 下意识重启了一下,没解决...

但是发现 ssh 是可以登录了..懵逼之际顺手跑了一遍 `sudo apt-get`,报了一个磁盘空间已经满了的错误.吃惊.. 64 g 的 sd 卡居然被占满了...

google 了一下发现了查看磁盘占用的命令 `df -h`,果然 `/dev/root` 已用值是 100%,但是 dh 命令只能看出来每个磁盘的占用情况,我要看具体是哪个文件夹或者文件占用了太多容量怎么看?

继续 google 发现了 `ncdu`,这个命令需要额外安装,装好使用就可以他会扫描然后分别列出占用数最多的文件是哪些.

最后发现是`/var/log` 下面日志占用了太多的,其中`daemon.log` 占用了 22G,另外 `syslog`占用了还剩下的可用容量. vim 查看这些文件因为体积太大直接卡死.

继续 google ,告诉我使用`tail -n`来查看大文件的最后几行内容.

最后定位到原来是自己为 `sakurafrp` 写了一个`systemd`服务,但是`sakurafrp`server 做了一些升级导致旧的客户端连接时一直报错,报错日志会写入 daemon 和 syslog .写了一个月把磁盘写满了..

最后更新了 frp 客户端并且做了一些错误重启配置解决了问题.

顺便复习了一下`systemd`的相关命令使用:

- `sudo systemctl daemon-reload`:更新配置后需要调用此命令更新服务
- `/lib/systemd/system/`: 所有的服务配置写在这里
- `sudo systemctl status xxx`:用这个命令可以查看特定服务的运行状态
- systemd 的配置文件字段`Restart=on-failure`可以确保当服务异常推出时自动重启

另外为了避免这类问题重复发生,搜到了 linux 原来 systemd 自带一套日志管理命令`journalctl`:

- `sudo journalctl -u nginx.service`: 查看特定服务产生的日志
- `sudo journalctl --vacuum-size=1G`:将日志**总**大小上限设置为 1G
- `sudo journalctl --vacuum-time=1years`:自动删除所有一年前的老日志

## 总结:

这次问题让我学到了几个 linux 的技能:

1.  使用 `df` 命令 可以查看磁盘的基本占用情况
2.  使用 `ncdu`命令 可以查看具体每个文件占用率
3.  使用 `tail -n`,可以查看指定文件的最后几行的内容,尤其使用于大文件
4.  使用`journalctl` 可以方便的管理 systemd 产生的日志
5.  以后自己写代码,对待日志要严谨.确保日志不会疯狂输出导致占满了用户的磁盘空间,最后被用户码成了垃圾程序员..

资料:

- [linux 常用日志文件的作用](https://help.ubuntu.com/community/LinuxLogFiles)
- [Systemd 和 journalctl 的基本用法](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
- [linux journalctl 命令](https://www.cnblogs.com/sparkdev/p/8795141.html)
