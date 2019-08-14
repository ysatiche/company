#!/bin/sh
# notice: chomd 755 deploy.sh

# before
sudo apt-get upgrade

# phantomjs
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm -g install phantomjs-prebuilt
sudo apt-get install phantomjs


# install
sudo apt-get install redis rq flask pyquery selenium