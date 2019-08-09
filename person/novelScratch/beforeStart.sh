#!/bin/sh
# notice: chomd 755 beforeStart.sh
# install python3, pip3
# sudo yum install yum-utils -y
# sudo yum-builddep python
# yum install zlib-devel
# wget https://www.python.org/ftp/python/3.6.1/Python-3.6.1.tar.xz
# xz -d Python-3.6.1.tar.xz
# tar -xvf Python-3.6.1.tar
# cd Python-3.6.1
# ./configure --prefix=/usr/local/python3.6 --enable-optimizations
# make
# sudo make install

# another way to install python
yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make libffi-devel -y
#运行这个命令添加epel扩展源 
yum -y install epel-release 
#安装pip 
yum install python-pip
wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tgz
#解压缩
tar -zxvf Python-3.7.0.tgz
cd Python-3.7.0.tgz
#进入解压后的目录，依次执行下面命令进行手动编译
./configure prefix=/usr/local/python3 
make && make install
#添加python3的软链接 
sudo ln -sf /usr/local/python3/bin/python3.7 /usr/bin/python3.7 
#添加 pip3 的软链接 
sudo ln -sf /usr/local/python3/bin/pip3.7 /usr/bin/pip3.7
# 更改yum配置，因为其要用到python2才能执行，否则会导致yum不能正常使用
# vi /usr/bin/yum 
# 把 #! /usr/bin/python 修改为 #! /usr/bin/python2 
# vi /usr/libexec/urlgrabber-ext-down 
# 把 #! /usr/bin/python 修改为 #! /usr/bin/python2



# clone project
git clone https://github.com/Onenotmind/company.git
cd ~/company/person/novelScratch
pip install pyquery selenium flask
