# -*- coding: UTF-8 -*-

import re
from pyquery import PyQuery as pq
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

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
    defaultChromeDriverPath = 'C:\Program Files (x86)\Google\Chrome\Application\chromedriver'
    self.browser = webdriver.Chrome(defaultChromeDriverPath)
    # headless chrome
    # chrome_options = Options()  
    # chrome_options.add_argument('--headless')  
    # self.browser = webdriver.Chrome(chrome_options=chrome_options, executable_path=r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe')
    if chromeDriverPath:
      self.browser = webdriver.Chrome(chromeDriverPath)
    # web driver browser wait timeout
    self.wait = WebDriverWait(self.browser, 10)
    

  # get each chapter link by menu link
  # @param {string} url eg:http:// or https://www.biquyun.com/1_1559/
  # @returns {array} each chapter link Array
  def getEachChapterLink (self, menuUrl):
    # check param validation
    if menuUrl.index('http') > -1 or menuUrl.index('https') > -1:
      # begin browser load
      try:
        self.browser.get(menuUrl)
        # add chapter link when content load
        chapterList = self.wait.until(
          EC.presence_of_element_located((By.CSS_SELECTOR, '#list'))
        )
        html = self.browser.page_source
        doc = pq(html)
        items = doc('#list > dl > dd > a').items()
        chapterLinkArr = []
        # add each link
        for item in items:
          link = item.attr('href')
          # eg /1_1559/952222.html
          # using re to join link TODO
          # current use split to join
          linkArr = link.split('/')
          linkSuffix = linkArr[len(linkArr) - 1]
          chapterLinkArr.append(menuUrl + linkSuffix)
        return chapterLinkArr
      except TimeoutException:
        # todo
        print('error')
        return

  # get specific text by each chapter link
  # @param {string} chapter link eg:https://www.biquyun.com/1_1559/9986611.html
  # @returns {string} novel text or other info (TODO)
  def getSpecificTextByChapterLink(self, chapterLink):
    try:
      self.browser.get(chapterLink)
      chapterContent = self.wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '#content'))
      )
      html = self.browser.page_source
      doc = pq(html)
      chapterTitle = doc('#wrapper > div.content_read > div > div.bookname > h1').text()
      chapterText = doc('#content').text()
      # chapterText may include chapterTitle 标题写了两遍
      # parse chapterText because chapterText mat like this. eg: &nbsp;&nbsp;&nbsp;&nbsp;第一五二章风雨初平<br>

      # write chaptertext to txt
      self.writeTextToLocalTXT((' \r\n ' + chapterTitle + ' \r\n ' + chapterText).encode('utf-8'))

    except TimeoutException:
      return

  # parse chapterText eg: &nbsp;&nbsp;&nbsp;&nbsp;第一五二章风雨初平<br>
  # @param {string} chapterText to be parsed
  # @returns {array} content after parsing
  def parseChapterContent(self, chapterContent):
    # parse &nbsp; and <br/> by re
    parseContent = re.sub(r'(<br>+)\s*(<br>)*', '<br>\r\n<br>', chapterContent)
    p = re.compile(r'<br>')
    return p.split(parseContent)

  # write content to local txt
  # @params {array} chapterContent array
  # @returns {boolean} write success or false
  def writeTextToLocalTXT(self, chapterContent):
    file = None
    try:
      file = open('test.txt', 'ab+')
      if isinstance(chapterContent, list):
        # '\r\n' represent \n normaly
        file.writelines(chapterContent)
      else:
        file.write(chapterContent)
    except IOError:
      file.close()
    finally:
      file.close()



if __name__ == '__main__':
  noverScratch = NoverScratch('')
  linkArr = noverScratch.getEachChapterLink('https://www.biquyun.com/1_1559/')
  i = 0
  for link in linkArr:
    # if i < 5:
    noverScratch.getSpecificTextByChapterLink(link)
    # i = i + 1
  





