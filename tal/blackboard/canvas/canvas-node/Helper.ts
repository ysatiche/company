"use strict";
import Point from "./elements/point"
import { runInContext } from "vm";
// import * as fs from "fs-extra"

interface RectContainer {
  left: number
  right: number
  bottom: number
  top: number
}

// 自定义样式
interface CustomStyle {
  [x: string]: any
}

class Helper {
  private PiBy180: number
  private PiBy2: number
  constructor () {
    this.PiBy180 = Math.PI / 180
    this.PiBy2 = Math.PI / 2
  }

  /**
   * 数学相关函数
   */

   /*
    弧度 转 角度
  */
  radiansToDegrees (radians: number) {
    return radians / this.PiBy180
  }
  cos (radians: number) {
    if (radians === 0) { return 1 }
    if (radians < 0) {
      radians = -radians
    }
    let angleSlice = radians / this.PiBy2
    switch (angleSlice) {
      case 1:
      case 3:
        return 0
      case 2:
        return -1
    }
    return Math.cos(radians)
  }
  sin (radians: number) {
    let PiBy2 = Math.PI / 2
    if (radians === 0) { return 0 }
    let angleSlice = radians / PiBy2
    let sign = 1
    if (radians < 0) {
      sign = -1
    }
    switch (angleSlice) {
      case 1:
        return sign
      case 2:
        return 0
      case 3:
        return -sign
    }
    return Math.sin(radians)
  }
  
  /*
    判断两个方框是否相交
  */
  isRectOverlap (r1: RectContainer, r2: RectContainer) {
    if (!r1 || !r2) return false
    return !(((r1.right < r2.left) || (r1.bottom < r2.top)) || ((r2.right < r1.left) || (r2.bottom < r1.top)))
  }

  /**
   * 获取两个外方框到并集
   */
  getOuterTogether (r1: RectContainer, r2: RectContainer): RectContainer{
    return {
      left: r1.left < r2.left ? r1.left : r2.left,
      right: r1.right < r2.right ? r2.right : r1.right,
      top: r1.top < r2.top ? r1.top : r2.top,
      bottom: r1.bottom < r2.bottom ? r2.bottom : r1.bottom,
    }
  }

  /*
    判断点是否在方框里
  */
  isPointInRect (point: Point, r: RectContainer) {
    return ((point.x >= r.left) && (point.x <= r.right) && (point.y >= r.top) && (point.y <= r.bottom))
  }

  /*
    旋转矩阵
  */
  calcRotateMatrix (radians = 0) {
    let cos = this.cos(radians)
    let sin = this.sin(radians)
    return [cos, sin, -sin, cos, 0, 0]
  }
  /*
    平移矩阵
  */
  calcTranslateMatrix (x = 0, y = 0) {
    return [1, 0, 0, 1, x, y]
  }
  /*
    缩放矩阵
  */
  calcScaleMatrix (scaleX = 1, scaleY = 1) {
    return [scaleX, 0, 0, scaleY, 0, 0]
  }

  /*
    矩阵叠加 a * b
  */
  multiplyTransformMatrices (a: Array<number>, b:Array<number>) {
    return [
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5]
    ]
  }

  /*
    获取矩阵变换后的点坐标
  */
  transformPoint (p: Point, t: any, ignoreOffset?: boolean): Point {
    
    if (ignoreOffset) {
      return new Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y)
    }
    return new Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5])
  }
  

   /**
   * 逻辑相关函数
   */

   /**
    * 动态加载模块 node环境
    */
  // async loadModules (): Promise<any> {
  //   let patcher: any = {}
  //   const absolutePath = __dirname + '\\plugins\\'
  //   let pathList = fs.readdirSync(absolutePath)
  //   for (const dir of pathList) {
  //     if (this.judgeIsDirectory(dir)) {
  //       const fileList = fs.readdirSync(absolutePath + dir)
  //       for (const filename of fileList) {
  //         if (!/\index.ts$/.test(filename)) continue
  //         let _load = await this.loadModule(absolutePath + dir + '\\index')
  //         if (_load) {
  //           patcher[dir] = _load
  //         }
  //       }
  //     }
  //   }
  //   return Promise.resolve(patcher)
  // }

  /**
   * 动态加载模块 浏览器环境
   * @param { modulesNameArr } 模块名字 加载位置  __dirname + '\\plugins\\' + ${name} + '\\index
   */
  async loadModulesInBrowser (modulesNameArr: Array<string>): Promise<any> {
    let patcher: any = {}
    for (const name of modulesNameArr) {
      let _load = await this.loadModuleInBrowser(name)
      if (_load) {
        patcher[name] = _load
      }
    }
    return Promise.resolve(patcher)
  }

  loadModuleInBrowser (dir: string): Promise<any> {
    return new Promise((resolve) => {
      // 必须在 import ()中这么写，不然将路径提出去做变量会出问题
      import('./plugins/' + dir + '/index').then((m) => {
        resolve(m)
      }).catch((e) => {
        resolve(false)
      })
    })
  }

  /**
   * 判断是否为文件夹
   */
  judgeIsDirectory (filepath: string): boolean {
    return filepath.indexOf('.') < 0
    // windows系统涉及到权限问题，先不用下面方式
    // const stat = fs.statSync(filepath)
    // return stat.isDirectory()
  }

  /**
   * await 加载一个模块 node
   * @param dir 模块路径
   */

  loadModule (dir: string): Promise<any> {
    return new Promise((resolve) => {
      import(dir).then((m) => {
        resolve(m)
      }).catch((e) => {
        resolve(false)
      })
    })
  }
  // 画圆
  renderCircleControl (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, styleOverride?: CustomStyle) {
    const defaultStyle = {
      color: '#999999',
      methodName: 'stroke',
      dashed: true
    }
    styleOverride = styleOverride || defaultStyle
    ctx.strokeStyle = styleOverride.color
    if (styleOverride.dashed) {
      ctx.setLineDash([6, 6])
    }
    ctx.lineWidth = 1
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    switch(styleOverride.methodName) {
      case 'stroke':
        ctx.stroke()
        break
      case 'fill':
        ctx.fill()
        break
      default:
        ctx.stroke()
    }
  }

  // 画方
  renderSquareControl (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number, styleOverride?: CustomStyle) {
    const defaultStyle = {
      color: '#999999',
      methodName: 'stroke',
      dashed: true
    }
    styleOverride = styleOverride || defaultStyle
    ctx.strokeStyle = styleOverride.color
    if (styleOverride.dashed) {
      ctx.setLineDash([6, 6])
    }
    ctx.lineWidth = 1
    ctx.beginPath();
    let left = centerX - width / 2
    let top = centerY - height / 2
    switch(styleOverride.methodName) {
      case 'stroke':
        ctx.strokeRect(left, top, width, height)
        break
      case 'fill':
        ctx.fillRect(left, top, width, height)
        break
      default:
        ctx.strokeRect(left, top, width, height)
    }
  }
}

export default Helper