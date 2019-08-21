---
title: unity 4.6关于RectTransform的一些研究
tags:
  - Unity
id: 1259
categories:
  - 技术
date: 2015-01-30T10:42:58.000Z
path: /unity-rect-transform/
---

### 坐标

unity 里面的坐标是笛卡尔坐标系,和 flash 的还是有区别的..

#### 世界坐标

世界坐标是三维的全局坐标,一般作为基准坐标

#### 屏幕坐标

二维坐标,屏幕左下角是(0,0),右上角是(sizeX,sizeY). flash 里面的屏幕左上角是(0,0),右下角是(sizeX,sizeY)

#### Rect

官网文档[Rect](http://docs.unity3d.com/ScriptReference/Rect.html)

需要注意的是虽然文档写法设置了左上角是起点,但在 unity 的实际结果中,返回的 rect 还是以左下角为起点的.

<!--more-->

#### RectTransform 里面的三要素

1.  锚点(四个)
2.  角(四个)
3.  中心点(一个)

这三者的关系可以这么形容:在 Unity 里面,一个 UI 对象的坐标是指该对象的中心点相对于其父容器的四个锚点 upda 的中心来定义的,UI 对象 RectTransform 里面的四个角决定了这个对象的宽高.当四个锚点不在一起时,四个锚点和对应的四个点之间的距离决定了该容器相对于父容器的大小.

也就说说锚点和角决定尺寸,锚点和中心点决定位置.

![Image4](./Image[4].gif "Image[4]")

在这张图里,最上面四个小三角就是四个锚点,周围四个实心的点是 RectTransform 的角,中间的圆环就是中心点,四个锚点在一起,所以对象的尺寸没有随父容器尺寸的变化而变化.

![Image(1)[4]](<./Image(1)[4].gif> "Image(1)[4]")

在这张图里面水平锚点被分开了,所以对象的宽度会随着父容器尺寸的变化而变化.

官网关于[RectTransform](http://docs.unity3d.com/Manual/UIBasicLayout.html)的概括

#### RectTransform 涉及到得 API 说明

##### anchoredPosition

中心点相对于四个锚点**中点**的坐标

##### rect

rect 的 x 和 y 返回左下角相对于中心点的距离,w 和 h 返回本身的宽高.

##### offsetMin 和 offsetMax

分别指左下角相对于左下角锚点的距离以及右上角相对于右上角锚点的距离

##### anchorMin 和 anchorMax

这个是针对锚点的,锚点时相对于父容器定义的,所以这两个属性也是相对于父容器的.分别指锚点占父容器尺寸的百分比位置.

##### sizeDelta

这个值挺好玩的,如果四个锚点都在一定,就是宽度和高度,如果水平的锚点分开了,y 还是高度,x 变成了-(left+right).如果垂直的锚点分开了,x 还是宽度,y 变成了-(top+bottom)

##### 中心点的屏幕坐标

overlay 模式就是 position,否则是世界坐标,需要 worldtoscreen 进行转换

    private Vector3 GetSpacePos(RectTransform rect, Canvas canvas, Camera camera)
    {
        if (canvas.renderMode == RenderMode.ScreenSpaceOverlay)
        {
            return rect.position;
        }
        return camera.WorldToScreenPoint(rect.position);

    }

##### GetWorldCorners

返回四个角的世界坐标,对应的屏幕坐标依然和渲染模式有关

    private void GetSpaceCorners(RectTransform rect, Canvas canvas, Vector3[] corners,Camera camera)
    {
        if (camera == null)
        {
            camera = Camera.main;
        }
        rect.GetWorldCorners(corners);
        if (canvas.renderMode == RenderMode.ScreenSpaceOverlay)
        {

        }
        else
        {
            for (var i = 0; i < corners.Length; i++)
            {
                corners[i] = camera.WorldToScreenPoint(corners[i]);
            }
        }
    }

##### RectTransformUtility.RectangleContainsScreenPoint

在 overlay 模式下不能用..

#### 一些实际中可能用到的例子

##### 获取鼠标点下图片的像素

    public Rect GetSpaceRect(Canvas canvas, RectTransform rect, Camera camera)
    {
        Rect spaceRect = rect.rect;
        Vector3 spacePos = GetSpacePos(rect, canvas, camera);
        //lossyScale
        spaceRect.x = spaceRect.x * rect.lossyScale.x + spacePos.x;
        spaceRect.y = spaceRect.y * rect.lossyScale.y + spacePos.y;
        spaceRect.width = spaceRect.width * rect.lossyScale.x;
        spaceRect.height = spaceRect.height * rect.lossyScale.y;
        return spaceRect;
    }

    public bool RectContainsScreenPoint(Vector3 point, Canvas canvas, RectTransform rect, Camera camera)
    {
        if (canvas.renderMode != RenderMode.ScreenSpaceOverlay)
        {
            return RectTransformUtility.RectangleContainsScreenPoint(rect, point, camera);
        }

        return GetSpaceRect(canvas, rect, camera).Contains(point);
    }

    // Update is called once per frame
    void Update()
    {
        if (RectContainsScreenPoint(Input.mousePosition, _canvas, rect, _canvas.camera))
        {
            Image image = _uiObject.GetComponent<Image>();
            var spaceRect = GetSpaceRect(_canvas, rect, camera);
            var localPos = Input.mousePosition - new Vector3(spaceRect.x, spaceRect.y);
            var realPos = new Vector2(localPos.x , localPos.y );
            var imageToTextre = new Vector2(image.sprite.textureRect.width/spaceRect.width,
                image.sprite.textureRect.height/spaceRect.height);
            _resultImage.color = _uiObject.GetComponent<Image>().sprite.texture.GetPixel((int)(realPos.x*imageToTextre.x), (int)(realPos.y*imageToTextre.y));
        }
    }

只在 RenderMode 是 ScreenSpaceOverlay 测试通过,主要过程涉及到坐标转换.

1.  将图片的坐标转换到左下角为起点的坐标系 2. 将鼠标的屏幕坐标转换到相对于图片的坐标,并获得改坐标 3. 将该坐标换算到对应纹理的坐标点.

几点发现

1.  `lossyScale` 是一个对象的全局缩放量,比如你给 canvas 加了一个`CanvasScaler`,那么 image 的缩放量会包括改值,localScale 却不包括.
2.  `lossyScale` 在`Canvas`的渲染模式是`ScreenSpaceCamera`时,数值略诡异,似乎和`Camera`的`size`有关,所以上述代码在`ScreenSpaceCamera`无效
3.  `RectTransform`里面的 rect 返回的尺寸没有经过`lossyScale`,需要自己计算,详见`GetSpaceRect`函数
4.  计算鼠标相对于图片的坐标也要考虑`lossyScale`
5.  最后计算出来的坐标是相对于图片的坐标,图片和内部的`Texture`之间的尺寸可能不是 1:1 的,所以也需要计算比例,参考`imageToTextre`变量

#### 总结

相对于 flash,这次的 ui 系统最大的更新就是加入了四个锚点并且可以分开

吐槽 unity api 文档写的真是烂,一定是程序员写了注释直接转过来的,还有开源一点诚意都木有,关键的 RectTransform 和 Canvans 之类的都没源码

Canvas 的三种渲染模式的实际用处还有待发现,目前做重度 UI 相关的业务用`ScreenSpaceOverlay`一切正常,

渲染模式是`WorldSpace`的一个[视频](https://www.youtube.com/watch?v=Mzt1rEEdeOI)
