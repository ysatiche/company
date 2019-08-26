const csv = require('csv')
// 获取图形的点数组
class ShapePoint {
    constructor () {
      this.baseLen = 2
      this.baseCircleLen = 5
      this._getRectPointsArr({ x: 50, y: 50 }, { x: 20, y: 30 })
    }
  
    getShapePoints (type, start, end) {
      if (type === 'line' || type === 'dashed') {
        return this._getLinePointsArr(start, end)
      }
      if (type === 'rectangle') {
        return this._getRectPointsArr(start, end)
      }
      if (type === 'triangle') {
        return this._getTrianglePointsArr(start, end)
      }
      if (type === 'rightTriangle') {
        return this._getRightTriangle(start, end)
      }
      if (type === 'parallelogram') {
        return this.getParallelogram(start, end)
      }
      if (type === 'coordinate') {
        return this._coordinate(start, end)
      }
      if (type === 'axis') {
        return this._axis(start, end)
      }
      if (type === 'cube') {
        return this.cube(start, end)
      }
      if (type === 'circle') {
        return this._getCircle(start, end)
      }
      if (type === 'cone') {
        return this.cone(start, end)
      }
      if (type === 'cylinder') {
        return this.cylinder(start, end)
      }
    }
  
    _circle (center, a, b, semiCircle) {
      let pointsArr = []
      let r = a > b ? a : b
      let ratioX = a / r
      let ratioY = b / r
      // let centerPoint = { x: center.x / ratioX, y: center.y / ratioY }
      // 上半圆，暂定 count = this.baseCircleLen * r
      let count = this.baseCircleLen * r
      let step = Math.PI / count
      let angle = 0
      for (let i = 0; i < count; i++) {
        pointsArr.push({
          x: center.x + r * Math.cos(angle) * ratioX,
          y: center.y - r * Math.sin(angle) * ratioY
        })
        angle += step
      }
      if (semiCircle === 'up') return pointsArr
      let arr = []
      angle = 0
      for (let i = 0; i < count; i++) {
        arr.push({
          x: center.x + r * Math.cos(angle) * ratioX,
          y: center.y + r * Math.sin(angle) * ratioY
        })
        angle += step
      }
      if (semiCircle === 'down') return arr
      pointsArr.push(...arr)
      return pointsArr
    }
  
    _getCircle (start, end) {
      let center = {
        x: (end.x + start.x) / 2,
        y: (end.y + start.y) / 2
      }
      let a = Math.abs((end.x - start.x) / 2)
      let b = Math.abs((end.y - start.y) / 2)
      return this._circle(center, a, b)
    }
  
    _getLinePointsArr (start, end) {
      let pointsArr = []
      let xCalc = end.x - start.x
      let yCalc = end.y - start.y
      // let xyslope = yCalc !== 0 ? xCalc / yCalc : 0
      let arrLen = xCalc !== 0 ? Math.abs(xCalc) * this.baseLen : Math.abs(yCalc) * this.baseLen
      pointsArr.push(start)
      for (let i = 0; i < arrLen; i++) {
        let prePoint = pointsArr[i]
        pointsArr.push(
          {
            x: prePoint.x + xCalc / arrLen,
            y: prePoint.y + yCalc / arrLen
          }
        )
      }
      return pointsArr
    }
  
    // 矩形点数组
    _getRectPointsArr (start, end) {
      let pointsArr = []
      let arr1 = this._getLinePointsArr(start, { x: start.x, y: end.y })
      pointsArr.push(...arr1)
      let arr2 = this._getLinePointsArr({ x: start.x, y: end.y }, end)
      pointsArr.push(...arr2)
      let arr3 = this._getLinePointsArr(end, { x: end.x, y: start.y })
      pointsArr.push(...arr3)
      let arr4 = this._getLinePointsArr({ x: end.x, y: start.y }, start)
      pointsArr.push(...arr4)
      return pointsArr
    }
  
