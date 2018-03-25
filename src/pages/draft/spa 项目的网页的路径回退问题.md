spa项目基本都是客户端自己管理路由,也就是说所有的其他请求其实不是文件请求,所以需要配置 redirect

http://blog.csdn.net/xiaotuni/article/details/77745189

还有一个问题
index.html 里面嵌入的 css 等资源的方式也要用绝对路径,绝对路径的简单写法是/ XXX.css

注意不要加`.`, 变成 `./xxx.css`  这样就是相对路径,结合 server 的跳转规则,所有的 css,js 都会变成 html~

另外 http-server 不支持页面跳转,也已使用 serve 代替, serve -s 




