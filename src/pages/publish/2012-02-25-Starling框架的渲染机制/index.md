---
title: Starling框架的渲染机制
tags:
  - 技术
  - Flash
id: 950
comment: false
path: /starling-render-system/
created_at: 2012-02-25T14:00:00.000Z
updated_at: 2012-02-25T14:00:00.000Z
---

Starling 框架（[UML 图](http://crocusmodeller.com/frameworks/starling.png)）是一个封装了 Stage3D 底层操作的 GPU 渲染框架，所以理解了其渲染机制也就能对 Stage3D 有一个初级的认识了。

实现 Stage3D 的类叫 Context3D。Stage3D 典型的基本工作流程分为三步，这个是 Context3D 的文档说明中是有的：

1.  通过调用  `configureBackBuffer()` 来配置主显示缓冲区属性。
2.  创建并初始化您的呈现资源，包括：
    - 定义场景几何的顶点和索引缓冲区
    - 用于呈现场景的顶点和像素程序（着色器）
    - 纹理
3.  呈现帧：
    - 为场景中的一个对象或一组对象设置适当的呈现状态。
    - 调用  `drawTriangles()` 方法可以呈现一组三角形。
    - 更改下一组对象的呈现状态。
    - 调用  `drawTriangles()` 可以绘制定义对象的三角形。
    - 重复直至场景全部呈现。
    - 调用  `present()` 方法可以在舞台上显示呈现的场景。

Starling 框架的渲染过程也是按照这个流程去做的，下面来进行逐步分解这个过程。

Starling 的包结构层次还是很清晰的，它的核心类全在 core 包下：

Starling.as:Starling 框架的主类，Starling 采用了 Facade 的设计模式，这个类负责统一管理整个渲染过程。

RenderSupport.as:这个类的作用就是负责坐标转换，将 Stage3D 的标准化坐标系统转换到 Flash 的窗口坐标系统以及操作 QuadBatch 进行具体的渲染行为。

QuadBatch.as:操作 Context3D 的直接类，这个类是整个渲染机制的核心。

下图展示了我对 Starling 渲染机制的理解（UML 不会，只能将就着看了。。。）：

![](./StarlingWorkflow.png 'StarlingWorkflow')

由此图可以了解，Starling 的渲染过程（render）就是管理顶点数据的过程。

QuadBatch 类的使用是 Starling 框架的一个亮点，他将所有顶点最后都统一到这个类里面来处理，这样的好处就是减少了其他子类反复调用渲染函数引起的性能下降，但是这样做的另一个坏处就是耦合度变高了，未来如果需要新的 shader，在这种结构下就需要修改或者增加 Quadatch 类，编写新的 agal 等。

为 Starling 拓展新的形状（比如三角形）最好让基类继承 Quad 类。

Starling 里面的 AGAL 代码还是比较简单的，如果想学习一些高级的，Nd2d 框架里面比较多。
