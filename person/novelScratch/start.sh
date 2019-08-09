#!/bin/sh

cd ~
git clone https://github.com/Onenotmind/company.git
cd ~/company/person/novelScratch

chmod 755 ./nginx.sh
chmod 755 ./phantamjs.sh
chmod 755 ./pythoninstall.py
chmod 755 ./beforeStart.sh

./pythoninstall.py