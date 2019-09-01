# basic

iris

https://github.com/kataras/iris/tree/master/_examples

# 解决go get国内不能下载问题

#### 方式一：

```bash
# 使用gopm(Go Package Manager)代替go下载,是go上的包管理工具，十分好用
# 1. 下载安装gopm
go get -u github.com/gpmgo/gopm
# 2. 使用gopm安装被墙的包
gopm get github.com/Shopify/sarama
```

---

#### 方式二：

```bash
#  golang 在 github 上建立了一个镜像库，如 https://github.com/golang/net 即是 https://golang.org/x/net 的镜像库.获取 golang.org/x/net 包（其他包类似），其实只需要以下步骤：
cd ~
git clone https://github.com/golang/net.git
mkdir -p $GOPATH/src/golang.org/x
sudo cp ~/net $GOPATH/src/golang.org/x
cd $GOPATH/src/golang.org/x
git clone https://github.com/golang/sys.git
git clone https://github.com/golang/text.git
```


# 终端设置翻墙

sudo apt-get install polipo
cd /etc/polipo/
sudo chmod 777 config # 为config文件申请最高权限
vi /etc/polipo/config # 打开进行编辑

原文件中已经有了两句话，那么需要新加入3句话：
socksParentProxy = “127.0.0.1:1080″
socksProxyType = socks5
proxyAddress = "::0"        # both IPv4 and IPv6
# or IPv4 only
# proxyAddress = "0.0.0.0"
proxyPort = 8123

sudo service polipo stop
sudo service polipo start

http_proxy=http://localhost:8123 curl ip.gs
想要为某个命令加上代理，就在前面使用：http_proxy=http://localhost:8123

每一次都输入这么一串命令实在太不人性化，解决方法就是给这个命令一个缩写的别名，比如“hp”。

$ vi ~/.bashrc
打开配置文件，在最后面加上一句：
alias hp="http_proxy=http://localhost:8123" 
关闭文件，执行下面代码：
$ source ~/.bashrc
这样，hp就可以代表之前很长的命令，试验一下：
https://blog.scnace.me/%E4%B8%BAgo%20get%E6%8A%A4%E8%88%AA%20/

https_proxy=http://127.0.0.1:8123 go get -u -v github.com/labstack/echo


# 项目架构

前端： VUE + 自研组件库

后端： iris + kafka + mysql + alioss


# 数据表

$ sudo mysql -u root

mysql> USE mysql;
mysql> UPDATE user SET plugin='mysql_native_password' WHERE User='root';
mysql> FLUSH PRIVILEGES;
mysql> exit;

$ sudo systemctl restart mysql
$ sudo systemctl status mysql

### novelList

表结构： mysql/novelList.sql

### 接口

/v1/getNovelInfo [GET] get novel & novel download url

/v1/uploadNovel [POST] upload novel.txt to ali oss and record in the server

### REDIS


### MYSQL in Ubuntu18

[download refer] https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04

https://help.cloud66.com/maestro/how-to-guides/databases/shells/uninstall-mysql.html


https://stackoverflow.com/questions/11990708/error-cant-connect-to-local-mysql-server-through-socket-var-run-mysqld-mysq

https://stackoverflow.com/questions/42153059/mysqld-safe-directory-var-run-mysqld-for-unix-socket-file-dont-exists