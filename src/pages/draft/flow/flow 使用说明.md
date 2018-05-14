# 安装 vscode 插件

https://github.com/flowtype/flow-for-vscode#setup

> 注意
 插件中说让我们关闭内置的 ts/js 语法支持,发现关了之后连基本的文件跳转功能都没有了.所以没有关. 

> 查看这个[帖子](https://github.com/Microsoft/vscode/issues/5214#issuecomment-304566827)知道需要在用户配置里面加入:

```
 "javascript.validate.enable": false,
```

这句话的意思参考:[What does javascript.validate.enable": false mean?](https://github.com/flowtype/flow-for-vscode/issues/27),看上去可能会丢失部分 js 的语法提示功能,但是实际发现工作良好    

https://github.com/Microsoft/vscode/issues/5214#issuecomment-304960386
