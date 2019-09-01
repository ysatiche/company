sudo apt install golang -y


# 编辑/etc/profile文件，添加到末尾：
# export GOROOT=/usr/local/go
# export GOPATH=$HOME/go
# export PATH=$PATH:$GOROOT/bin
#保存后，使用命令 source /etc/profile生效。

#安装go后，默认会使用$HOME/go为工作目录，也可以手动指定目录，设置GOPATH为定义目录。为当前用户配置环境变量，编辑.bashrc或者.profile，添加：
# chmod 755 -R $HOME/go
