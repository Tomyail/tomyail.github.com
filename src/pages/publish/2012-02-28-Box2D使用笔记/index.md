---
title: Box2D使用笔记
tags:
  - 技术
  - Flash
id: 954
comment: false
path: /box2d-usage/
created_at: 2012-02-27T20:13:34.000Z
updated_at: 2012-02-27T20:13:34.000Z
---

感谢这篇[Box2D 入门介绍](http://blog.allanbishop.com/box2d-2-1a-tutorial-part-1/)，此博客有关于 Box2D 的一系列文章，值得关注。背景：Box2D 是一个非常著名并且广泛使用的 2D 物理引擎，最初版本的 Box2D 是 C++写的，作者是暴雪的首席软件工程师  Erin Catto。后来被[BorisTheBrave](http://personal.boristhebrave.com/category/platform/box2d)童鞋移植到了 Flash 平台才有了 as3 版本。如果嫌 as3 版本的太慢可以使用  [Jesse Sternberg](http://www.sideroller.com/wck/)使用炼金术（Alchemy）编译出来的 swc，另外他还开发了一个 WCK 框架让 Box2D 对象可以通过 Flash IDE 以可视化的方式创建排列，gotoandlearn 网站上有一个具体的[结合 WCK 的 BOX2D](http://gotoandlearn.com/play.php?id=135)[视频](http://gotoandlearn.com/play.php?id=135)[教程](http://gotoandlearn.com/play.php?id=135)。由于以熟悉 Box2D 框架为主，所以我使用 as3 版本的 Box2D。Box2D 的最新[官方文档](http://127.0.0.1/wordpress/wp-admin/www.box2d.org/manual.html)，稍微过时一点的[中文文档](http://directguo.com/blog/wp-content/uploads/2010/05/box2d_manual_cn.pdf)，文档是针对 C++版本的 Box2D，请做好心理准备。。。

刚接触 Box2D 时，我们需要接触其中的几个基本概念

- 形状（Shape）：2D 几何结构，比如多边形或圆形
- 刚体（rigid body）：可以想象成坚硬的墙
- 粘物（fixture）：粘物绑定一个形状并将自己粘到刚体上，粘物还能给形状指定一些物理属性如密度，摩擦系数。
- 世界（world）：世界将上述所有对象结合起来，可以创建多个世界实例，但通常没那个必要。这几个概念之间的联系可以简单的说就是世界管理着刚体，刚体有特定的形状定义，并通过粘物赋给刚体。

<span style="text-decoration: underline;">**_以下涉及到 fixture 的说明都可能指 fixtureDef_**</span>

先上一段最简单的代码：

```actionscript
package
{
    import Box2D.Collision.Shapes.b2PolygonShape;
    import Box2D.Common.Math.b2Vec2;
    import Box2D.Dynamics.b2Body;
    import Box2D.Dynamics.b2BodyDef;
    import Box2D.Dynamics.b2DebugDraw;
    import Box2D.Dynamics.b2FixtureDef;
    import Box2D.Dynamics.b2World;

    import flash.display.Sprite;
    import flash.display.StageScaleMode;
    import flash.events.Event;

    [SWF(backgroundColor="0x333333",width="800",height="600",frameRate="30")]
    public class Simple extends Sprite
    {
        private const PIXELS_TO_METRE:int = 50;
        private var _world:b2World;
        public function Simple()
        {
            stage.scaleMode = StageScaleMode.NO_SCALE;

            //定义重力向量
            var gravity:b2Vec2 = new b2Vec2(0,10);
            //实例化世界（接受两个参数重力向量和当物体停止移动时是否允许物体休眠，一个休眠中的物体不需要任何模拟）
            _world = new b2World(gravity,true);

            //实例化刚体定义数据
            var groundBodyDef:b2BodyDef= new b2BodyDef();
            //设置刚体的初始坐标在1，1米处
            groundBodyDef.position.Set(1,1);
//            groundBodyDef.type = b2Body.b2_dynamicBody;

            //实例化一个刚体（将刚体定义数据交给世界能自动创建刚体）
            var groundBody:b2Body = _world.CreateBody(groundBodyDef);

            //实例化刚体的形状
            var groundBox:b2PolygonShape = new b2PolygonShape();
            //将形状定义成2X2的方形
            groundBox.SetAsBox(1,1);

            //实例化粘物
            var groundFixtureDef:b2FixtureDef = new b2FixtureDef();
            //粘上形状。。。
            groundFixtureDef.shape = groundBox;
            //让刚体表现出粘物绑定形状的形状
            groundBody.CreateFixture(groundFixtureDef);

            /**
            * 以上的工作只是定义好必要的数据，但还是需要下面相关的代码来渲染出来
            * 绘图相关
            */
            var debugSprite:Sprite = new Sprite();
            addChild(debugSprite);
            var debugDraw:b2DebugDraw = new b2DebugDraw();
            debugDraw.SetSprite(debugSprite);
            debugDraw.SetLineThickness( 1.0);
            debugDraw.SetAlpha(1);
            debugDraw.SetFillAlpha(0.4);
            //设置缩放量
            debugDraw.SetDrawScale(PIXELS_TO_METRE);
            //设置绘图模式
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
            _world.SetDebugDraw(debugDraw);

            _world.DrawDebugData();
        }
    }
}
```

好吧，Box2D 的代码真够磨叽的，这是我使用 box2D 的第一感觉。。。

上述代码只是在 Box2D 环境中创建一个蠢蠢欲动的小方块而已，先说些注意点。

1:b2Vec，b2World，b2BodyDef，b2Body，b2PolygonShape，b2FixtureDef 这几个类的关系（好个性的类命名。。）

- b2Vec 用来设置这几个类中的向量数据，所以它是被公用的。
- b2World 通过 b2BodyDef 类的定义创建 b2Body
  b2FixtureDef 绑定 b2PolygonShape 类并将自己传给 b2Body

它们之间的关系(貌似)如下图：world 通过 bodyDef 在自己肚子里创建 body，body 肚子里有 fixture，fixture 肚子里有 shape..

[![](./Box2d.png 'Box2d')](/images/uploads/2012/02/Box2d.png)

2：Box2D 的中心点（还是注册点?）在物体的中心

3：关于 Box2D 的单位采用[MKS](http://en.wikipedia.org/wiki/MKS_system_of_units)(米/千克/秒）计量单位系统，所以上述代码中

<pre>groundBox.SetAsBox(1,1);</pre>

这句话的意思表示创建一个盒子，它的**宽半径和长半径**都是 1 米，注意是半径。由于中心点在物体的中心，所以盒子的实际大小长宽都是 2 米。那么 1 米是多少像素呢？这个随便你定，我在程序中的定义是 50 像素 1 米

<pre>private const PIXELS_TO_METRE:int = 50;</pre>

通过这个段小代码知道了如何在 Box2D 环境中创建对象了，但是如果想让物体运动起来就需要监听帧刷新并在帧刷新中调用 b2World 的 step 方法。需要注意的是 Step 的三个参数，重点介绍第一个：时间增量。首先需要了解的一点是帧刷新中的函数会在每次帧刷新时被调用，假设此时的帧刷新频率是 30，那么帧刷新函数每 1/30 秒执行依次。为了让 Box2D 里面的时间增量和帧频率保持一种，Step 计算的都是距离当前时间 1/30 秒之后的距离，这个 1/30 也就是 step 里面的第一个参数。至于第 2，3 个参数是关于几个约束对象之间的关系，这里可以不理，按照文档的要求速度迭代量为 8，方位迭代量为 3 最好。

还有让需要的运动的对象的定义类型的类型设置为

<pre>groundBodyDef.type = b2Body.b2_dynamicBody;</pre>

才能让其运动

所以最后能运动的代码如下：

<pre>package
{
    import Box2D.Collision.Shapes.b2PolygonShape;
    import Box2D.Common.Math.b2Vec2;
    import Box2D.Dynamics.b2Body;
    import Box2D.Dynamics.b2BodyDef;
    import Box2D.Dynamics.b2DebugDraw;
    import Box2D.Dynamics.b2FixtureDef;
    import Box2D.Dynamics.b2World;

    import flash.display.Sprite;
    import flash.display.StageScaleMode;
    import flash.events.Event;

    [SWF(backgroundColor="0x333333",width="800",height="600",frameRate="30")]
    public class Simple extends Sprite
    {
        private const PIXELS_TO_METRE:int = 50;
        private var _world:b2World;
        public function Simple()
        {
            stage.scaleMode = StageScaleMode.NO_SCALE;

            //定义重力向量
            var gravity:b2Vec2 = new b2Vec2(0,10);
            //实例化世界（接受两个参数重力向量和当物体停止移动时是否允许物体休眠，一个休眠中的物体不需要任何模拟）
            _world = new b2World(gravity,true);

            //实例化刚体定义数据
            var groundBodyDef:b2BodyDef= new b2BodyDef();
            //设置刚体的初始坐标在1，1米处
            groundBodyDef.position.Set(1,1);
            groundBodyDef.type = b2Body.b2_dynamicBody;

            //实例化一个刚体（将刚体定义数据交给世界能自动创建刚体）
            var groundBody:b2Body = _world.CreateBody(groundBodyDef);

            //实例化刚体的形状
            var groundBox:b2PolygonShape = new b2PolygonShape();
            //将形状定义成2X2的方形
            groundBox.SetAsBox(1,1);

            //实例化粘物
            var groundFixtureDef:b2FixtureDef = new b2FixtureDef();
            //粘上形状。。。
            groundFixtureDef.shape = groundBox;
            //让刚体表现出粘物绑定形状的形状
            groundBody.CreateFixture(groundFixtureDef);

            /**
            * 以上的工作只是定义好必要的数据，但还是需要下面相关的代码来渲染出来
            * 绘图相关
            */
            var debugSprite:Sprite = new Sprite();
            addChild(debugSprite);
            var debugDraw:b2DebugDraw = new b2DebugDraw();
            debugDraw.SetSprite(debugSprite);
            debugDraw.SetLineThickness( 1.0);
            debugDraw.SetAlpha(1);
            debugDraw.SetFillAlpha(0.4);
            //设置缩放量
            debugDraw.SetDrawScale(PIXELS_TO_METRE);
            //设置绘图模式
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
            _world.SetDebugDraw(debugDraw);

//            _world.DrawDebugData();

            addEventListener(Event.ENTER_FRAME,updateFrame);
        }

        protected function updateFrame(event:Event):void
        {
            var timeStep:Number = 1/ 30;
            var velocityIterations:int = 8;
            var positionIterations:int = 3;

            _world.Step(timeStep,velocityIterations,positionIterations);
            _world.ClearForces();
            _world.DrawDebugData();
        }
    }
}</pre>
