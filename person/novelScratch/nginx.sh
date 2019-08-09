#!/bin/sh

# todo 
sudo yum install nginx -y

cd ~/company/person/novelScratch
# basePath current /company/person/novelScratch
sudo mv ./flask-novelScratch.conf /etc/nginx/conf.d/flask-novelScratch.conf

sudo service nginx reload