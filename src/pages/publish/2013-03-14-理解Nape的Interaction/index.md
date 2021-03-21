---
title: 理解Nape的Interaction
tags:
  - 技术
  - Flash
id: 1123
path: /understanding-nape-interaction/
created_at: 2013-03-14T14:27:26.000Z
updated_at: 2013-03-14T14:27:26.000Z
---

有的时候我们想控制两个刚体是否发生碰撞,比如手机游戏 Doodle Jump 里面的小人在上升过程中不会和障碍物发生碰撞但在降落过程中会发生碰撞,这个时候就需要知道如何利用 Nape 来控制这个碰撞了.这里的碰撞在 Nape 看来是一种交互方式.Nape 定义了三种交互方式:

- Collision(碰撞)
- Sensor(感应)
- Fluid(浮力)

默认情况下两个物体只会发生 Collision 交互,另外的两种交互需要设置 Shape 的**sensorEnabled** 和 **fluidEnabled** 来手动开启.

如果一个 Shape 的这三种交互都是开启的,那么将**只处理**优先级最高的.

交互的优先级:Sensor>Fluid>Collision.

也就是说当三种交互都允许时,实际上只检测 Sensor 交互.

控制交互的两种方式:

1.  InteractionFilters
2.  InteractionGroups

### InteractionFilters

**说明:**

所有的 Shape 类型都有一个 filter 属性,这个属性是 InteractionFilter 类型,通过控制 filter 的 group 和 mask(掩码)来过滤不必要的交互

**过滤规则**:

当交互对象 A 的 group 和其被交互对象 B 的 mask 做**按位和操作,**(无论 A 和 B 对象是否互换)如果结果是 0 说明不交互,否则发生交互.

默认情况下

group 都是 1,二进制是 00...01.

mask 是-1,二进制是 11...11.

所以默认下任意两个对象都会发生碰撞,因为他们的按位和非 0

<!--more-->

先来一个简单的 demo（小球默认能和下面的木板发生碰撞,点击右边的按钮可以切换小球是否和木板发生碰撞）：

<embed src="/images/uploads/2013/03/SimpleInteraction1.swf" width="500" height="380">

filter 版本小球碰撞的源码:

    private function testSimpleFilter():void
    {
        createBall(10, 5, 5, new Material(Number.POSITIVE_INFINITY));
        var box:Body = createBox(100, 10, BodyType.KINEMATIC, 50, 100);
        new PushButton(this, 200, 100, "swap:filter", clickCallback);
        function clickCallback(e:MouseEvent):void
        {
            box.shapes.at(0).filter.collisionMask = ~box.shapes.at(0).filter.collisionMask;
        }
    }

###### 使用 InteractionFilters 的一般思路是

1:首先为需要过滤的对象分组,我们可以将它们抽象成 A,B,C 组之类的.

2:建立一张含有 A,B,C 的表格,看个人爱好决定横行表头是 group,纵行表头是 mask 或者横行表头是 mask,纵行表头是 group.

3:然后为这些组的 group 表头设定值,这里分 group 有一个原则就是所有 group 的按位和操作必须是 0(后面会演示如果不这么做会出现什么情况),最简单的方式就是依次按 2 的整数幂次方为它们编号.

4:按照给定的规则分别标记两两对象的是否可以交互.

5:计算对应的 mask.

举个栗子:我们想表示三组对象之间的碰撞关系:

|       | A   | B   | C   |
| :---: | --- | --- | --- |
| **A** | N   | Y   | Y   |
| **B** | Y   | Y   | N   |
| **C** | Y   | B   | N   |

我们定义了三个组,按照 1,2 规则建立一张表格,左边加粗的假定是 group.

上表中 N 表示不碰撞(期望按位和为 0),Y 表示碰撞(期望按位和非 0).比如 A 类和 A 类不碰撞,A 类和 B 类碰撞,A 类和 C 类碰撞.

容易看出这张表是对称的.

然后我们给 group 分配值,按照规则三我们假定

A 的 group 是 2^0 >>001;

B 的 group 是 2^1 >>010;

C 的 group 是 2^2 >>100;

结合上表就能依次计算出:

A 的 mask 是 110 也就是十进制的 6;(观察第一列:只有 110 和 001 按位和 0,和 010 按位和非 0,和 100 按位和非 0,下同)

