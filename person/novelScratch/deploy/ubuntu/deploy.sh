#!/bin/sh
# notice: chomd 755 deploy.sh

# before
sudo apt-get update
sudo apt-get upgrade
sudo apt update
sudo apt upgrade
# in ubuntu18 already have python3.6, just install pip3
sudo apt install python3-pip

# git clone pro
sudo apt install git
git clone https://github.com/Onenotmind/company.git



# phantomjs
sudo apt-get install nodejs -y
sudo apt-get install npm -y
sudo npm -g install phantomjs-prebuilt -y
sudo apt-get install phantomjs -y


# install elastic products includes(logstash, elastic search, filebeat, kibana)
# common prepare
sudo apt install default-jre -y
# Add the GPG key to install signed packages
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list

# install elastic
sudo apt install logstash
sudo apt install filebeat
sudo apt install elasticsearch
sudo apt install kibana

# copy conf file
cd ~/company/person/novelScratch/deploy/ubuntu
sudo cp ./elasticLightConfig/pipeline.conf /etc/logstash/conf.d/pipeline.conf
sudo cp ./elasticLightConfig/filebeat.yml /etc/filebeat/filebeat.yml
sudo cp ./elasticLightConfig/kibana.yml /etc/kibana/kibana.yml
sudo systemctl start logstash.service
sudo systemctl start filebeat.service
sudo systemctl start elasticsearch.service
sudo systemctl start kibana.service

# create ssl (not neccecary)
# mkdir -p /etc/logstash/ssl
# cd /etc/logstash/
# openssl req -subj '/CN=elk-master/' -x509 -days 3650 -batch -nodes -newkey rsa:2048 -keyout ssl/logstash-forwarder.key -out ssl/logstash-forwarder.crt

# nginx
sudo apt install nginx -y
cd ~/company/person/novelScratch/deploy/ubuntu
sudo cp ./flask-novelScratch.conf /etc/nginx/conf.d/flask-novelScratch.conf
systemctl start nginx
# enable nginx log 
sudo filebeat modules enable nginx
# add nginx log for filebeat
# cd /var/log/nginx
# sudo wget http://igm.univ-mlv.fr/~cherrier/download/L1/access.log
# wget https://raw.githubusercontent.com/respondcreate/nginx-access-log-frequency/master/example-access.log

# install redis
sudo apt install redis-server
sudo systemctl start redis-server.service

# install
cd ~/company/person/novelScratch
sudo pip3 install redis rq flask pyquery selenium kafka-python