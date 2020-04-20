import Point from "./elements/point"

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
}

export default Helper