# -*- coding: UTF-8 -*-
# github上已有的下载喜马拉雅音频 python程序，运行不同，仅作参考

import re
from pyquery import PyQuery as pq
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities 
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from util import chunkIt
import platform
from threading import Thread
import threading
import os
import sys
import hashlib
import json
import math
import random
import time
import requests
from scapy.layers.inet import TCP
from scapy.all import sniff
from scapy_http import http
from multiprocessing import Queue
from browsermobproxy import Server


class XmScratch:

  # TODO list
  # 1. write txt
  # 2. multi threat to handle
  # 3. how to write txt. write once or more times. if one time, string would overflow
  #    more times include more txt join on txt or append text in order

  # initial varaiable
  # @param {string} chromeDriver Local Path eg: C:\Program Files (x86)\Google\Chrome\Application\chromedriver 
  def __init__(self):
    # chrome browser
    # defaultChromeDriverPath = 'C:\Program Files (x86)\Google\Chrome\Application\chromedriver'
    # self.browser = webdriver.Chrome(defaultChromeDriverPath)
    # phantomjs
    # defaultPhantomjsPath = './phantomjs'
    # if platform.system() == 'Linux':
    #   # specfic path related to phantamjs.sh
    #   defaultPhantomjsPath = '/usr/local/src/phantomjs/bin/phantomjs'
    #   self.browser = webdriver.PhantomJS(service_args=['--ignore-ssl-errors=true', '--ssl-protocol=any'])
    # else:
    #   self.browser = webdriver.PhantomJS(executable_path=defaultPhantomjsPath)
    # headless chrome
    chrome_options = Options()  
    # chrome_options.add_argument('--headless')
    chromedriver = "C:\chromedrive.exe"
    self.browser = webdriver.Chrome(options=chrome_options, executable_path=chromedriver)
    # if chromeDriverPath:
    #   self.browser = webdriver.Chrome(chromeDriverPath)
    # web driver browser wait timeout
    self.wait = WebDriverWait(self.browser, 10)
    # multi thread lock
    self.threadLock = threading.Lock()
    # Queue
    self.queue = Queue()
    self.base_url = 'https://www.ximalaya.com'
    # 有声书
    self.yss_api = 'https://www.ximalaya.com/youshengshu/{}/{}'
    # 需要带上sign访问的api，适用于免费的音频的播放源
    self.free_sign_api = 'https://www.ximalaya.com/revision/play/album?albumId={}&pageNum={}&sort=0&pageSize=30'
    # 获取单个免费音频api （trackId）
    self.free_track_api = 'http://mobile.ximalaya.com/mobile/redirect/free/play/{}/2'
    # 时间戳api
    self.time_api = 'https://www.ximalaya.com/revision/time'
    # 获取节目总音源个数与节目名
    self.album_api = 'https://www.ximalaya.com/revision/album?albumId={}'
    # 获取指定albumID的每一页音频的ID等track信息
    self.album_tracks_api = 'https://www.ximalaya.com/revision/album/v1/getTracksList?albumId={}&pageNum={}'
    # APP抓包得到，可用于获取付费节目总音源个数与节目名，获取音集所有音频ID，通过改变pageSize的大小，（albumId, pageSize）
    # 2020-02-29 最新测试pageSize最大为1000，所以针对章节大的有声书修改规则
    self.pay_size_api = 'http://180.153.255.6/mobile-album/album/page/ts-1569206246849?ac=WIFI&albumId={}' \
                        '&device=android&isAsc=true&isQueryInvitationBrand=true&isVideoAsc=true&pageId=1' \
                        '&pageSize={}'
    self.header = {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0'
    }
    self.s = requests.session()
    self.folder_path = 'C:\\Users\\cheryl\\Desktop\\test\\downloads\\3416829'
    self.token = '72241B5B98924AA098C2AAF8EFEB5377NdV36BEEEAA57083D3E53C15E0E933FA800AD7BD0B9A0B59163B2783BF047EB200D'
    self.xm_id = '3416829'
    self.get_pay_fm(self.xm_id, self.folder_path, self.token)

  def get_fm(self, xm_fm_id, path):
    """
    根据albumID解析 免费 fm信息
    """
    # 根据有声书ID构造url
    r_fm_url = self.s.get(self.album_api.format(xm_fm_id), headers=self.header)
    r_fm_json = json.loads(r_fm_url.text)
    fm_title = r_fm_json['data']['mainInfo']['albumTitle']
    fm_count = r_fm_json['data']['tracksInfo']['trackTotalCount']
    fm_page_size = r_fm_json['data']['tracksInfo']['pageSize']
    print('书名：' + fm_title)
    # 新建有声书ID的文件夹
    fm_path = self.make_dir(xm_fm_id, path)
    print(fm_path)
    # 取最大页数，向上取整
    max_page = math.ceil(fm_count/fm_page_size)
    return fm_count, fm_path, max_page
  
  def make_dir(self, xm_fm_id, path):
    """
    保存路径，请自行修改，这里是以有声书ID作为文件夹的路径
    """
    fm_path = path + '\\' + xm_fm_id
    if str(path).endswith('\\'):
        fm_path = path + xm_fm_id
    f = os.path.exists(fm_path)
    if not f:
        os.makedirs(fm_path)
        print('make file success...')
    else:
        print('file already exists...')
    return fm_path
  
  def save_fm2local(self, title, src, path):
    """
    保存音频到本地
    :param title:
    :param src:
    :param path:
    """
    r_audio_src = requests.get(src, headers=self.header)
    m4a_path = path + '\\' + title + '.m4a'
    if not os.path.exists(m4a_path):
      with open(m4a_path, 'wb') as f:
        f.write(r_audio_src.content)
        print(title + '保存完毕...')
    else:
      print(title + '.m4a 已存在')
  
  def get_pay_album(self, xm_fm_id, page_num):
    """
    获取付费的音频的播放源信息
    :param xm_fm_id:
    :param max_page:
    :return: response
    """
    response = self.s.get(self.album_tracks_api.format(xm_fm_id, page_num), headers=self.header)
    return response

  def auto_click(self, url, token):
    """
    参数url为对应的VIP音频的播放页面，selenium访问页面后，带上cookie（1&_token）模拟登陆再次访问，前提你已经是会员
    等待页面加载完成，通过selenium+Chromedriver的无头浏览器模拟点击音频播放按钮
    scapy开始抓点击后音频真实地址的数据包，退出browser，解析包
    注意click与抓包的顺序，先点击再抓包
    """
    # chrome_options = Options()
    # chrome_options.add_argument('--headless')
    # chrome_options.add_argument('--disable-gpu')
    self.browser.get(url)
    self.browser.add_cookie({
        # 此处xxx.com前，需要带点，注意domain也是cookie必须的
        'domain': '.ximalaya.com',
        'name': '1&_token',
        'value': token,
    })
    self.browser.get(url)
    time.sleep(4)
    # print_text('开始抓包')
    # selenium 点击播放按钮
    self.browser.find_element_by_css_selector(".play-btn.fR_").click()
    # 下面的iface是电脑网卡的名称 count是捕获报文的数目
    pkts = sniff(filter="tcp and port 80", iface="Qualcomm Atheros AR956x Wireless Network Adapter", count=5)
    self.browser.quit()
    for pkt in pkts:
      if TCP in pkt and pkt.haslayer(http.HTTPRequest):
        http_header = pkt[http.HTTPRequest].fields
        req_url = 'http://' + bytes.decode(http_header['Host']) + bytes.decode(http_header['Path'])
        return req_url
    
  def get_pay_fm(self, xm_fm_id, path, token):
    fm_count, fm_path, max_page = self.get_fm(xm_fm_id, path)
    if max_page:
      # 这里应该是 fm_count
      for p in range(1, int(max_page) + 1):
        r = self.get_pay_album(xm_fm_id, p)
        r_json = json.loads(r.text)
        tracks = r_json['data']['tracks']
        for i, track in enumerate(tracks):
          audio_id = track['trackId']
          audio_title = str(track['title']).replace(' ', '')
          audio_url = self.base_url + track['url']
          print(str(audio_title + '' + audio_url))
          real_url = self.auto_click(audio_url, token)
          print('real_url:')
          print(real_url)
          self.save_fm2local(audio_title, real_url, fm_path)
          # 每爬取1页，30个音频，休眠1~3秒
          time.sleep(random.randint(1, 3))
    else:
      print('no max_page')

xmScratch = XmScratch()
# env_dist = os.environ # environ是在os.py中定义的一个dict environ = {}

# # 打印所有环境变量，遍历字典
# for key in env_dist:
#   print(key + ' : ' + env_dist[key])
