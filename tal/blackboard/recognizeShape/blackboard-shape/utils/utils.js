
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

module.exports = {
  dataSerialize: dataSerialize
}

