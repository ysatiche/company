const csv=require('csvtojson')
const brain = require('brain.js')
const { dataSerialize } = require('./utils/utils.js')
const csvFilePath='../dataset.csv'
// const net = new brain.NeuralNetwork();

function formatData (jsonObj) {
  let inputArr = []
  for (let i = 0; i < jsonObj.length; i++) {
    let obj = jsonObj[i]
    let tmpInput = dataSerialize([obj.x1, obj.y1, obj.x2, obj.y2, obj.x3, obj.y3, obj.x4, obj.y4, obj.x5, obj.y5, obj.x6, obj.y6])
    let inputObj = {
      input: tmpInput,
      output: [obj.shape === 'circle' ? 1 : 0]
    }
    inputArr.push(inputObj)
  }
  return inputArr
}

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
  const net = new brain.NeuralNetwork();
  const inputArr = formatData(jsonObj)
  net.train(inputArr)
  var circle_data = [17.868686868686865,-1.8181818181818183,8.799669891860676,10.499092548728104,-5.654898934200974,5.49631763790665,-5.654898934200974,-9.132681274270283,8.799669891860676,-14.13545618509174,17.868686868686865,-1.8181818181818215]
  var output1 = net.run(dataSerialize(circle_data))
  var no_circle_data = [13.044421425081515,-5.719335850166538,-28.937862012852598,52.09801476574415,11.408391212145764,-38.86886014612225,-12.874243591584161,-26.45072170976762,84.49595061077235,-5.912032327963885,13.04442142508152,-5.719335850166541]
  var output2 = net.run(dataSerialize(no_circle_data))
  console.log(output1)
  console.log(output2)
  var json = net.toJSON()
  console.log(json)
})


