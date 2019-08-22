
# referen: https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-18-04
# https://kafka.apache.org/quickstart
sudo wget https://www-us.apache.org/dist/kafka/2.2.0/kafka_2.12-2.2.0.tgz -O kafka.tgz

tar -xzvf kafka.tgz 
sudo mv ./kafka_2.12-2.2.0 ./kafka

# make user the two path is correct(include novelScratch path & kafka path)
cd ~/company/person/novelScratch/deploy/ubuntu
sudo cp ./mq/kafka/server.properties ~/kafka/config/server.properties

sudo cp ./mq/kafka/zookeeper.service /etc/systemd/system/zookeeper.service

sudo cp ./mq/kafka/kafka.service /etc/systemd/system/kafka.service

sudo systemctl start kafka.service
# To ensure that the server has started successfully, check the journal logs for the kafka unit:
# sudo journalctl -u kafka

#  create a topic named novelLog
sudo ~/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic novelLog
# produce
echo "Hello, World" | ~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic novelLog > /dev/null
# consume
~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic novelLog --from-beginning


# cluster
sudo cp ./mq/kafka/server-1.properties ~/kafka/config/server-1.properties
sudo cp ./mq/kafka/server-2.properties ~/kafka/config/server-2.properties
sudo ~/kafka/bin/kafka-server-start.sh ~/kafka/config/server-1.properties &
sudo ~/kafka/bin/kafka-server-start.sh ~/kafka/config/server-2.properties &
# create topic
sudo ~/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 3 --partitions 1 --topic my-replicated-topic
# see status
sudo ~/kafka/bin/kafka-topics.sh --describe --bootstrap-server localhost:9092 --topic my-replicated-topic
