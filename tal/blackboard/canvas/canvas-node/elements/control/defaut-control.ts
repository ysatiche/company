import Control from './control'
import Point from '../point'

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
}

interface ControlPos {
  centerX: number
  centerY: number
  width: number
  height: number
}

// 平移
function handleMove (start: Point, end: Point): MatrixObj {
  return { 
    actionName: 'translate',
    matrix: {x: end.x - start.x, y: end.y - start.y}
   }
}

export default function (pos: ControlPos): {[x: string]: Control} {
  return {
    'mc': new Control({ // 中间矩形平移功能
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
    })
  }
}
