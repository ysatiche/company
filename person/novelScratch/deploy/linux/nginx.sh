#!/bin/sh

# todo 
sudo yum install nginx -y

cd ~/company/person/novelScratch/deploy
# basePath current /company/person/novelScratch
sudo mv ./flask-novelScratch.conf /etc/nginx/conf.d/flask-novelScratch.conf

# centos6
# sudo service nginx reload

# centos7
systemctl start nginx