B 的 mask 是 011 也就是十进制的 3;

C 的 mask 是 001 也就是十进制的 1;

结果如下（小中大分别对应 abc）:

<embed src="/images/uploads/2013/03/ComplexInteraction.swf" width="500" height="380">

控制三组对象碰撞关系的 filter 版本源码:

<pre>private function testMultiFilter():void
{

    var Ba1:Body = createBall(10,110,100);
    var Ba2:Body = createBall(10,100,100);

    Ba1.shapes.at(0).filter.collisionGroup = 1;
    Ba2.shapes.at(0).filter.collisionGroup = 1;

    Ba1.shapes.at(0).filter.collisionMask = ~1;
    Ba2.shapes.at(0).filter.collisionMask = ~1;

    var Bb1:Body = createBall(50,110,100);
    var Bb2:Body = createBall(50,100,100);

    Bb1.shapes.at(0).filter.collisionGroup = 2;
    Bb2.shapes.at(0).filter.collisionGroup = 2;

    Bb1.shapes.at(0).filter.collisionMask = ~4;
    Bb2.shapes.at(0).filter.collisionMask = ~4;

    var Bc1:Body = createBall(100,110,100);
    var Bc2:Body = createBall(100,100,100);

    Bc1.shapes.at(0).filter.collisionGroup = 4;
    Bc2.shapes.at(0).filter.collisionGroup = 4;

    Bc1.shapes.at(0).filter.collisionMask = ~(4|2);
    Bc2.shapes.at(0).filter.collisionMask = ~(4|2);
}</pre>

所有 group 的按位和操作必须是 0,如果不是会怎么样呢?做个实验就知道了.

我们假定

A 的 group 是 001;

B 的 group 是 011;

C 的 group 是 101;

那么对于第一列能得出 A 的 mask 是 110.

但是对于第二列

第二列第一行能确定??1

第二列第二行能确定?11

第二列第三行需要 101,但是 101 和?11 都是互斥的,所以认定这个 group 组合不合法.

###### mask 的快捷计算方式:

这个方法比较笨拙,如果对位操作比较熟悉,可以使用 nape 作者推荐的计算 mask 的方法:

对所有不和指定组发生交互的组的 group 取或(|)操作,并且将得到的结果取反(~).

比如:

A 不和 A 发生碰撞那么计算掩码的直接表达式就是

maskA = ~(groupA) = 110;

C 不和 BC 碰撞

maskC = ~(groupB|groupC) = ~(010|100) = ~(110) = 001;

### InteractionGroups

**说明**:

Filter 只是 Shape 的属性,Nape 为 Interactor 类提供了 group 属性,这个属性是一个 InteractionGroup 类型.Shape,Body 和 Compound 都是 Interactor 的子类,所以它们都能使用 InteractionGroup 的一些特性.

**过滤规则**:

把需要一起控制的对象指向同一个 group,并且改变这个 group 的 ignore(布尔值)属性来控制这些对象是否需要交互,true 是不交互,false(默认)是交互.

group 版本小球碰撞的源码:

<pre>private function testSimpleGroup():void
{
    var group:InteractionGroup = new InteractionGroup();
    var ball:Body = createBall(10, 5, 5, new Material(Number.POSITIVE_INFINITY));
    var box:Body = createBox(100, 10, BodyType.KINEMATIC, 50, 100);
    ball.group = box.group = group;
    new PushButton(this, 200, 100, "swap:group", clickCallback);
    function clickCallback(e:MouseEvent):void
    {
        group.ignore = !group.ignore;
    }
}</pre>

控制三组对象碰撞关系的 group 版本源码:

<pre>private function testMultiGroup():void
{
    var groupA:InteractionGroup = new InteractionGroup(true);
    var groupB:InteractionGroup = new InteractionGroup(false);
    var groupC:InteractionGroup = new InteractionGroup(true);

    var groupAB:InteractionGroup = new InteractionGroup(false);
    var groupBC:InteractionGroup = new InteractionGroup(true);
    var groupAC:InteractionGroup = new InteractionGroup(false);

    groupA.group = groupAB;
    groupA.group = groupAC;

    groupB.group = groupAB;
    groupB.group = groupBC;

    groupC.group = groupAC;
    groupC.group = groupBC;

    var Ba1:Body = createBall(10,110,100);
    var Ba2:Body = createBall(10,100,100);
    Ba1.group = groupA;
    Ba2.group = groupA;

    var Bb1:Body = createBall(50,110,100);
    var Bb2:Body = createBall(50,100,100);
    Bb1.group = groupB;
    Bb2.group = groupB;

    var Bc1:Body = createBall(100,110,100);
    var Bc2:Body = createBall(100,100,100);
    Bc1.group = groupC;
    Bc2.group = groupC;
}</pre>

