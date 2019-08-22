echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -


sudo apt install rabbitmq-server -y

sudo systemctl start rabbitmq-server

# add admin user
sudo rabbitmqctl add_user admin password 
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# enable rabbitmq managerment default http://localhost:15672/
# sudo rabbitmq-plugins enable rabbitmq_management