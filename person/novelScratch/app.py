from flask import Flask, render_template, request, url_for
app = Flask(__name__)

from rq import Queue
from rq.job import Job
from redis import Redis
import time
from worker import conn, novelScratchByUrl
from flask_sqlalchemy import SQLAlchemy
# create message queue
q = Queue(connection=conn)

app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:chenye8685800@localhost:3306/novel' #这里登陆的是root用户，要填上自己的密码，MySQL的默认端口是3306，填上之前创建的数据库名text1
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True #设置这一项是每次请求结束后都会自动提交数据库中的变动

db = SQLAlchemy(app)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/search', methods=['POST', 'GET'])
def search():
  if request.method == 'POST':
    job = q.enqueue_call(func=novelScratchByUrl, args=(request.form['searchUrl'],), result_ttl=50000)
    while True:
      if job.is_finished:
        chapterName = job.result
        break
    if chapterName != -1:
      url_for('static', filename=chapterName)
  return render_template('index.html', novelName=chapterName)

if __name__ == '__main__':
  app.run(debug=True)