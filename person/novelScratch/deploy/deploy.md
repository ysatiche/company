prepare for starting.

# ubuntu 18

# elastic usefule api

> reference

https://www.journaldev.com/27193/install-elasticsearch-logstash-kibana-elastic-stack-ubuntu#7-testing-elasticsearch-stack

https://devconnected.com/how-to-install-logstash-on-ubuntu-18-04-and-debian-9/#1_Install_the_latest_version_of_Java

https://www.cnblogs.com/cjsblog/p/9459781.html

> start elastic

way1:
sudo systemctl enable/start/stop/restart/status logstash.service

way2:
eg:logstash -> sudo /usr/share/logstash/bin/logstash -f /etc/logstash/conf.d/pipeline.conf
eg:filebeat -> sudo /usr/share/filebeat/bin/filebeat -e -c /etc/filebeat/filebeat.yml

> delete elasticsearch data

curl -X DELETE 'http://localhost:9200/_all'

> show all elasticsearch indexes

curl 'localhost:9200/_cat/indices?v'

> search data by index

curl -X GET 'localhost:9200/${index}/_search?pretty&q=response=200'

> others

whereis -b logstash 

to show each module installed and started successfully. you can just type this:
curl -XGET 'http://localhost:${modulePort}?pretty' eg: curl -XGET 'http://localhost:9200?pretty'


### ubuntu18 create new user

> sudo useradd chenye -m

> sudo passwd chenye

> sudo adduser chenye sudo

# linux

