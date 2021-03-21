---
title: 理解Unity3D里的Coroutine
tags:
  - 技术
  - Unity
id: 1123
date: 2015-08-15T14:27:26.000Z
path: /understanding-unity-coroutine/
---

# 理解 Unity3D 里的 Coroutine

Coroutine,翻译过来叫协程,这东西在 as3 里面没有,所以觉得挺新鲜的,顾做点研究.

Unity 里面的 Coroutine 通过关键字 yield 来定义的([Unity Coroutine](http://docs.unity3d.com/ScriptReference/Coroutine.html)),所以我们先看这个关键字.
先上一张高大上的 unity 运行时序图

<img src="http://docs.unity3d.com/460/Documentation/uploads/Main/monobehaviour_flowchart.svg" class="full-image" alt="Execution Order of Event Functions" />

## yield 关键字

yield 是 C#定义的一个关键字,相关文档([C# yield](http://msdn.microsoft.com/zh-cn/library/9k7k7cf0.aspx))

>     使用 yield return 语句可一次返回一个元素。
>     通过 foreach 语句或 LINQ 查询来使用迭代器方法。 foreach循环的每次迭代都会调用迭代器方法。 迭代器方法运行到 yield return 语句时，会返回一个 expression，并保留当前在代码中的位置。 当下次调用迭代器函数时执行从该位置重新启动。
>     可以使用 yield break 语句来终止迭代。

<!--more-->

### 例子

    using System;
    using UnityEngine;
    using System.Collections;
    namespace Script
    {
        public class CoroutinesDemo:MonoBehaviour
        {
            void Start()
            {
                IEnumerator ator =  yieldFun1();
                Debug.Log(1);
                while(ator.MoveNext())
                {
                    Debug.Log(2);
                    Debug.Log(ator.Current);
                }
            }

            IEnumerator yieldFun1()
            {
                Debug.Log(3);
                yield return 1;89
                Debug.Log(4);
                yield return 2;
                Debug.Log(5);
                yield return 3;
            }
        }
    }

### 输出

```js
1;
3;
2;
1;
4;
2;
2;
5;
2;
3;
```

### 结论

包含 yield 的语句在每次遍历的时候执行一次并停止,在下次遍历时恢复并继续

## unity 中的协程

相关文档

[Unity StartCoroutine](http://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html)

[Unity StopCoroutine](http://docs.unity3d.com/ScriptReference/MonoBehaviour.StopCoroutine.html)

### 例子

    using System;
    using UnityEngine;
    using System.Collections;
    namespace Script
    {
        public class CoroutinesDemo:MonoBehaviour
        {
            void Start()
            {
                StartCoroutine(yieldFun2());
                Debug.Log("End yieldFun2");
            }

            IEnumerator yieldFun2()
            {
                Debug.Log("1"+DateTime.Now);
                yield return new WaitForSeconds(1f);
                Debug.Log("2"+DateTime.Now);
                yield return new WaitForSeconds(1f);
                Debug.Log("3"+DateTime.Now);
            }
        }
    }

### 输出

    111/14/2014 14:34:57
    End yieldFun2
    211/14/2014 14:34:58
    311/14/2014 14:34:59

### 结论(没有源码,都是推论)

在第一个例子中,我们手动用了 while 循环对迭代器进行迭代

Unity 利用函数`StartCoroutine`把这个迭代过程分发给了**每帧**去执行

我们具体看代码,首先`Start`函数被自动调用,开始执行第一行代码.
在第一行代码中,`StartCoroutine`把函数`yieldFun2()`函数里面的语句用 yield 分割成了三块.

第一块

    Debug.Log("1"+DateTime.Now);
    yield return new WaitForSeconds(1f);

第二块

    Debug.Log("2"+DateTime.Now);
    yield return new WaitForSeconds(1f);

第三块

```js
Debug.Log('3' + DateTime.Now);
```

这三块为被分割到了三个更新时间片去执行.首先第一块被直接执行,所以日志输出了

`111/14/2014 14:34:57`

并且在帧刷新中继续执行`WaitForSeconds(1f);`

程序此时不会因为等待一秒而挂起,而是返回主流程继续执剩余代码,日志输出

`End yieldFun2`

之后帧刷新中判断到达了一秒的等待时间,到了执行第二块,然后第三块..

## 协程的中断

### 例子

    using System;
    using UnityEngine;
    using System.Collections;
    namespace Script
    {
        public class CoroutinesDemo:MonoBehaviour
        {
            void Start()
            {
                test1();
                test2();
            }

            IEnumerator yieldFun1()
            {
                Debug.Log("1:1"+DateTime.Now);
                yield return new WaitForSeconds(1f);
                yield break;
                Debug.Log("1:2"+DateTime.Now);
                yield return new WaitForSeconds(1f);
                Debug.Log("1:3"+DateTime.Now);
            }

            IEnumerator yieldFun2()
            {
                Debug.Log("2:1"+DateTime.Now);
                yield return new WaitForSeconds(1f);
                Debug.Log("2:2"+DateTime.Now);
                yield return new WaitForSeconds(1f);
                Debug.Log("2:3"+DateTime.Now);
            }

            IEnumerator yieldFun3()
            {
                while(true)
                {
                    Debug.Log("3"+DateTime.Now);
                    yield return new WaitForSeconds(1f);
                }
            }

            void test1()
            {
                StartCoroutine(yieldFun1());
            }

            void test2()
            {
                StartCoroutine(stop());
            }


            IEnumerator stop()
            {


                StartCoroutine("yieldFun3");
    //            StartCoroutine(yieldFun3());
                yield return new WaitForSeconds(2f);
                StopCoroutine("yieldFun3");
    //            StopCoroutine(yieldFun3());
            }

        }
    }

### 输出

    1:111/14/2014 17:42:03
    311/14/2014 17:42:03
    311/14/2014 17:42:04

### 结论

中断有两种,一种调用`yield break`中断,一种调用`StopCoroutine`,
`test1`实现了第一种,`test2`实现了第二种,
1:多个协程是同时进行的,看第一条和第二条输出的时间可知;
2:在调用 StartCoroutine 最好保存参数的引用,因为在嵌套调用时传引用能正确停止,但是调用`StopCoroutine(yieldFun3())`是停止不掉的.已字符串的形式调用都能停止,而且停止全部相同的协程实例.

## yield 返回值

    yield return <expression>;

这里的`<expression>`在 Unity 中可以多种对象

    基本数据对象:立即结束
    YieldInstruction对象,包括(WaitForSeconds,WaitForFixedUpdate):等待时间或者等待更新完毕
    WWW对象:下载完毕
    自定义

### 例子

    using System;
    using UnityEngine;
    using System.Collections;
    namespace Script
    {
        public class CoroutinesDemo:MonoBehaviour
        {
            void Start()
            {
    //            if image is too small ,you can try a big file
    //            string url = "https://www.google.com.hk/images/srpr/logo11w.png";
                string url = "http://www.baidu.com/img/bd_logo1.png";
                StartCoroutine(loudRes(url));
            }


            IEnumerator loudRes(string url)
            {
                WWW www = new WWW(url);
                while (!www.isDone)
                {
                    Debug.Log(www.progress);
    //                yield return www;
                    yield return null;
                }
                Debug.Log("down");


            }

        }
    }

我这里用了两种 yield 返回值,第一种被我注释掉的直接返回 www 对象,第二种返回空如果运行起来就会发现第一种 progress 的 log 只打了一次,第二种会完成多次包含进度的数据,为什么?
因为上面说过了,如果 yield 返回的对象是 www,那么代码块结束的标志是 www 下载完毕,当 www 下载完毕的时候,www,isdown 一定是 true,所以跳出循环

而第二种返回基本对象会在帧刷新时间片里直接返回并等待下一个 yield 的执行,这样就对多次触发 www.isDone(除非网速超级快在一帧内下好了,那也可能只出一条)

### 上面说到的自定义返回对象我就不啰嗦了,有例子

[自定义 coroutines1](http://abutt1.com/blog/2013/08/23/custom-coroutines-part-1/)

[自定义 coroutines2](http://forum.unity3d.com/threads/extending-ienumerator-for-custom-coroutines.142697/)

## 结论

C#里面的 yield 返回一个迭代器,之后我们需要通过循环自己去迭代内容.

unity 利用 StartCoroutine 函数将返回的迭代器交给帧刷新分布执行,很有创意哦..
