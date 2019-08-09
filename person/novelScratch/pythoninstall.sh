#!/bin/sh

# another way to install python
yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make libffi-devel -y
#运行这个命令添加epel扩展源 
yum -y install epel-release 
#安装pip 
yum install python-pip
wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tgz
#解压缩
tar -zxvf Python-3.7.0.tgz
cd Python-3.7.0
#进入解压后的目录，依次执行下面命令进行手动编译
./configure prefix=/usr/local/python3 
make && make install
python3.7 –v
#添加python3的软链接 
sudo ln -sf /usr/local/python3/bin/python3.7 /usr/bin/python3.7 
#添加 pip3 的软链接 
sudo ln -sf /usr/local/python3/bin/pip3.7 /usr/bin/pip3.7
# 更改yum配置，因为其要用到python2才能执行，否则会导致yum不能正常使用
# vi /usr/bin/yum 
# 把 #! /usr/bin/python 修改为 #! /usr/bin/python2 
# vi /usr/libexec/urlgrabber-ext-down 
# 把 #! /usr/bin/python 修改为 #! /usr/bin/python2

# change default python2 to python3
# ls /usr/bin/python*
# vi ~/.bashrc
# add alias python='/usr/bin/python3.4' to ~/.bashrc
# . ~/.bashrc
# python --version