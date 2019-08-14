# python scratch novel.

### 步骤

1. 以笔趣阁为例，输入目录页网址

2. 得到每一个章节的目录链接

3. 多进程（TODO）或者顺序爬取每一个章节信息。

4. 将每一个章节的文本做处理（空格去除，换行，标题等）

5. 合并每一个章节内容，保存成TXT

### 部署

1. centos中先执行 phantamjs.sh beforeStart.sh

2. 安装配置nginx. nginx.sh(TODO 未完成)

### TODO

1. 请求队列，防止请求过多服务器崩溃(redis or rabbitmq)

redis[ok]

rabbitmq[prepare]

supervisor[prepare]

2. 添加logstash

3. 多线程下载txt

multi thread [ok]

multi process [prepare]

4. 百度云储存对接

5. docker化配置

6. optimized noverScratch.py code





