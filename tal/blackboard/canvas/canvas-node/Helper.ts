"use strict";
import Point from "./elements/point"
// import * as fs from "fs-extra"

interface RectContainer {
  left: number
  right: number
  bottom: number
  top: number
}

class Helper {
  constructor () {

  }

  /**
   * 数学相关函数
   */
  
  /*
    判断两个方框是否相交
  */
  isRectOverlap (r1: RectContainer, r2: RectContainer) {
    if (!r1 || !r2) return false
    return !(((r1.right < r2.left) || (r1.bottom < r2.top)) || ((r2.right < r1.left) || (r2.bottom < r1.top)))
  }

  /*
    判断点是否在方框里
  */
  isPointInRect (point: Point, r: RectContainer) {
    return ((point.x >= r.left) && (point.x <= r.right) && (point.y >= r.top) && (point.y <= r.bottom))
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
}

export default Helper