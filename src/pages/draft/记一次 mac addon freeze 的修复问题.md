#

# tlnr:

本文记录了再开发 agora addon 的时候遇到的一次 mac freeze 的问题. 

1. 首先介绍 freeze 的现象.
2. 其次说明通过什么工具定位引发 freeze 的问题.
    (Instruments -> Time Profiler )
    如何加载 electron 的 dsym 文件查看 electron 的错误堆栈
3. 最后定位到是 libuv 的线程锁问题.
    什么是线程锁? agora 的裸数据处理是多线程的, 通过 liuv 收到事件后需要加原子锁,因为没有原子锁,触发了一段互斥的死循环导致 libuv 进程卡死,最终引发 mac ui freeze 问题
    