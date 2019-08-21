---
title: 使用Maven管理Flash项目
tags:
  - maven
id: 1197
categories:
  - 技术
date: 2014-01-18T17:38:02.000Z
path: /usin-maven-to-manage-flash-project/
---

* 问题:我平时很喜欢自己建一些小的 flash 工程,每当建立一个新工程的时候,总会需要一些第三方类库(swc).如何管理这些类库?

  * 建立一个公共的 swc 目录,然后所有的新建工程包含这个 swc 类库目录.

    * 缺点:

      1.  使用久了之后这个 swc 文件夹越来越乱,
      2.  会出现一些版本不同的相同类库.
      3.  发给别人时会忘了给别人这些类库

  * 为每个工程建立一个 lib 目录,然后按需要从 swc 目录中复制需要的类库

    * 缺点:

      1.  繁琐,每次都要建目录,复制文件.
      2.  浪费磁盘空间

后来了解到 Maven 这个工具似乎能解决我的这些不便,所以最近学了一下这个工具,感觉很不错.所以写篇博客记录下. 首先先参考这三篇文章对 Maven 在 flash 中开发有个初步印象:

* [在 Flexmojos 中结合使用 Flex 和 Maven – 第 1 部分：初期步骤](http://www.adobe.com/cn/devnet/flex/articles/flex-maven-flexmojos-pt1.html)
* [具有 Flexmojos 插件的 Flex 和 Maven—第二部分：学徒](http://www.adobe.com/cn/devnet/flex/articles/flex-maven-flexmojos-pt2.html)
* [具有 Flexmojos 插件的 Flex 和 Maven—第三部分：技工](http://www.adobe.com/cn/devnet/flex/articles/flex-maven-flexmojos-pt3.html)
* [Tutorial: Getting Started with Flex and Maven](http://ria.dzone.com/articles/flex-and-maven)

但是这几篇文章年代略久远,现在我的项目都是用 asc2.0 编译器来编译的,这几篇文章使用的 flex4.6 和 flexmojo4 满足不了我的需求,所以需要自行配置.

<!--more-->

### 准备工作

* [下载](http://maven.apache.org/download.cgi) [maven3.1.1](http://apache.fayea.com/apache-mirror/maven/maven-3/3.1.1/binaries/apache-maven-3.1.1-bin.zip)
* [下载](http://www.oracle.com/technetwork/cn/java/javase/downloads/jdk7-downloads-1880260-zhs.html) [JDK7](http://download.oracle.com/otn-pub/java/jdk/7u15-b03/jdk-7u15-windows-i586.exe)

### 配置环境

* 解压 maven 到一个目录下,比如:H:\\tools\\apache-maven-3.1.1
* 安装 jdk,比如我的位置:G:\\Program Files (x86)\\Java\\jdk1.7.0_15
* 新增如下几个环境变量(必须,maven 需要)

      	* 变量:JAVA_HOME,值:G:\Program Files (x86)\Java\jdk1.7.0_15
      	* 变量:JAVA_BIN,值:G:\Program Files (x86)\Java\jdk1.7.0_15\bin
      	* 变量:M2_HOME,值:H:\tools\apache-maven-3.1.1
      	* 变量:M2,值: %M2_HOME%\bin

* 将上述%JAVA_BIN%;%M2%添加到变量 PATH 后面
* 打开命令行(cmd),输入"java -version"和"mvn -version",如果未出错,说明 java 和 maven 安装成功.
* 修改仓库位置

      	* 默认情况下maven会在第一次运行mvn命令时在 C:\Users\<username>下面生成一个.m2目录,这个目录下面的repository目录用来存放所有类库,但是这个路径是可以修改的.
      	* 将maven的安装目录下的settings.xml(H:\tools\apache-maven-3.1.1\conf\settings.xml)往 C:\Users\<username>\.m2\复制一份.前者作为maven的全局设置,后者是用户设置,maven会在运行时合并这两个setting的设置,优先级:项目级setting(maven项目下的setting)>用户级setting>全局setting.

* 打开用户 setting,在 settings 下面新增"<localRepository>H:\\maven_repository</localRepository>",意思是说将 H:\\maven_repository 作为 maven 的类库存储位置.

### 安装 air sdk

maven 的工作方式是我们在 pom.xml 里面定义一个类库,maven 首先去[中心仓库](http://search.maven.org/)和[Nexus](https://repository.sonatype.org/index.html)中找,找不到再去我们自定义的仓库中找,都找不到就报错.在[nexus](http://repository.sonatype.org/content/groups/flexgroup/com/adobe/flex/compiler/)仓库中只能找到 flex4.6.这个版本相当的古老.最新版的 sdk 已经开始使用 asc2.0 了,adobe 没有上传最新版,所以我们需要自己生成最新版 sdk.

* 下载 flex sdk([apache](http://flex.apache.org/installer.html)的或这[adobe](http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/)的都行)
* [下载 air sdk](http://helpx.adobe.com/air/kb/archived-air-sdk-version.html)
* 检出 mavenizer,这个工具用来将 flash sdk 转换成 maven 可用的类库([git](https://git-wip-us.apache.org/repos/asf/flex-utilities.git),[svn](https://svn.apache.org/repos/asf/flex/utilities/trunk/mavenizer/))
* mavenizer 下载好后在 mavenizer 目录下运行"mvn package",之后会在 target 子目录生成一个 flex-sdk-converter-1.0.jar,将这个 jar 复制到一个目录下(H:\\tools)
* 在 H:\\tools 新建一个文件夹(H:\\tools\\sdkhome),并在其子目录新建一个 air 和一个 flex 目录,将下好的 air sdk 复制到 air 目录,下好的 flex sdk 复制到 flex 目录.最后他们的目录结构应该类似如下:

  <pre>sdkhome
sdkhome/air/
sdkhome/air/{air-sdk-dir-1}
sdkhome/air/{air-sdk-dir-2}
sdkhome/air/{air-sdk-dir-3}
sdkhome/flex/
sdkhome/flex/{flex-sdk-dir-1}
sdkhome/flex/{flex-sdk-dir-2}
sdkhome/flex/{flex-sdk-dir-3}
sdkhome/flex/{flex-sdk-dir-4}
({air-sdk-dir-1}和flex-sdk-dir-4}表示目录名任意)</pre>

* 新建一个输出目录,比如我是 H:\\tools\\fdktarget
* 现在在 tool 目录下运行如下命令

  <pre>java -cp flex-sdk-converter-1.0.jar SDKGenerator sdkhome fdktarget false
//最后一个参数false表示将apache转换成adobe的包名.否则不转换.</pre>

* 不出意外的话会在 fdktarget 目录生成一个文件夹 com
* 将这个 com 文件夹复制到 maven 仓库就好了

#### 参考资料:

* [mavenizer's README](https://svn.apache.org/repos/asf/flex/utilities/trunk/mavenizer/README.txt)
* [Apache Flex SDK Mavenizer](https://cwiki.apache.org/confluence/display/FLEX/Apache+Flex+SDK+Mavenizer)

### 使用 Flexmojos 6.x

maven 的绝大多数任务都是由插件定义的,flexmojo 就是专门为 flash 开发的 maven 插件.根据[flexmojo 官网](https://flexmojos.atlassian.net/wiki/display/FLEXMOJOS/Home)的介绍,此插件的最新稳定版是 6.x,但是网上能找到的绝大多数介绍都是停留在 4.x.很多信息已经不准确了. 使用 mvn archetype:generate 可以快速生成项目模板,所以在命令行下输入

<pre>mvn archetype:generate -DarchetypeGroupId=net.flexmojos.oss -DarchetypeArtifactId=flexmojos-archetypes-library -DarchetypeVersion=6.0.1</pre>

之后输入你的 groupId,artifactId 和 version 就能生成一个空的 flash 库项目模板. 注意:4.x 以下的 flexmojo groupId 是 org.sonatype.flexmojos, 5.x 以后的是 net.flexmojos.oss. 之后参考这篇文章修改 pom.xml,选择使用 flex sdk 还是 air sdk 以及具体的版本.我是用的是 3.9 的编译器,所以这个便是我的 pom:

    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>

        <groupId>untitled</groupId>
        <artifactId>untitled</artifactId>
        <version>1.0-SNAPSHOT</version>
        <!--swf or swc -->
        <packaging>swf</packaging>

        <properties>
            <air.version>3.9</air.version>
            <player.version>11.1</player.version>
            <playerglobal.version>11.9</playerglobal.version>
            <flexmojos.version>6.0.1</flexmojos.version>
        </properties>

        <build>
            <!--attention-->
            <sourceDirectory>src</sourceDirectory>
            <plugins>
                <plugin>
                    <groupId>net.flexmojos.oss</groupId>
                    <artifactId>flexmojos-maven-plugin</artifactId>
                    <version>${flexmojos.version}</version>
                    <!--import-->
                    <extensions>true</extensions>
                    <dependencies>
                        <!--use asc 2.0-->
                        <dependency>
                            <groupId>com.adobe.air</groupId>
                            <artifactId>compiler</artifactId>
                            <version>${air.version}</version>
                            <type>pom</type>
                        </dependency>
                    </dependencies>
                </plugin>
            </plugins>
        </build>

        <dependencies>
            <!--use asc 2.0-->
            <dependency>
                <groupId>com.adobe.air.framework</groupId>
                <artifactId>common-framework</artifactId>
                <version>${air.version}</version>
                <type>pom</type>
            </dependency>
            <dependency>
                <groupId>com.adobe.flash.framework</groupId>
                <artifactId>playerglobal</artifactId>
                <version>${playerglobal.version}</version>
                <type>swc</type>
            </dependency>
        </dependencies>

        <!-- Repository and PluginRepository section for Flex SDK and compiler dependencies.
             Note: instead of including this in every POM, you can append it to your user (~/.m2/settings.xml) or global
                (M2_HOME/conf/settings.xml) settings file.
          -->
        <repositories>
            <repository>
                <id>flex-mojos-repository</id>
                <url>http://repository.sonatype.org/content/groups/flexgroup</url>
            </repository>
        </repositories>

        <pluginRepositories>
            <pluginRepository>
                <id>flex-mojos-plugin-repository</id>
                <url>http://repository.sonatype.org/content/groups/flexgroup</url>
            </pluginRepository>
        </pluginRepositories>

    </project>

关于 flexmojo 还有很多有趣的功能,但是官方文档还是比较全的,可以慢慢研究.   参考资料:

* [Migrating to 6.x](https://flexmojos.atlassian.net/wiki/display/FLEXMOJOS/Migrating+to+6.x)
* [Getting started](https://flexmojos.atlassian.net/wiki/display/FLEXMOJOS/Getting+started)

### 使用 github 托管 maven 仓库

将 maven 发布到 github 有两种思路,第一种是先利用 deploy 命令将工程部署到本地 git 仓库.然后手动 push 到 github 上.第二种是利用 github 提供的[maven-plugins](https://github.com/github/maven-plugins)在调用 deploy 时直接上传.

* 针对第三方的 swc 类库,使用第一种比较方便,比如我想将 as3corelib 添加到自己的 maven 仓库,使用命令行

  <pre>mvn deploy:deploy-file -Dfile=as3corelib-0.93.swc -DgroupId=com.adobe -DartifactId=as3corelib -Dversion=0.93 -Dpackaging=swc -Durl=file:///H:/mvn_temp/</pre>

  可以先将其部署到本地的 git 仓库 mvn_temp,然后 push 到 github.

* 如果是个工程,用第一种方法可参考这篇文章[Use github as maven remote repository](http://blog.rueedlinger.ch/2012/09/use-github-as-maven-remote-repository/)
* 想直接发布到 github 上,可参考此文章[Hosting a Maven repository on github](http://stackoverflow.com/questions/14013644/hosting-a-maven-repository-on-github)

需要注意的是上述文档使用的 maven-plugins 是 0.8 版本在 maven3.1.1 中会有问题,请使用 0.9 版本.\__这个插件似乎需要 github 上的 git 仓库是一个 github page,否则上传会失败_

* 利用上述方法,这是我搭建的 github [maven 仓库](https://github.com/Tomyail/tomyail.github.com/tree/mvn-repo).
* 在别的项目中使用这个仓库,只需要在 repositorys 节点下增加

      	```
      	<repository>
      	<id>tomyail-repo</id>
      	<url>https://raw.github.com/Tomyail/tomyail.github.com/mvn-repo/</url>
      	</repository>
      	```

#### 参考资料:

* [Maven 实战](http://www.juvenxu.com/mvn-in-action/)
