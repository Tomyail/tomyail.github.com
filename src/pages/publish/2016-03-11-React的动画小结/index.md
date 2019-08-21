---
title: React的动画小结
categories:
  - 技术
tags:
  - js
  - react
date: 2016-03-10T22:15:59.000Z
path: /react-animation/
---

在搞 Ember 开发时，简单的做过一些 CSS 动画，主要参考了这篇文章。[CSS 简介](http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html)。当时动画切换的基本思路定义几个`animation`，每个`animation`和一个`css`的`class`绑定，改变动画就是改变当前`div`的`class`。但是这个方法在 React 里面似乎不起作用，尝试在 Chrome 里面直接修改 React 渲染好的 dom 的 class，也没有效果，目前还不知道原因。

查了一下 React 官网的[动画文档](https://facebook.github.io/react/docs/animation.html)，其中的`ReactCSSTransitionGroup`是 React 推荐我们使用的动画组件。这个动画组件基于 React 组件的生命周期，也就是说我们需要在 CSS 文件里面定义一大堆以组件生命周期作为后缀的样式名称，组件会在其执行到不同的动画阶段调用不同的 css 样式。动画的生命周期分为`enter`，`enterActive`，`appear`，`appearActive`，`leave`，`leaveActive`。假设我们的动画名字叫 anim，那么对应的 css 名字就需要有如`anim-enter`，`anim-enter-active`之类的。而且还需要在代码中显式的指定 css 动画时间。

React 提供的动画组件功能很简单，对动画的动态控制基本不支持，比如让动画倒着播一遍之类的。好处就是动画代码的维护成本比较低，都是一些 css（动画时间在 css 里面和代码里面要一致这个问题有点坑）文件。

然后看到了[Velocity.js](http://julian.com/research/velocity/),这是一个基于 js 的动画库，搜了一下，发现这个库有 react 版本[velocity-react](https://www.npmjs.com/package/velocity-react)。用了一下，发现功能还是非常强大的。它内置了一系列的动画预设，如果我们需要自己定义动画，需要自定义一个动画对象，比如下面这样的：

```js
var ToolbarAnimation = {
  up: velocityHelpers.registerEffect({
    defaultDuration: 500,
    calls: [[{ top: "-60px" }, 1]]
  }),
  down: velocityHelpers.registerEffect({
    defaultDuration: 500,
    calls: [[{ top: 0 }, 1]]
  })
};
```

这个库的具体用法就不说了，库自带例子。通过这个库，我们动画的定义从 css 变到了 js 里面，增加了对动画细节的控制力度，当然，代码维护量可能变大了。velocity 也为我们提供了一个和`ReactCSSTransitionGroup`功能类似的库`VelocityTransitionGroup`。`VelocityTransitionGroup`和`VelocityComponent`的区别在于前者多了几个钩子函数，用来控制组件生命周期内，比如创建时，销毁时的动画行为。`VelocityComponent`组件让我们能最大化的定义组件出现后本身的动画行为。

注意：使用`VelocityTransitionGroup`动画的时候，请按照`ReactCSSTransitionGroup`文档的要求给子对象加上 key，否则动画切换可能失效。

```js
return (
  <VelocityTransitionGroup
    component="div"
    enter={{ animation: FadeAnimation.in }}
    leave={{ animation: FadeAnimation.out }}
  >
    {this.state.view === "userList"
      ? this.renderUserList()
      : this.renderLogin()}
  </VelocityTransitionGroup>
);
```

上述代码需要给`this.renderUserList`和`this.renderLogin`对应的根节点加上`key`属性。

上述代码中，有一段时间 userlist 在淡出，login 在淡入，也就说会同时出现两个界面，这个时候需要确保它们的动画容器使用正确的布局方式（通常是绝对布局）来达到重叠两个界面的效果。否则这段时间界面会根据 css 排版规则发生抖动。
