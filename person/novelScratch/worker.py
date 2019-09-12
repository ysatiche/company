import redis
from rq import Worker, Queue, Connection
from noverScratch import NoverScratch

listen = ['default']

conn = redis.from_url('redis://@localhost:6379/1')

# @route('/search) handler
# @param {url} url
def novelScratchByUrl (url):
  noverScratch = NoverScratch('')
  return noverScratch.writeTotalChapterToTxt(url)

if __name__ == '__main__':
  with Connection(conn):
    worker = Worker(list(map(Queue, listen)))
    worker.work()
