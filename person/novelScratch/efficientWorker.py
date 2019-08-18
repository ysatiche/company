import platform
from threading import Thread
import threading
import os
import multiprocessing
from multiprocessing import Process

####### TODO ######
# 1. __init__ args optimized

class EfficientWorker:
  def __init__(self, func, args, enabledType, processNum, threadNum):
    # current cpu cores
    self.cores = multiprocessing.cpu_count()
    # enabledType: 'process', 'thread', 'both'
    self.enabledType = enabledType
    # target functin
    self.func = func
    # target function args
    self.args = args
    # process num default set to cores num
    self.processNum = self.cores
    # thread num default set to three
    self.threadNum = 3
    # set custom value
    if self.enabledType != 'thread':
      self.processNum = processNum
    if self.enabledType != 'process':
      self.threadNum = threadNum
    self.taskQueue = taskQueue

  def _initMultiProcess(self, processNum, func, args):
    for _ in range(processNum)
      p = Process(target=func, args=(*args,))
      p.start()
      p.join()

  def _initMultiThread(self, threadNum, func, args):
    for _ in range(threadNum):
      th = Thread(target=func, args=(*args,))
      th.start()
      th.join()

  def _initMultiProcessAndThred(self):
    self._initMultiProcess(self.processNum, self._initMultiThread, [self.threadNum, self.func, self.args])

  def start():
    if self.enabledType == 'thread':
      self._initMultiThread(self.threadNum, self.func, self.args)
    if self.enabledType == 'process':
      self._initMultiProcess(self.processNum, self.func, self.args)
    if self.enabledType == 'both':
        self._initMultiProcessAndThred()
      

    
