---
title: eslint的正确使用方式
tags:
  - 技术
  - JavaScript
date: 2017-05-09T23:24:44.000Z
path: /eslint-with-prettier/
---

最近项目里面来了新人，他对项目的代码风格提出了质疑，于是乎之前被遗忘的 eslint 又被提上了议程。

eslint 是一个代码质量检查工具，它能根据特定的规则检查已知的项目代码是否符合规范。

之前项目没有推广开的主要原因是没有合适的工作流程，没有一个独立的环节保证所有的代码都是被 lint 过的。

今天才发现可以结合 git 钩子在提交的时候直接 lint 代码，有了这一步基本上就能保证 lint 的环节不被错过。

后来看了一下最近比较热的 js 代码格式化项目[prettier](https://github.com/prettier/prettier),里面正好有针对 git 钩子做的处理。

最后总结下如何使用：

1.  安装依赖库

`yarn install lint-staged husky prettier --dev`

2.  更新 package.json

    {
    "scripts": {
    "precommit": "lint-staged"
    },
    "lint-staged": {
    "\*.{js,jsx}": \[
    "prettier --write --single-quote",
    "eslint --fix",
    "git add"
    ]
    }
    }

最后的效果就是在每次 commit 之前，都会格式化代码并且 eslint 被提交的代码保证风格统一。
