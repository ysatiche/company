import Control from './control'
import Point from '../point'
import Helper from '../../Helper'

const helper = new Helper()

// interface Options {
//   position: {
//     x: number
//     y: number
//   }
//   [x: string]: any
// }

// control actions

interface MatrixObj {
  actionName: string
  matrix: any
  [x: string]: any
}

interface ControlPos {
  centerX: number
  centerY: number
  width: number
  height: number
}

/**
 * 平移时需要获取的参数
 * @param { Point } start 移动的起始点 
 * @param { Point } end 移动的终点 
 */
function handleMove (start: Point, end: Point, controlPos?: any): MatrixObj {
  let translatePos = {x: end.x - start.x, y: end.y - start.y}
  return translate(translatePos)
}

/**
 * 操作
 */
function translate (translate: {x: number, y: number}) {
  let translateMatrix = helper.calcTranslateMatrix(translate.x, translate.y)
  return {
    actionName: 'translate',
    matrix: translateMatrix
  }
}

/**
 * 缩放时需要获取的参数
 * @param { Point } start 移动的起始点 
 * @param { Point } end 移动的终点 
 */
function handleScaleLeftTop (start: Point, end: Point, controlPos: ControlPos): MatrixObj {
  let left = controlPos.centerX - controlPos.width / 2
  let top = controlPos.centerY - controlPos.height / 2
  let finalLeft = left + (end.x - start.x)
  let finalTop = top + (end.y - start.y)
  let width = controlPos.width - (end.x - start.x)
  let height = controlPos.height - (end.y - start.y)
  let w = width - height
  if (Math.abs(w) < 20) {
    width = height
    finalLeft += w
  }
  let origin = new Point(left + controlPos.width, top + controlPos.height) // 变换的参考点
  let scaleObj = { scaleX: width / controlPos.width, scaleY: height / controlPos.height } // 缩放比例
  // 获取新的pos
  // let newPos = {
  //   centerX: origin.x - scaleObj.scaleX * controlPos.width * 0.5,
  //   centerY: origin.y - scaleObj.scaleY * controlPos.height * 0.5,
  //   width: scaleObj.scaleX * controlPos.width,
  //   height: scaleObj.scaleY * controlPos.height
  // }
  const res =  scale(scaleObj, new Point(left + controlPos.width, top + controlPos.height))
  return res
}

function scale (scale: { scaleX:  number, scaleY: number}, origin: Point): MatrixObj {
  let originMatrixBefore = helper.calcTranslateMatrix(origin.x, origin.y)
  let originMatrixAfter = helper.calcTranslateMatrix(-origin.x, -origin.y)
  let scaleMatrix = helper.calcScaleMatrix(scale.scaleX, scale.scaleY)
  scaleMatrix = helper.multiplyTransformMatrices(originMatrixBefore, scaleMatrix)
  scaleMatrix = helper.multiplyTransformMatrices(scaleMatrix, originMatrixAfter)
  return {
    actionName: 'scale',
    matrix: scaleMatrix,
    info: {
      scale: scale
    }
  }
}

// function  angle (angle: number, origin: Point) {
//   let originMatrixBefore = this.helper.calcTranslateMatrix(origin.x, origin.y)
//   let originMatrixAfter = this.helper.calcTranslateMatrix(-origin.x, -origin.y)
//   let angleMatrix = this.helper.calcRotateMatrix(angle)
//   angleMatrix = this.helper.multiplyTransformMatrices(originMatrixBefore, angleMatrix)
//   angleMatrix = this.helper.multiplyTransformMatrices(angleMatrix, originMatrixAfter)
//   this.transformMatrix = this.helper.multiplyTransformMatrices(angleMatrix, this.transformMatrix)
// }


export default function (pos: ControlPos): {[x: string]: Control} {
  return {
    // 中间矩形平移功能
    'mc': new Control({
      position: {
        x: 0,
        y: 0
      },
      centerPos: pos,
      actionName: 'translate',
      styleOverride: {
        cornerStyle: 'square'
      },
      name: 'mc',
      actionHandler: handleMove
    }),
    // 左上角缩放
    'lt': new Control({
      position: {
        x: -0.5,
        y: -0.5
      },
      centerPos: pos,
      actionName: 'scale',
      styleOverride: {
        cornerStyle: 'circle'
      },
      name: 'lt',
      actionHandler: handleScaleLeftTop
    })
  }
}
