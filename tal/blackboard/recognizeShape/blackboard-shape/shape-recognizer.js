const csv = require('csvtojson')
const brain = require('brain.js')
const fs = require('fs')
// const { dataSerialize } = require('../common/utils.js')

// const fs = require('fs-extra')
const path = require('path')
// const deskPath = diskConfig.deskPath.value()
const csvFilePath = './dataset.csv'

function dataSerialize(arr) {
  if (arr.length < 1) return
  let maxVal = Math.max.apply(null,arr)
  let minVal = Math.min.apply(null,arr)
  let res = []
  arr.forEach(item => {
    res.push((item - minVal) / (maxVal - minVal))
  })
  return res
}

function formatData (jsonObj) {
  let inputArr = []
  for (let i = 0; i < jsonObj.length; i++) {
    let obj = jsonObj[i]
    let tmpInput = dataSerialize([obj.x1, obj.y1, obj.x2, obj.y2, obj.x3, obj.y3, obj.x4, obj.y4, obj.x5, obj.y5, obj.x6, obj.y6, obj.x7, obj.y7, obj.x8, obj.y8, obj.x9, obj.y9, obj.x10, obj.y10,
      obj.x11, obj.y11, obj.x12, obj.y12, obj.x13, obj.y13, obj.x14, obj.y14, obj.x15, obj.y15, obj.x16, obj.y16, obj.x17, obj.y17, obj.x18, obj.y18, obj.x19, obj.y19, obj.x20, obj.y20,
      obj.x21, obj.y21, obj.x22, obj.y22, obj.x23, obj.y23, obj.x24, obj.y24, obj.x25, obj.y25, obj.x26, obj.y26, obj.x27, obj.y27, obj.x28, obj.y28, obj.x29, obj.y29, obj.x30, obj.y30,
      obj.x31, obj.y31, obj.x32, obj.y32, obj.x33, obj.y33, obj.x34, obj.y34, obj.x35, obj.y35, obj.x36, obj.y36, obj.x37, obj.y37, obj.x38, obj.y38, obj.x39, obj.y39, obj.x40, obj.y40,
      obj.x41, obj.y41, obj.x42, obj.y42, obj.x43, obj.y43, obj.x44, obj.y44, obj.x45, obj.y45, obj.x46, obj.y46, obj.x47, obj.y47, obj.x48, obj.y48, obj.x49, obj.y49, obj.x50, obj.y50])
    let inputObj = {
      input: tmpInput,
      output: [obj.shape === 'circle' ? 1 : 0]
    }
    inputArr.push(inputObj)
  }
  return inputArr
}

class AutoShapeRecognizer {
  constructor () {
    this.net = new brain.NeuralNetwork()
  }

  train () {
    // console.warn('train begin:', csvFilePath)
    // const jsonArray= await csv().fromFile(csvFilePath)
    // console.warn(jsonArray.length)
    // const inputArr = formatData(jsonObj)
    // this.net.train(inputArr)
    // return this.net
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
      const net = new brain.NeuralNetwork();
      const inputArr = formatData(jsonObj)
      net.train(inputArr)
      // var circle_data = [17.868686868686865,-1.8181818181818183,8.799669891860676,10.499092548728104,-5.654898934200974,5.49631763790665,-5.654898934200974,-9.132681274270283,8.799669891860676,-14.13545618509174,17.868686868686865,-1.8181818181818215]
      // var output1 = net.run(dataSerialize(circle_data))
      // var no_circle_data = [13.044421425081515,-5.719335850166538,-28.937862012852598,52.09801476574415,11.408391212145764,-38.86886014612225,-12.874243591584161,-26.45072170976762,84.49595061077235,-5.912032327963885,13.04442142508152,-5.719335850166541]
      // var output2 = net.run(dataSerialize(no_circle_data))
      // console.log(output1)
      // console.log(output2)
      var json = net.toJSON()
      fs.writeFile('myjsonfile.json', JSON.stringify(json), 'utf8', function () {})
      console.log(json)
    })
  }

  predict (arr) {
    // console.warn(this.net.run(dataSerialize([17.868686868686865,-1.8181818181818183,8.799669891860676,10.499092548728104,-5.654898934200974,5.49631763790665,-5.654898934200974,-9.132681274270283,8.799669891860676,-14.13545618509174,17.868686868686865,-1.8181818181818215])))
    // console.warn(arr)
    console.warn(this.net.run(dataSerialize(arr)))
    return this.net.run(dataSerialize(arr))
  }

  initByJson () {
    // const filename = path.resolve(deskPath, './myjsonfile.json')
    // const filename = path.resolve('./', './myjsonfile.json')
    // var obj = JSON.parse(fs.readFileSync(filename, 'utf8'))
    // this.net.fromJSON(obj)
    // return this.net
    // console.warn(this.net.run(dataSerialize([17.868686868686865,-1.8181818181818183,8.799669891860676,10.499092548728104,-5.654898934200974,5.49631763790665,-5.654898934200974,-9.132681274270283,8.799669891860676,-14.13545618509174,17.868686868686865,-1.8181818181818215])))
    // console.warn(arr)
  }
}
const shapeRecognizer = new AutoShapeRecognizer()
shapeRecognizer.train()
// shapeRecognizer.initByJson('./myjsonfile.json')
// export default AutoShapeRecognizer
