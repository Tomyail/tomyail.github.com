---
title: 多个带透明通道的位图重叠时出现白边的解决方案
tags:
  - Actionscript3
id: 1049
categories:
  - 技术
date: 2012-11-29T19:14:17.000Z
path: /alpha-error
---

最近利用[ginger](http://cheezeworld.com/bitmap-animation-api-released-ginger/)这个位图动画引擎做功能,这个引擎利用[spritesheet](http://www.8bitrocket.com/2008/7/2/Tutorial-AS3-The-basics-of-tile-sheet-animation-or-blitting/)拷贝位图数据然后存在数组里循环切换位图数据来实现动画效果的.里面的 AnimationPlayer 包含一张 Bitmap 负责模拟 Movieclip 的功能.

我做了一个效率测试却出现了一个奇怪的问题

<!--more-->

问题表现:

当我实例化少量 AnimationPlayer 时,问题不大,但当我实例化很多,比如 N>50 的时候,这些重叠的 AnimationPlayer 就出现白边如下图:

![Image1](./Image1.png "Image1")

我让这些位图开始分开移动时,白边就会消失(但重叠部分依然有白边):

![Image2](./Image2.png "Image2")

将他们聚拢时白边又会出现:

![Image3](./Image3.png "Image3")

Ginger 拷贝位图序列的代码是没有问题的(做了透明背景处理):

    public function addFrame(a_numFrames:int, a_bitmapData:BitmapData,
                             a_frameLocation:Rectangle,
                             a_offsetX:Number = 0, a_offsetY:Number = 0,
                             a_frameID:String = null):BitmapData
    {
        if (a_frameID == "")
        {
            a_frameID = null;
        }

        var bmpData:BitmapData = new BitmapData(a_frameLocation.width, a_frameLocation.height, true, 0x00000000);
        bmpData.copyPixels(a_bitmapData, a_frameLocation, new Point());

        m_frames.push(new Frame(a_numFrames, bmpData, m_framesOfRotation, a_frameID, a_offsetX, a_offsetY));
        if (a_frameID != null)
        {
            m_frameMap[a_frameID] = m_totalFrames;
        }
        m_totalFrames++;

        return m_frames[m_frames.length - 1].bitmapData[0];
    }

后来一步步抽离相联的因素发现问题出在那张绿色环保无污染的背景图上,我使用的背景图是一张 Png 图片,也就说是带有 Alpha 通道的,但当我将这张图片转换成没有 Alpha 通道的 jpg 图片时,问题消失了...

![Image4](./Image4.png "Image4")

后来我才知道这个白边其实就是你舞台的颜色,如果舞台默认是黑色的,轮廓就是黑边.

好了问题解决了..