    // 三角形
    _getTrianglePointsArr (start, end) {
      let pointsArr = []
      let p1 = {
        x: (end.x + start.x) / 2,
        y: start.y
      }
      let p2 = {
        x: start.x,
        y: end.y
      }
      let p3 = end
      let arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p2.x, y: p2.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p1.x, y: p1.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 直角三角形
    _getRightTriangle (start, end) {
      let pointsArr = []
      let p1 = start
      let p2 = {
        x: start.x,
        y: end.y
      }
      let p3 = end
      let arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p2.x, y: p2.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p1.x, y: p1.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 平行四边形
    getParallelogram (start, end) {
      let pointsArr = []
      let w = end.x - start.x
      let offset = w / 4
      let p1 = {
        x: start.x + offset,
        y: start.y
      }
      let p2 = {
        x: end.x,
        y: start.y
      }
      let p3 = {
        x: end.x - offset,
        y: end.y
      }
      let p4 = {
        x: start.x,
        y: end.y
      }
      let arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p2.x, y: p2.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p4.x, y: p4.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p4.x, y: p4.y }, { x: p1.x, y: p1.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  
    _axis (start, end, direction) {
      let lineWidth = 4
      let p1 = {}
      let p2 = {}
      let p3 = {}
      let p4 = {}
      let p5 = {}
      if (direction === 'x') {
        p1 = {
          x: start.x,
          y: (end.y + start.y) / 2
        }
        if (end.x < start.x) {
          p2 = {
            x: end.x + 15,
            y: (end.y + start.y) / 2
          }
          p5 = {
            x: p2.x - 15,
            y: p2.y
          }
        } else {
          p2 = {
            x: end.x - 15,
            y: (end.y + start.y) / 2
          }
          p5 = {
            x: p2.x + 15,
            y: p2.y
          }
        }
        p3 = {
          x: p2.x,
          y: p2.y - 10 - lineWidth / 2
        }
        p4 = {
          x: p2.x,
          y: p2.y + 10 + lineWidth / 2
        }
      } else if (direction === 'y') {
        if (end.y < start.y) {
          p1 = {
            x: (end.x + start.x) / 2,
            y: start.y
          }
          p2 = {
            x: (end.x + start.x) / 2,
            y: end.y + 15
          }
        } else {
          p1 = {
            x: (end.x + start.x) / 2,
            y: end.y
          }
          p2 = {
            x: (end.x + start.x) / 2,
            y: start.y + 15
          }
        }
        p3 = {
          x: p2.x - 10 - lineWidth / 2,
          y: p2.y
        }
        p4 = {
          x: p2.x + 10 + lineWidth / 2,
          y: p2.y
        }
        p5 = {
          x: p2.x,
          y: p2.y - 15
        }
      }
      let pointsArr = []
      let arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p4.x, y: p4.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p4.x, y: p4.y }, { x: p5.x, y: p5.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p5.x, y: p5.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 坐标系
    _coordinate (start, end) {
      let pointsArr = []
      let arr = this._axis(start, end, 'x')
      pointsArr.push(...arr)
      arr = this._axis(start, end, 'y')
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 数轴
    axis (start, end) {
      let pointsArr = []
      let arr = this._axis(start, end, 'x')
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 立方体
    cube (start, end) {
      let w = end.x - start.x
      let h = end.y - start.y
      let offsetX = w / 4
      let offsetY = h / 4
  
      // 顶部面的4点
      let p1 = {
        x: start.x + offsetX,
        y: start.y
      }
      let p2 = {
        x: end.x,
        y: start.y
      }
      let p3 = {
        x: end.x - offsetX,
        y: start.y + offsetY
      }
      let p4 = {
        x: start.x,
        y: start.y + offsetY
      }
      // 正面 下面的2点
      let p5 = {
        x: start.x,
        y: end.y
      }
      let p6 = {
        x: end.x - offsetX,
        y: end.y
      }
      // 背后的2点
      // let p7 = {
      //   x: start.x + offsetX,
      //   y: end.y - offsetY
      // }
      let p8 = {
        x: end.x,
        y: end.y - offsetY
      }
      let pointsArr = []
      let arr = []
      arr = this._getLinePointsArr({ x: p4.x, y: p4.y }, { x: p1.x, y: p1.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p2.x, y: p2.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p4.x, y: p4.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p4.x, y: p4.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p4.x, y: p4.y }, { x: p5.x, y: p5.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p5.x, y: p5.y }, { x: p6.x, y: p6.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p6.x, y: p6.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p6.x, y: p6.y }, { x: p8.x, y: p8.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p8.x, y: p8.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 圆柱体
    cylinder (start, end) {
      let pointsArr = []
      let arr = []
      let h = end.y - start.y
      let offsetY = h / 8
      let centerA = {
        x: (end.x + start.x) / 2,
        y: start.y + offsetY
      }
      let a = Math.abs((end.x - start.x) / 2)
      let b = offsetY
      arr = this._circle(centerA, a, b)
      pointsArr.push(...arr)
      let centerB = {
        x: (end.x + start.x) / 2,
        y: end.y - offsetY
      }
      arr = this._circle(centerB, a, b, 'down') // 下半实圆
      pointsArr.push(...arr)
      let p1 = {
        x: start.x,
        y: start.y + offsetY
      }
      let p2 = {
        x: start.x,
        y: end.y - offsetY
      }
      let p3 = {
        x: end.x,
        y: start.y + offsetY
      }
      let p4 = {
        x: end.x,
        y: end.y - offsetY
      }
      arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p3.x, y: p3.y }, { x: p4.x, y: p4.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  
    // 圆锥体
    cone (start, end) {
      let pointsArr = []
      let arr = []
      let h = end.y - start.y
      let offsetY = h / 8
      let a = Math.abs((end.x - start.x) / 2)
      let b = offsetY
      let center = {
        x: (end.x + start.x) / 2,
        y: end.y - offsetY
      }
      arr = this._circle(center, a, b, 'down') // 下半实圆
      pointsArr.push(...arr)
      let p1 = {
        x: (start.x + end.x) / 2,
        y: start.y
      }
      let p2 = {
        x: start.x,
        y: end.y - offsetY
      }
      let p3 = {
        x: end.x,
        y: end.y - offsetY
      }
      arr = this._getLinePointsArr({ x: p2.x, y: p2.y }, { x: p1.x, y: p1.y })
      pointsArr.push(...arr)
      arr = this._getLinePointsArr({ x: p1.x, y: p1.y }, { x: p3.x, y: p3.y })
      pointsArr.push(...arr)
      return pointsArr
    }
  }
  
const shapePoint = new ShapePoint()
const types = ['rectangle', 'triangle', 'parallelogram', 'circle']
const eachTypeLen = 50
let resArr = []
const getPoints = (type, start, end) => {
  const pointsArr = shapePoint.getShapePoints(type, start, end )
  if (pointsArr.lenght < 50) return null
  const steps = 50
  const each = parseInt(pointsArr.length / steps)
  let res = []
  for (i = 0 ; i < 50; i++) {
      let point = [pointsArr[i * each]['x'], pointsArr[i * each]['y']]
      res.push(...point)
  }
  return res
}
types.forEach(type => {
  for (let j = 0; j < eachTypeLen; j++) {
    let start = {
      x: Math.random() * 1820,
      y: Math.random() * 980
    }
    let end = {
      x: Math.random() * 1820,
      y: Math.random() * 980
    }
    let res = getPoints(type, start, end)
    if (res) {
      if (type === 'circle') {
        res.push(1)
      } else {
        res.push(0)
      }
      resArr.push(res)
    }
  }
})

let obj = csv()
obj.from.array(resArr).to.path('./data.csv')
// console.log(res)
