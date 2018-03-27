在为 electron 开发 node-addon 的时候,因为 electron 内置的 node 和系统的 node 版本不一致,node 版本不一致会导致abi 接口 不一致,所以 node-addon 需要为 electron 内置的 node 单独编译.

可以用 node-gyp 的参数手动控制,但是不够动态,各种编译参数都要自己拼接,最简单的方式是使用 electron-rebuild. 它会自动读取当前 node_module 内的 electron 版本然后构建正确的编译参数最后调用 node-gyp编译.

 electron-app 打包需要将 node-addon 打入最终的发行版. 本来想省事引入了 node-pre-gyp, node-pre-gyp 能够为特定的 abi 和node 版本预编译 addon, 这样使用的时候就算本地没有addon 的编译环境也能使用 addon.
 然而...,node-pre-gyp 不支持 electron 的预编译.最终还是采用了源码编译的方式编译 addon.
 
 因为 window 和 mac 两个系统的构建环境都不一样,针对不同平台的 addon 需要单独在不同的操作系统上编译.所以 gitlab-ci 需要单独配置一台 mac 和 window 的gitlab-runner.
 
 有的 node-addon 在 window 上还需要引入 dll. 在 binding里面可以 定义复制命令.
 
 最后使用 electron-builder 的使用可以为不同系统配置不同的 build. 因为我的 addon 理论上只支持 win32 x86. 所以必须确保 ia32 的架构同步到了 electron-rebuild electron-build, 不然在64位的 windows 上面编译出来的 app 很可能架构不对,导致要么app 跑不起来,要么无法加载 addon, 报不是有效的32位程序之类的坑.
 
 





