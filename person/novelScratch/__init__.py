from flask import Flask, render_template, request, url_for
app = Flask(__name__)

from rq import Queue
from rq.job import Job
from redis import Redis
import time
from worker import conn, novelScratchByUrl

# create message queue
q = Queue(connection=conn)
  

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