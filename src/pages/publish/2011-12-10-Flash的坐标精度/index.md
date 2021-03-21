---
title: Flash的坐标精度
tags:
  - 技术
  - Flash
id: 928
comment: false
path: /flash-coordinate-accuracy/
created_at: 2011-12-09T18:52:56.000Z
updated_at: 2011-12-09T18:52:56.000Z
---

今天用坐标旋转公式写物体的运动刚开始出现了一个怪现象，理论上应该是标准圆周运动的代码最后出来的效果却是半径越来越小的圆周运动，错误的轨迹如下图：

![](./错误的圆周运动.png '错误的圆周运动')

直觉反应是误差累积造成的，但是却不知道具体是哪一点的误差。

折腾了十来分钟，灵光一闪...

这是大误差代码：

    protected function updateFrame(event:Event):void
    {
        preX = fish.x;
        preY = fish.y;
        fish.x = preX * cos - preY * sin;
        fish.y = preY * cos + preX * sin;
    }

这是”精确"的代码（排除浮点运算本身的误差 - -！）

    protected function updateFrame(event:Event):void
    {
        preX = currentX;
        preY = currentY;
        currentX = preX * cos - preY * sin;
        currentY = preY * cos + preX * sin;
        fish.x = currentX;
        fish.y = currentY;
        trace("preX",preX,"curX",currentX,"fishX",fish.x);
    }

看到这里就明白了原来是直接抓显示对象的坐标导致误差累积引起的。

早些时候就听说舞台上物体的坐标不会太精确，因为单位像素的精度是 1，但是却不知道直接获取显示列表的坐标也是经过处理的。。。

打印第二段代码里面的 trace 的结果：

    preX 49.87820251299122 curX 49.80973490458729 fishX 49.8
    preX 49.80973490458729 curX 49.72609476841368 fishX 49.7
    preX 49.72609476841368 curX 49.627307582066116 fishX 49.6
    preX 49.627307582066116 curX 49.51340343707853 fishX 49.5
    preX 49.51340343707853 curX 49.3844170297569 fishX 49.35
    preX 49.3844170297569 curX 49.240387650610415 fishX 49.2
    preX 49.240387650610415 curX 49.08135917238321 fishX 49.05
    preX 49.08135917238321 curX 48.9073800366903 fishX 48.9
    preX 48.9073800366903 curX 48.71850323926178 fishX 48.7
    preX 48.71850323926178 curX 48.514786313799846 fishX 48.5
    preX 48.514786313799846 curX 48.296291314453434 fishX 48.25
    preX 48.296291314453434 curX 48.06308479691596 fishX 48.05

**目测得出结论，获取一个显示对象的坐标，它的有效精度是小数点后两位，并且最后一小数位是 5 的整数倍。**

所以"高精度”运算的代码，不要直接使用显示对象的坐标，或者不要使用 as3 - -。

本文[完整](https://gist.github.com/1450965)的正确代码：

    package demo
    {
        import flash.display.Sprite;
        import flash.events.*;
        import flash.geom.Matrix;
        import flash.geom.Point;

        public class FishRoundFly extends Sprite
        {
            private var fish:Sprite = new Sprite;
    //        private var centerPoint:Point = new Point;
            private var increaseDegree:Number = 1;

            private var cos:Number;
            private var sin:Number;
            private var radias:Number;
            private var preX:Number;
            private var preY:Number;
            private var currentX:Number;
            private var currentY:Number;
            public function FishRoundFly()
            {
                fish.graphics.beginFill(0);
                fish.graphics.drawRect(0,0,20,20);
                addChild(fish);

                fish.x = 50
                fish.y = 0;
                currentX = fish.x;
                currentY = fish.y
                radias = increaseDegree*Math.PI/180;
                cos = Math.cos(radias);
                sin = Math.sin(radias);

                this.addEventListener(Event.ENTER_FRAME,updateFrame);
                this.graphics.lineStyle(1);
            }
            protected function updateFrame(event:Event):void
            {
                preX = currentX;
                preY = currentY;
                currentX = preX * cos - preY * sin;
                currentY = preY * cos + preX * sin;
                fish.x = currentX;
                fish.y = currentY;
                this.graphics.lineTo(fish.x,fish.y);
                trace("preX",preX,"curX",currentX,"fishX",fish.x);
            }
        }
    }

更新:根据[swf 格式说明文档](http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf)信息的说明,一个有效像素的尺寸是 1/20(In the SWF format, a twip is 1/20th of a logical pixel. A logical pixel is the same as a screen pixel when the file is played at 100%—that is, without scaling)
