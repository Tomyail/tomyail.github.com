
# 什么是 tree-shaking,它的作用是什么 ?

发生在编译期间的行为,去除无效代码,降低 bundle size

## 举个例子

todo

# 为什么 tree-shaking 能工作的前提代码必须是 es6 module ?

1. commomjs 的模块加载是动态的,他可以 *运行时* 改变,tree-shaking 发生在* 编译期* ,所以不能预判这部分代码.
2. es6的模块是[静态的](http://exploringjs.com/es6/ch_modules.html#static-module-structure),模块的导入导出不能包含任何条件.也就是说,导入导出什么模块在编译期间就能运算出来.




# 为什么我用了 es6的语法感觉 tree-shaking 依然没卵用?

https://zhuanlan.zhihu.com/p/32831172
https://gist.github.com/JamieMason/a6ea268f32f578ba1c2c89ac7d4265eb
https://blog.craftlab.hu/how-to-do-proper-tree-shaking-in-webpack-2-e27852af8b21
https://stackoverflow.com/questions/47663486/webpack-3-babel-and-tree-shaking-not-working 可以通过用 babel-env
https://github.com/babel/babel-loader/issues/521

1. 你应该用了 babel,babel 引入了副作用,副作用导致了 ts 不能很好的工作

webpack+babel 编译的流程是:


![webpack 流程](2018-04-04-09-05-00.png)

![](2018-04-04-09-05-54.png)
![](2018-04-04-09-06-27.png)
```
es6源码 -> babel(es5) -> webpack(tree-shaking);
```

事实上从 es6编程 es5的时候, babel 将语法转成了 commomjs. commomjs 对树震支持度不好

#参考

1. http://2ality.com/2015/12/webpack-tree-shaking.html

