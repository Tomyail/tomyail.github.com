---
title: Wordpress 数据迁移指南
id: 922
comment: true
categories:
  - 技术
date: 2011-10-18T23:07:42.000Z
tags: null
path: /wordpress-migration
---

0:清除本地 wp 的数据表，仅保留 wp-users 表及 wp-options 表

1:使用 wp-db-back 插件下载原始数据。

2:直接通过 phpmyadmin 往本地数据库中导入如果遇到 Duplicate entry 的错误时，根据错误提示所指示的内容删除之。

3:将备份 SQL 文件中和 wp-users 表及 wp-options 表有关的 表操作语句去掉，以免覆盖本地原有的

4:将文章中所有的域名替换成本地的，防止裂图

    UPDATE wp_posts SET post_content =replace(post_content,'tomyail.com/blog','localhost/wordpress');

5:进入网站后台下载所有图片放入本地

好吧，这文章不是指南，只是我的备忘.
