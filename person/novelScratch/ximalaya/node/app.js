const Koa = require('koa')
const app = new Koa()
const https = require('https')
const fs = require('fs')
const path = require('path')
let urlMap = new Map()
let sequenceArr = []
let titleArr = ["赘婿第85章：两样东西", "赘婿第86章：算", "赘婿第87章：称呼", "赘婿第88章：窗户纸", "赘婿第89章：星星点灯", "赘婿第90章：小婵", "赘婿第91章：冬柱", "赘婿第92章：白眼狼", "赘婿第93章：警告（上）", "赘婿第94章：警告（下）", "赘婿第95章：历史与登徒子", "赘婿第96章：时局（上）", "赘婿第97章：时局（中）", "赘婿第98章：时局（下）", "赘婿第99章：儒（家里一直断网没办法网吧传的）", "赘婿第100章：苏檀儿的一天（上）", "赘婿第101章：苏檀儿的一天（下）", "赘婿第102章：浴室", "赘婿第103章：小心眼", "赘婿第104章：艳翠楼的偶遇", "赘婿第105章：微笑", "赘婿第106章：绕梁（上）", "赘婿第107章：绕梁（下）", "赘婿第108章：添乱", "赘婿第109章：想做便去做了", "赘婿第110章：拜师", "赘婿第111章：围城", "赘婿第112章：连环", "赘婿第113章：危局（上）", "赘婿第114章：危局（下）"]
let savedNum = 0
const savedOnce = 30
let timer = null
// 喜马拉雅小说监听 chrome脚本点击 -> Fiddler -> koa监听 -> download 音频
app.use((ctx) => {
    let url = "https://audiopay.cos.xmcdn.com" + ctx.url
    console.log(`[pass url] ${url}`)
    let preUrlArr = url.split('?')[0].split('/')
    let urlKey = preUrlArr[preUrlArr.length - 1]
    if (urlKey.indexOf('.m4a') < 0) {
      return
    }
    urlMap.set(urlKey, url)
    if (sequenceArr.indexOf(urlKey) < 0) {
      sequenceArr.push(urlKey)
    } else {
      return
    }
    console.log(`[sequenceArr] ${sequenceArr.length}`)
    // 设置定时器，模拟消息转发
    timer = setInterval(() => {
      downloadAudio()
    }, 70 * 1000)
    // 从上下文的request对象中获取
    let request = ctx.request
    let req_query = request.query
    let req_querystring = request.querystring
  
    // 从上下文中直接获取
    let ctx_query = ctx.query
    let ctx_querystring = ctx.querystring
    // console.log(url)
    ctx.body = {
      url,
      req_query,
      req_querystring,
      ctx_query,
      ctx_querystring
    }
})

function downloadAudio () {
  if (!timer) return
  console.log('downloadAudio', sequenceArr.length)
  for (let i = 0; i < sequenceArr.length; i++) {
    // console.log(`downloadAudio url: ${sequenceArr[i]}`)
    if (!sequenceArr[i]) continue
    let key = sequenceArr[i]
    let savedPath = path.join(__dirname,`./downloads/${titleArr[i]}.m4a`)
    console.log(`[savedPath] ${savedPath}`)
    const file = fs.createWriteStream(savedPath)
    const downloadUrl = urlMap.get(key)
    // download audio as local file by url
    https.get(downloadUrl, function(response) {
      response.pipe(file)
      sequenceArr[i] = null
      savedNum++
      if (savedNum >= savedOnce) {
        clearInterval(timer)
        timer = null
        console.log('Saved All Done')
      }
    })
  }
}

app.listen(3000)
