---
title: 从Wordpress迁移到Hexo
tags:
  - 技术
path: /hexo-migrate/
created_at: 2015-11-04T14:20:29.000Z
updated_at: 2015-11-04T14:20:29.000Z
---

# 起因

好久没更新博客了,一方面因为以前把这个博客的定位定的太狭隘了,觉得非技术类博客不能写;另一方面老的那套发布流程不太方便:

1.  我需要把想法记录到 evernote
2.  把整理好的 evernote 粘贴到[windows liver writer](https://www.microsoft.com/zh-cn/download/details.aspx?id=8621)
3.  整理图片和文章排版,然后通过 windows liver writer 发布.

这套流程无法让我集中注意力在文章本身的编写上,因为:

1.  我记录文章的原始位置在 evernote.而 evernote 的排版能力太弱,我希望使用 markdown 来编辑文本.这样写完文本之后不用重新编辑格式.
2.  发布涉及到 windows liver writer,目前这个软件只有 windows 版本.而我的工作流已经渐渐向 mac 倾斜.mac 的替换 app 都不太满意.

所以我老早前其实就打算迁移博客了,觉得静态博客系统不错,只不过那个时候主流的都是基于 ruby 的,比如[Octopress](http://octopress.org/).用了一阵子始终无法适应,应该和我不熟悉 ruby 的那套依赖系统有关.

后来发现了[Hexo](http://hexo.io),这是一个基于 nodejs 的静态博客系统,本人对 nodejs 的熟悉度比 ruby 高,而且作者还是位中国人,所以认为上手应该很容易就试了一下.

然后我的博客系统就变成基于 Hexo 的了...

<!--more-->

# 迁移

## 导出 wordpress 数据

去自己的 Wordpress 下载一个叫做'Export to Jekyll'的插件,装好之后在`Tools`面板选择`Export to Jekyll`,然后就能下到一个包含图片和 markdown 格式的老文章内容的 zip 文件`jekyll-export.zip`.

## 导入到 Hexo

这个过程比较纠结,不过总体来说还算顺利

### 导入文章

首先解压 jekyll-export,`_post`文件夹里面就是我们转换好后的文章了,不过我发现好多文章的文件名都是乱码.这里我用手动的办法人肉把那些乱码的文件重新命名了一下.

然后把整个`_post`复制到 hexo 的`source`目录下,不出意外的话应该能在本地预览了.

然后就出意外了.

`JS-YAML: can not read a block mapping entry; a multiline key may not be an implicit key at line 2, column 5:`

报了这种错误,应该是某篇文章的 markdown 不符合转换要求吧.

只能通过二分查找法找哪篇文章出问题了,最后定位到了问题,原来是是某些包含代码的文章里面包含了`{ {`(没有空格,但是为了解析不出错,加了空格)这种符号,坑啊!

### 更新图片

老的文章,里面的链接都是和老域名(tomyail.com/blog)绑定的,本来我也打算把新的博客直接放在这个域名下,但发现 Hexo 使用二级目录域名图片的链接会有问题.

而且这次的修改涉及到的变化太大,新文章将使用文章英文标题作为链接名,而老的文章使用的时文章 ID,这个迁移有点麻烦.所以索性使用了一个新的域名(blog.tomyail.com)搭配新博客.

针对图片更新的确实有一个 Hexo 插件,不过感觉不太好用,所以还是老老实实使用搜索+替换的方式解决的.感谢万能的 WebStorm

具体做法就是把`jekyll-export`里面的`wp-content`重命名成`images`(当然不重命名也无所谓),然后复制到`source`目录.

利用 IDE 的全局搜索+替换的功能,搜索`_post`目录,将里面的`tomyail.com/blog/wp-content`替换成了`/images`就能更新图片链接了.

这里加`..`是因为 Markdown 编辑器 Mou 不识别去掉后的图片路径,所以就加了.

**更新** 加了`..`在首页预览有问题！所以去除了`..`

#### 使用资源文件夹

针对历史遗留文章,上面的方法基本够用了,但是对于新的文章,我打算使用新的图片路径结构.

老的资源管理格式,图片和文章使用了两个并列的目录结构,就像这个样子.

    ├── source
    │   ├── _drafts
    │   │   ├── elasticsearch.md
    │   │   ├── js-native-app.md
    │   │   └── shadowsocks-on-netgear-R6300-v2.md
    │   ├── _posts
    │   │   ├── alpha-error.md
    │   │   ├── as2-class-question.md
    │   │   ├── assess-test.md
    │   ├── images
    │   │   ├── default_avatar.jpg
    │   │   └── uploads
    │   │       └── default_avatar.jpg

所以如果在 Mou 里面引用图片,需要加上`..`返回父目录,但用了`..`会出现首页显示问题.

所以引入了[资源文件夹](https://hexo.io/zh-cn/docs/asset-folders.html)的方式.

关于资源文件夹比较好的文章是这一篇:[Use Hexo Asset Folder to manage resource used by post](http://timnew.me/blog/2014/08/19/use-hexo-asset-folder-to-manage-resource-used-by-post/)

使用了之后图片和文章就在同级了,既方便 Mou 的编辑,也防止 Hexo 渲染出错.

至于 md 里面具体怎么引用,下面两种方式都是可以的:

    ![test](/assess-test/default_avatar.jpg)
    {% asset_img default_avatar.jpg test %}

我更倾向前者,虽然麻烦,但是是标准的 markdown 写法,不用 hexo 处理也能在别的地方显示.

这是使用资源文件夹方式后的文件夹路径

    ├── source
    │   ├── _drafts
    │   │   ├── elasticsearch.md
    │   │   ├── js-native-app.md
    │   │   └── shadowsocks-on-netgear-R6300-v2.md
    │   ├── _posts
    │   │   ├── alpha-error.md
    │   │   ├── as2-class-question.md
    │   │   ├── assess-test
    │   │   │   └── default_avatar.jpg
    │   │   ├── assess-test.md
    │   ├── images
    │   │   ├── default_avatar.jpg
    │   │   └── uploads
    │   │       └── default_avatar.jpg

### 更新配置

改了下 permalink 的格式,去掉日期前缀, 一是让链接变短了,而是觉得去掉了日期就不容易看出哪些文章比较新哪些文章比较老了,哈哈哈哈~~

### 更新主题

#### 全文输出

主题提供自定按照字数摘录的功能,不过用了下发现排版太丑了,而且每篇文章只显示一点略小气.所以就用了全文输出,尽管这样导致首页加载的时间变长了,不过觉得内容好多有木有!!

至于以后文章的编写,我会考虑手动插入`<!--more-->`标签来达到提供文章摘要的功能.

#### rss

安装[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)并按说明配置就好了.

不过因为换了新域名,老的订阅源就不能用了,我也没有用 rss 烧录的功能,因为 FeedBurner 在国内不稳定.

#### 设置图片最大尺寸

参考[突破容器限制宽度的图片](http://theme-next.iissnan.com/tag-plugins.html)

#### 嵌入 swf

原来的 wordpress 使用了插件嵌入 swf,搜了下可以用

`<embed src="/images/uploads/2013/03/InteractionDemoB.swf" width="500" height="380">`

这种方式替代,那就先用着吧.

### 更新评论

之前使用的是 disqus 评论系统,发现推荐文章还会连接到老文章的 url 里面.

这个折腾死我了,虽然之前的评论不多,但是还是得迁移过来,不然博客看上去多冷清~~~

由于这次的链接变化比较大,需要使用批量迁移,参考[url-mapper](https://help.disqus.com/customer/en/portal/articles/912757-url-mapper)

具体做法大概就是下载 csv 文件,然后逐个编辑需要变动的文件,完成后重新上传到 disqus,之后会提示等待 24 小时.

### 301 重定向

接下来就是把老域名下面的博客全部倒到新域名上了.需要用到 301 重定向,我的空间基于 Apache,所以需要修改`.htaccess`文件

两个重定向规则:

1.  `http://tomyail.com/blog/` 重定向到 `http://blog.tomyail.com/`
2.  针对一些特定的文章,跳转到特定的 url 上面.比如`http://tomyail.com/blog/935/`跳转到`http://blog.tomyail.com/learning-git-via-eclipse/`

需要修改两个地方的`.htaccess`文件,第一个是老的`wordpress`,新增如下记录:

```nginx
<IfModule mod_rewrite.c>
RewriteEngine On
redirect 301 /blog http://blog.tomyail.com
</IfModule>
```

第二个是新的博客路径下面,为 htaccess 新增如下记录:

```nginx
<IfModule mod_rewrite.c>
RewriteEngine On
redirect 301 /935 http://blog.tomyail.com/learning-git-via-eclipse/
</IfModule>
```

### 发布

使用 ftp 或者 rsync 发布都是可以的,我优先选择了 rsync.

具体参考了 hexo 的[文档](https://hexo.io/zh-cn/docs/deployment.html#Rsync)

为了不用每次同步都输入密码,需要配置 ssh 免登陆,谷歌 ssh 免密码一大堆教程.

### 一些问题和技巧

1.  运行`hexo new`的时候不能指定其 tag,categories 之类的数据,而且 title 基本要修改一次.因为文件名需要作为 url 的 title,而 title 作为文章的标题,这两个默认使用同一变量
2.  修改`scaffolds`文件夹下的文件能修改 hexo 产生出来的文件模板.
3.  通过`hexo s --draft`能直接预览草稿的内容

# 结语

用了几天下来总体感觉还是可以的,配合 WebStorm 以及 Mou 基本够用了

# 参考链接

1.  [Hexo 官网](hexo.io/zh-cn)
2.  [Next 主题使用手册](http://theme-next.iissnan.com/)
