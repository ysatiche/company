#!/bin/sh


sudo yum install gcc openssl-devel bzip2-devel
sudo wget https://www.python.org/ftp/python/3.7.2/Python-3.7.2.tgz
sudo tar xzf Python-3.7.2.tgz
cd Python-3.7.2.tgz
./configure ––enable–optimizations
make altinstall
python3.7 –v