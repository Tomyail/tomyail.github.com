
首先看一篇非常好的事件循环文章

https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/#event-loop

但是这篇文章里面说的这段代码:

```js
console.log('script start')

const interval = setInterval(() => {
  console.log('setInterval')
}, 0)

setTimeout(() => {
  console.log('setTimeout 1')
  Promise.resolve().then(() => {
    console.log('promise 3')
  }).then(() => {
    console.log('promise 4')
  }).then(() => {
    setTimeout(() => {
      console.log('setTimeout 2')
      Promise.resolve().then(() => {
        console.log('promise 5')
      }).then(() => {
        console.log('promise 6')
      }).then(() => {
        clearInterval(interval)
      })
    }, 0)
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise 1')
}).then(() => {
  console.log('promise 2')
})
```

文章认为的输出是:

```
script start
promise1
promise2
setInterval
setTimeout1
promise3
promise4
setInterval //1
setTimeout2 //0
setInterval // 1
promise5
promise6
```


然而我在浏览器里面里面的输出:
```
script start
VM111:28 promise 1
VM111:30 promise 2
Promise {<resolved>: undefined}
VM111:4 setInterval
VM111:8 setTimeout 1
VM111:10 promise 3
VM111:12 promise 4
2VM111:4 setInterval  =====> 2次同时
VM111:15 setTimeout 2
VM111:17 promise 5
VM111:19 promise 6
```

最后发现文章里面有人和我有同样的疑问

最好定位到了 nodej 的一个issue:

https://github.com/nodejs/node/issues/15081