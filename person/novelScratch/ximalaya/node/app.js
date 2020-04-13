const Koa = require('koa')
const app = new Koa()
const https = require('https')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
let urlMap = new Map()
let titleArr = []
// todo 修改起始页 终止页
let startPageNum = 2
let endPageNum = 30
let savedNum = 0
const savedOnce = 30 * (endPageNum - startPageNum + 1)
let failDownloadUrl = []
let timer = null
let sequenceArr = []
// 喜马拉雅小说监听 chrome脚本点击 -> Fiddler -> koa监听 -> download 音频
app.use(async (ctx) => {
    let url = "https://audiopay.cos.xmcdn.com" + ctx.url
    console.log(`[get url] ${url}`)
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
    // 保存url和title到本地json
    let savedData = []
    if (sequenceArr.length >= savedOnce) {
      for (let i = 0; i < sequenceArr.length; i++) {
        savedData.push({
          url: urlMap.get(sequenceArr[i]),
          title: `${titleArr[i]}.m4a`,
          idx: i
        })
      }
      await writeToLocalData('./test1.json', savedData)
    }
    // console.log(`[sequenceArr] ${sequenceArr.length}`)
    // 设置定时器，模拟消息转发
    // if (!timer) {
    //   timer = setInterval(() => {
    //     downloadAudioSync()
    //   }, 20 * 1000)
    // }
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

// 同步下载每个音频
async function downloadAudioSync () {
  console.log(`[start download audio] [sequence.len] ${sequenceArr.length}`)
  let len = sequenceArr.length
  for (let i = 0; i < len; i++) {
    // console.log(`[downloadAudioSync] 第${i+1}个音频`)
    if (urlMap.get(sequenceArr[i])) {
      await saveEachAudio(i)
    }
    if (i === savedOnce - 1) {
      console.log(`【需下载数量】 ${savedOnce} 【已下载数量】 ${savedNum}`)
      if (failDownloadUrl.length > 0) {
        console.log(`[下载完成] 【失败章节】 ${failDownloadUrl.join('//')}`)
      } else {
        // console.timeEnd('downloadfile')
        console.log(`[所有音频下载成功]`)
      }
    }
  }
}

function writeToLocalData (filePath, jsonData) {
  return new Promise((resolve, reject) => {
    // 存在的话暂时先不删除
    // if (fs.pathExistsSync(filePath)) {
      // resolve(true)
      // fs.unlinkSync(filePath)
    // }
    const json= JSON.stringify(jsonData, null, "\t")
    fs.writeFile(filePath, json, (err) => {
      console.log('write file err:', err)
      if (err) {
        // throw new Error('写入文件失败')
        reject(false)
      }
      resolve(true)
    })
  })
}

function saveEachAudio (i) {
  return new Promise((resolve) => {
    let key = sequenceArr[i]
    let pageNum = parseInt(i / 30) + startPageNum
    let dirPath = `./downloads/${pageNum}`
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    let savedPath = path.join(__dirname,`${dirPath}/${titleArr[i]}.m4a`)
    const file = fs.createWriteStream(savedPath)
    // if (fs.existsSync(savedPath)) {
    //   fs.unlinkSync(savedPath)
    // }
    console.log(`[start savedPath] ${savedPath}`)
    const downloadUrl = urlMap.get(key)
    urlMap.set(key, false)
    // download audio as local file by url
    https.get(downloadUrl, function(response) {
      response.pipe(file)
      file.on('finish', function() {
        savedNum++
        console.log(`[save file success] ${titleArr[i]}.m4a`)
        file.close()
        resolve(true)
      })
      file.on('error', function () {
        console.log(`[save file fail] ${titleArr[i]}.m4a`)
        failDownloadUrl.push(`${titleArr[i]}`)
        file.close()
        resolve(false)
      })
    }).on('error', function(err) {
      console.log(`[save file fail] ${titleArr[i]}.m4a`)
      failDownloadUrl.push(`${titleArr[i]}`)
      if (fs.existsSync(savedPath)) {
        fs.unlinkSync(savedPath)
      }
      resolve(false)
    })
  })
}

// 获取每一页章节名字
async function getEachChapterByPage(num) {
  const res = await axios.get('https://www.ximalaya.com/revision/album/v1/getTracksList', {
	    params: {
	      albumId: '3416829',
	      pageNum: parseInt(num)
	    }
	  })
  if (!res || !res.data) return []
  let arr = []
  if (res.data && res.data.data && res.data.data.tracks) {
    res.data.data.tracks.forEach(track => {
      arr.push(track.title)
    })
  }
  return arr
}

// 获取 startPageNum 和 endPageNum 中所有的章节名字
async function getAllChapterName (start, end) {
  for (let i = start; i <= end; i++) {
    const res = await getEachChapterByPage(i)
    titleArr = titleArr.concat(res)
  }
}
getAllChapterName(startPageNum, endPageNum)
app.listen(3000)



// function downloadAudio () {
//   if (!timer) return
//   let downloads = 0
//   console.log('downloadAudio', sequenceArr.length)
//   for (let i = 0; i < sequenceArr.length; i++) {
//     // console.log(`downloadAudio url: ${sequenceArr[i]}`)
//     let key = sequenceArr[i]
//     if (!sequenceArr[i] || !titleArr[i] || !urlMap.get(key) || (downloads >= downloadMax)) continue
//     let pageNum = parseInt(i / 30) + startPageNum
//     let dirPath = `./downloads/${pageNum}`
//     if (!fs.existsSync(dirPath)) {
//       fs.mkdirSync(dirPath)
//     }
//     let savedPath = path.join(__dirname,`${dirPath}/${titleArr[i]}.m4a`)
//     // if (fs.existsSync(savedPath)) {
//     //   fs.unlinkSync(savedPath)
//     // }
//     console.log(`[savedPath] ${savedPath}`)
//     const downloadUrl = urlMap.get(key)
//     // download audio as local file by url
//     https.get(downloadUrl, function(response) {
//       response.pipe(file)
//       file.on('finish', function() {
//         sequenceArr[i] = null
//         // urlMap.set(key, false) // 说明已经再下载行列了
//         console.log(`[save file] ${titleArr[i]}.m4a`)
//         savedNum++
//         if (savedNum >= savedOnce) {
//           clearInterval(timer)
//           timer = null
//           console.log('Saved All Done')
//         }
//         file.close();
//       })
//     }).on('error', function(err) {
//       if (fs.existsSync(savedPath)) {
//         fs.unlinkSync(savedPath)
//       }
//     })
//   }
// }