图示:

[![InteractionGroup](./InteractionGroup.png 'InteractionGroup')](/images/uploads/2013/03/InteractionGroup.png)

在这个例子中用到了 InteractionGroup 的一个树结构的特征.也就是任何 InteractionGroup 都有一个 group 属性说明这个 group 的父 group 是什么.这个 group 是一个列表所以支持

groupA.group = groupAB;

groupA.group = groupAC;

这种多重赋值,意思就是 groupA 有两个父节点分别是 groupAB 和 groupAC.

对于多次嵌套树结构,需要通过查找他们的最近共同祖先(MRCA)来确定是属于哪一个 group 的.这里拿官方手册上的例子好了.

<pre>           Group1
          /   |
         /  Group2      Group3
        /    |    \       |
    Body1   /      Cmp1   |
   /    \  /      /    \  |
Shp1   Shp2   Body2     Cmp2
                |         |
               Shp3     Body3
                          |
                        Shp4</pre>

这是它们的原始结构关系,这里着重看看 shape 之间的关系.

要确定两两 shape 的关系.

1:先要确定每个 shape 属于哪一个 group,所以

Shp1 依次往上递归得到碰到的第一个 group 是 G1.

Shp2 依次往上递归得到碰到的第一个 group 是 G2.

Shp3 依次往上递归得到碰到的第一个 group 是 G2.

Shp4 依次往上递归得到碰到的第一个 group 是 G3.

2:结合这几个 Group 的关系就能确定最终得到的 Group 关系图:

<pre>        Group1
        /   \           Group3
    Shp1    Group2        |
            /    \      Shp4
         Shp2    Shp3</pre>

<span style="text-decoration: line-through;">MRCA(Shp1, Shp2) == Group1</span>;//Shp1 和 Shp2 属于同一个刚体,所以他们是一起运动的也就不存在交互作用了.

MRCA(Shp1, Shp3) == Group1;

MRCA(Shp2, Shp3) == Group2;

Shp4 是孤立的,所以不存在 Shp1 和 Shp4 之类的交互控制,**所以 Shp4 和所有其他对象默认都是发生碰撞的**.

在确定了各个 Shape 的 MRCA 之后就能很容易的看出他们的碰撞关系了.

比如

`Group1.ignore = true && Group2.ignore = false`就能得出:Shp1 和 Shp3 不会交互,Shp2 和 Shp3 会交互.

<embed src="/images/uploads/2013/03/InteractionDemoA.swf" width="500" height="380">

`Group1.ignore = false&& Group2.ignore = true`就能得出:Shp1 和 Shp3 会交互,Shp2 和 Shp3 不会交互.

<embed src="/images/uploads/2013/03/InteractionDemoB.swf" width="500" height="380">

上述 demo 中从小到大依次是 shape1 - shape4

### 总结

1.  Filter 是 Shape 的属性,在一开始就创建好了,Group 是所有 Interactor 的属性,但默认是 null 的.需要自己 new

2.  创建的数量区别，filter 很多，但是 group 是无限的

3.  Filter 有特定类型的 Filter,比如 Collision 有对应的 group 和 mask,Sensor 又有对应的 group 和 mask,但 Group 是不需要这么指定的.

4.  Filter 的操作更加底层,需要熟悉位运。

### 参考资料

[文章源码](https://github.com/Tomyail/mixTest/blob/master/src/nape/InteractionTest.as)

<http://napephys.com/samples.html#swf-FilteringInteractions>

<http://napephys.com/help/manual.html#Interactions>

求两个节点的最近共同祖先(下图:来自<http://www.haogongju.net/art/581937>)

[![Image(1)](<./Image(1).png> 'Image(1)')](/images/uploads/2013/03/Image1.png)
