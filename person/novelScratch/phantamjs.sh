#!/bin/sh

# chmod 755 phantomjs.sh
# centos
sudo yum install gcc gcc-c++ make git openssl-devel freetype-devel fontconfig-devel

# ubuntu
# sudo apt-get install build-essential chrpath git-core libssl-dev libfontconfig1-dev libxft-dev
cd ~
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2

tar -xvf phantomjs-1.9.7-linux-x86_64.tar.bz2

sudo mv phantomjs-1.9.7-linux-x86_64 /usr/local/src/phantomjs

# 创建软链接到环境变量中。这样可以直接在shell中使用phantomjs命令:
sudo ln -sf /usr/local/src/phantomjs/bin/phantomjs /usr/local/bin/phantomjs

