# -*- coding: UTF-8 -*-

import re
from pyquery import PyQuery as pq
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from util import chunkIt
import platform
from threading import Thread
import threading
import os
from multiprocessing import Queue
from efficientWorker import EfficientWorker
from novelSqlModel import NovelList, NovelChapter
from flask_app import GetApp
import time
import requests
app, db = GetApp()

class NoverScratch:

  # TODO list
  # 1. write txt
  # 2. multi threat to handle
  # 3. how to write txt. write once or more times. if one time, string would overflow
  #    more times include more txt join on txt or append text in order

  # initial varaiable
  # @param {string} chromeDriver Local Path eg: C:\Program Files (x86)\Google\Chrome\Application\chromedriver 
  def __init__(self, chromeDriverPath):
    # chrome browser
    # defaultChromeDriverPath = 'C:\Program Files (x86)\Google\Chrome\Application\chromedriver'
    # self.browser = webdriver.Chrome(defaultChromeDriverPath)
    # phantomjs
    defaultPhantomjsPath = './phantomjs'
    if platform.system() == 'Linux':
      # specfic path related to phantamjs.sh
      defaultPhantomjsPath = '/usr/local/src/phantomjs/bin/phantomjs'
      self.browser = webdriver.PhantomJS(service_args=['--ignore-ssl-errors=true', '--ssl-protocol=any'])
    else:
      self.browser = webdriver.PhantomJS(executable_path=defaultPhantomjsPath)
    # headless chrome
    # chrome_options = Options()  
    # chrome_options.add_argument('--headless')  
    # self.browser = webdriver.Chrome(chrome_options=chrome_options, executable_path=r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe')
    if chromeDriverPath:
      self.browser = webdriver.Chrome(chromeDriverPath)
    # web driver browser wait timeout
    self.wait = WebDriverWait(self.browser, 10)
    # multi thread lock
    self.threadLock = threading.Lock()
    # Queue
    self.queue = Queue()

  # get novel basic info
  def getNovelInfo (self, doc):
    chapterName = doc('#getNovelId > div.crumbs > a').text()
    novelAuthor = doc('#getNovelId > div.main-left > div.left-cent > div:nth-child(1) > h4').text()
    novelCoverImgUrl = doc('#getNovelId > div.main-left > div.left-top > div.novelimg > img').attr('src')
    novelOrigin = doc('#getNovelId > div.main-left > div.left-top > div.info > h4:nth-child(4) > a > span').text()
    novelOriginUrl = doc('#getNovelId > div.main-left > div.left-top > div.info > h4:nth-child(4) > a').attr('href')
    novelDescription = doc('#getNovelId > div.main-right > div.tab > div.tab-con > div.syn').text().strip()
    ss = novelDescription.encode('utf-8')
    ss = ss.decode()
    novelDescription = ss.replace('\n','')
    novelDescription = novelDescription.replace('"', '')
    # print(novelDescription)
    # novelDescription = 'fantacy'
    novelClass = 'fantacy'
    novelProcess = 'Completed'
    # return chapterName, novelAuthor, novelCoverImgUrl, novelOrigin, novelOriginUrl, novelDescription, novelProcess
    novelItem = NovelList(novel_name=chapterName, novel_author=novelAuthor, novel_cover_img_url=novelCoverImgUrl,novel_origin=novelOrigin, novel_origin_url=novelOriginUrl,novel_desciption=novelDescription,novel_class=novelClass,novel_process=novelProcess)
    db.session.add(novelItem)
    db.session.commit()

  def getEachChapterInfo (self, novelId, chapterName, chapterIndex, chapterText):
    novelChapter = NovelChapter(novel_id=novelId, chapter_name=chapterName, chapter_content=chapterText, chapter_index=chapterIndex)
    print(novelChapter)
    db.session.add(novelChapter)
    db.session.commit()

  # get each chapter link by menu link
  # @param {string} url eg:http:// or https://www.biquyun.com/1_1559/
  # @returns {chapterName} chapterName
  def getEachChapterLink (self, menuUrl):
    # check param validation
    if menuUrl.index('http') > -1 or menuUrl.index('https') > -1:
      # begin browser load
      try:
        self.browser.get(menuUrl)
        self.wait.until(
          EC.presence_of_element_located((By.CSS_SELECTOR, '#getNovelId > div.main-right > div.tab > ul > li:nth-child(2)'))
        )
        self.browser.find_element_by_css_selector('#getNovelId > div.main-right > div.tab > ul > li:nth-child(2) > span').click()
        self.wait.until(
          EC.presence_of_element_located((By.CSS_SELECTOR, '#getNovelId > div.main-right > div.tab > div.contents > div'))
        )
        html = self.browser.page_source
        doc = pq(html)
        chapterName = doc('#getNovelId > div.crumbs > a').text()
        # self.getNovelInfo(doc)
        items = doc('#getNovelId > div.main-right > div.tab > div.contents > div > ul > li > a').items()
        # add each link
        chapterIndex = 0
        for item in items:
          link = item.attr('href')
          # eg /1_1559/952222.html
          # using re to join link TODO
          # current use split to join
          # linkArr = link.split('/')
          # linkSuffix = linkArr[len(linkArr) - 1]
          if chapterIndex < 1:
            self.queue.put('https://www.novelspread.com' + link + '#' + str(chapterIndex))
          chapterIndex = chapterIndex + 1
        return chapterName
      except TimeoutException:
        # todo
        # print('error')
        return ''

  # get specific text by each chapter link
  # @param {string} chapter link eg:https://www.biquyun.com/1_1559/9986611.html
  # @param {chapterName} chapterName
  # @param {thread_id} thread id
  # @returns {string} novel text or other info (TODO)
  def getSpecificTextByChapterLink(self, chapterLink, chapterName, novelId, chapterIndex):
    try:
      self.browser.get(chapterLink)
      time.sleep(10)
      # self.wait.until(
      #   EC.presence_of_element_located((By.CSS_SELECTOR, '#chapter46729 > article > div.content'))
      # )
      html = self.browser.page_source
      doc = pq(html)
      body = self.browser.find_element_by_css_selector("html").attr('innerHTML')
      print(body)
      self.getEachChapterInfo(doc, novelId, chapterIndex)
      # chapterTitle = doc('#wrapper > div.content_read > div > div.bookname > h1').text()

      # chapterText may include chapterTitle 标题写了两遍
      # parse chapterText because chapterText mat like this. eg: &nbsp;&nbsp;&nbsp;&nbsp;第一五二章风雨初平<br>
      # write chaptertext to txt
      # get lock
      # self.threadLock.acquire()
      # self.writeTextToLocalTXT((' \r\n ' + chapterTitle + ' \r\n ' + chapterText).encode('utf-8'), chapterName)
      # # release lock
      # self.threadLock.release()
    except TimeoutException:
      return

  # parse chapterText eg: &nbsp;&nbsp;&nbsp;&nbsp;第一五二章风雨初平<br>
  # @param {string} chapterText to be parsed
  # @param {chapterName} chapterName
  # @returns {array} content after parsing
  def parseChapterContent(self, chapterContent):
    # parse &nbsp; and <br/> by re
    parseContent = re.sub(r'(<br>+)\s*(<br>)*', '<br>\r\n<br>', chapterContent)
    p = re.compile(r'<br>')
    return p.split(parseContent)

  # write content to local txt
  # @params {array} chapterContent array
  # @param {thread_id} thread id
  # @returns {boolean} write success or false
  def writeTextToLocalTXT(self, chapterContent, chapterName):
    file = None
    try:
      # file = open('static/' + chapterName + '_' + str(thread_id) + '.txt', 'ab+')
      file = open('static/' + chapterName  + '.txt', 'ab+')
      if isinstance(chapterContent, list):
        # '\r\n' represent \n normaly
        file.writelines(chapterContent)
      else:
        file.write(chapterContent)
    except IOError:
      file.close()
    finally:
      file.close()

  # join several txt file to one
  # @param {txtFileArr} 
  # @param {savePath} saved txt path
  def joinTxtFile (self, txtFileArr, savePath):
    with open(savePath, 'w') as outfile:
      for fname in txtFileArr:
        with open(fname) as infile:
          outfile.write(infile.read())

  # multi thread to write txt
  # @param {linkArr} linkArr to handle
  # @param {thread_num} thread num
  # @param {chapterName} chapterName
  def multiThreadGetChapter (self, thread_num, chapterName):
    efficientWorker = EfficientWorker(self.batchWriteChapterToTxt, [chapterName], 'thread', 4, 5)
    efficientWorker.start()

  # batch write chapter to txt
  def batchWriteChapterToTxt (self, chapterName):
    while self.queue.empty() != True:
      chanpterLink = self.queue.get()
      print('chanpterLink:', chanpterLink)
      chapterIndexArr = chanpterLink.split('#')
      chapterIndex = chapterIndexArr[len(chapterIndexArr) - 1]
      self.getSpecificTextByChapterLink(chanpterLink, chapterName, 1, int(chapterIndex))

  # write each chapter to txt
  # @param {link} eg.https://www.biquyun.com/1_1559/
  def writeTotalChapterToTxt (self, link):
    # chapterName = self.getEachChapterLink(link)
    self.getSpecificTextByChapterLink('https://www.novelspread.com/chapter/coiling-dragon/c-1-early-morning-at-a-township', 'chapterName', 2, 7)
    thread_num = 5
    try:
      # self.multiThreadGetChapter(thread_num, chapterName)
      # thread_txt = ['static/' + chapterName + '_' + str(i) + '.txt' for i in range(thread_num)]
      # self.joinTxtFile(thread_txt, 'static/' + chapterName + '.txt')
      # for tfile in thread_txt:
      #   if os.path.exists(tfile):
      #     os.remove(tfile)
      return 'chapterName' + '.txt'
    except IOError:
      return -1

  def getNovelSeriesInfo (self, urlArr):
    for url in urlArr:
      self.browser.get(url)
      html = self.browser.page_source
      doc = pq(html)
      self.getNovelInfo(doc)

  def getEachChapterSeriesInfo (self, beginUrl, novel_id, chapter_name):
    index = 0
    while beginUrl and index < 20:
      r = requests.get('https://www.novelspread.com/chapter/' + str(beginUrl))
      data = r.json()
      chapter_content = data['data']['chapter_content'].replace('"', '')
      chapter_title = data['data']['chapter_title']
      self.getEachChapterInfo(novel_id, chapter_title, index, chapter_content)
      index = index + 1
      beginUrl = data['data']['id']

noverScratch = NoverScratch('')
urlArr = [
  'https://www.novelspread.com/novel/battling-records-of-the-chosen-one',
  'https://www.novelspread.com/novel/coiling-dragon',
  'https://www.novelspread.com/novel/the-ultimate-evolution',
  'https://www.novelspread.com/novel/martial-god-asura',
  'https://www.novelspread.com/novel/god-and-devil-world'
]
# urlArr = [
#   'https://www.novelspread.com/novel/battling-records-of-the-chosen-one'
# ]
# noverScratch.getNovelSeriesInfo(urlArr)
noverScratch.getEachChapterSeriesInfo('46729', 2, 'Coiling Dragon')