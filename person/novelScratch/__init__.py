from flask import Flask, render_template, request, url_for
app = Flask(__name__)
from noverScratch import NoverScratch
from rq import Queue
from rq.job import Job
from redis import Redis
import time
from worker import conn

# create message queue
q = Queue(connection=conn)

# test function for message queue
def testSearch():
  # time.sleep(1)
  return '1'
  

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/search', methods=['POST', 'GET'])
def search():
  if request.method == 'POST':
    job = q.enqueue_call(func=testSearch)
    print(job.result)
    time.sleep(4)
    print(job.result)
    # return job.result
  #   noverScratch = NoverScratch('')
  #   chapterName = noverScratch.writeTotalChapterToTxt(request.form['searchUrl'])
  #   if chapterName != -1:
  #     url_for('static', filename=chapterName)
  return render_template('index.html', novelName='chapterName')

if __name__ == '__main__':
  app.run(debug=True)