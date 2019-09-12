from flask import Flask, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy

def GetApp():
  app = Flask(__name__)
  app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:chenye1234@localhost:3306/novel' #这里登陆的是root用户，要填上自己的密码，MySQL的默认端口是3306，填上之前创建的数据库名text1
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True #设置这一项是每次请求结束后都会自动提交数据库中的变动
  db = SQLAlchemy(app)
  return app, db