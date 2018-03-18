---
title: 书如其名：适合新手——《写给大家看的面向对象编程书》
tags:
  - 其他
id: 330
comment: true
categories:
  - 读摘
date: 2010-10-20T11:06:25.000Z
path: /the-object-oriented-thought-process
---

一本只有 250 页左右的书，我花了一个五天读完了。总体来说这确实是一本适合入门的面向对象设计书。

个人感觉书中的 7，8，9 章对自己的帮助最大.

看完这本书接口给我的最大印象在于它在建立契约中的作用。这里所谓的契约就是指代码的标准化，举个例子假设我们所有的类都有一个 get id 方法，多继承在 AS3 中又是不支持的，但允许使用多个接口，所以当一个子类实现某个契约时（定义 id 方法）它必须为接口中未实现的方法提供实现。

书中没有明确给出何时使用组合，何时使用继承，其实这本来就没有明确的答案。继承反映出来的是 is-a 的关系，而组合则是 has-a。通常使用组合能更大程度上提高类的灵活性而且不会破坏类的封装。组合又分为聚集和关联两种方式。其中聚集是一种强组合，比如汽车中轮胎和发动机的关系，他们共同组成了一台汽车必须拥有的部件，没有了其中任何一样汽车都无法工作。关联是一种弱组合，可以理解为汽车中的音像系统，没有了音响系统汽车还是能正常工作。聚集和关联是人们对类角度的不同而分类的。

使用多态可以减少条件判断语句的使用,因为类有自知之明,还是那个很经典的例子

    package
    {

    	/**
    	 * ...
    	 * @author
    	 */
    	public class  Test
    	{
    		var shape:Shape;
    		shape = new Rectangle();
    		shape.draw();
    	}

    }

    class Shape {
    	public function draw():void;
    }

    class Clrcle extends Shape {
    	override public function draw():void
    	{
    		super.draw();
    		trace("a Circle")
    	}
    }

    class Rectangle extends Shape {
    	override public function draw():void
    	{
    		super.draw();
    		trace("a Rect")
    	}
    }

这里新建的 shape 虽然声明是一个 shape,但在实例化是我们定义了他的具体类型(Rectangle),所以最后它调用 的将是自己的类方法。

总之，这是一本入门级别的书，没有高度抽象的语言，而且书也不厚，很适合敲开面向对象程序设计的大门。最后声明下我是新手，如果写的误人子弟了，还请各位拍砖:-)
