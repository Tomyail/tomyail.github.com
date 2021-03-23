---
title: 使用 git submodule 同步主从项目的依赖关系
tags:
  - 技术
  - Git
path: /using-git-submodule-lock-project/
created_at: 2017-06-13T22:48:28.000Z
updated_at: 2017-06-13T22:48:28.000Z
---

## 问题:

项目 A 是主项目,项目 B 是资源项目, A 项目需要时刻保持引用的 B 资源是最新的,同时,针对 A 项目的提交历史,有能力还原到特定的 commit, 并且保持那一次 commit 对应的 B 资源也是对应的版本快照.

A 是主项目, B 是从属项目, A 项目单纯引用着 B 资源,不需要对 B 里面的资源做修改,所以使用 git submodule 基本上能解决上述问题.

第一次配置需要使用

```bash
git submodule add {url} [name]
```

成功之后会拉取项目并且生成 submodule 的配置文件 `.gitmodules`

## 同步项目

1.  (命令 1)使用`git submodule update --init --recursive`会自动让从属项目更新到主项目依赖的版本,
2.  (命令 2)使用`git submodule update --init --recursive --remote`会让从属项目更新到它自己的最新远程 master\* 分支.

这两者什么区别?

如下表所示,A 项目产生了两次提交 A1,A2,分别引用着 B 项目的 B1,B2 提交.

    A1 -> A2
    B1 -> B2

如果 A 项目需要从 A2 切换回 A1,对应的从属项目不会自动更新,所以那个从属项目还是引用着 B2.我们需要运行命令 1 使从属项目 B 重新指向 B1.

那命令 2 什么用? 假设上述 A2 引用着 B2,但是 B2 的远程分支其实指向了 B3,这个时候我们如果想更新 B 项目的引用到 B3,要么手动 cd 到 B2 项目里面,然后运行 pull 拉取最新分支.要么直接运行上述 2 命令,他们的效果是一样的.

## 结论

1.  针对单纯的更新,比如 ci 自动编译,切换分支后,需要使用命令 1 保持 submodule 指向正确的引用.
2.  当需要更新子模块到最新特性时,使用命令 2 同步.
