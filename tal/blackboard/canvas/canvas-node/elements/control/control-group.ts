import createControls from './defaut-control'
import Control from './control'
import ElementBase from '../element-base'
import Point from '../point'

interface ControlPos {
  centerX: number
  centerY: number
  width: number
  height: number
}

class ControlGroup extends ElementBase{
  private defaultControls: {
    [x: string]: Control
  }
  private startPoint?: Point
  private activeControl: any
  private controlPos?: ControlPos

  constructor (pos: ControlPos) {
    super()
    this.type = 'control-group'
    this.defaultControls = createControls(pos)
    this.setControlPos(pos)
    this.finish = true
  }

  // 设置位置
  setControlPos (pos: ControlPos) {
    this.controlPos = pos
  }

  // 添加control
  addControl (name: string, control: Control): boolean {
    if(!this.defaultControls[name]) {
      this.defaultControls[name] = control
      return true
    } else {
      return false
    }
  }

  // 删除control
  deleteControl (name: string): boolean {
    if (this.defaultControls[name]) {
      delete this.defaultControls[name]
      return true
    } else {
      return false
    }
  }

  drawBegin(event: PointerEvent): any {
    this.pointList = []
    let curPoint = this._getPoint(event)
    this._addPoint(curPoint)
    this.startPoint = curPoint
    return this.checkPointInControls(curPoint)
  }

  drawing (event: PointerEvent): any {
    // this.finish = false
    let curPoint = this._getPoint(event)
    this._addPoint(curPoint)
    // if (this.activeControl) {
    //   let transformMatrix = this.activeControl.getActionHandler(event)
    //   this.translate(transformMatrix)
    //   return transformMatrix
    // }
  }

  // get matrix obj
  getMatrixObj ():any {
    // 每次render时计算 移动/缩放/旋转 等结果
    if (this.activeControl) {
      if (!this.startPoint) return null
      const end = this.pointList[this.pointList.length - 1]
      const matrix = this.activeControl.getActionHandler()(this.startPoint, end)
      this.startPoint = end
      return matrix
    } else {
      return null
    }
  }

  // render
  _render (ctx: CanvasRenderingContext2D):any {
    // if (this.finish) return
    for (let i = 0; i < Object.keys(this.defaultControls).length; i++) {
      let key = Object.keys(this.defaultControls)[i]
      this.defaultControls[key]._render(ctx)
    }
  }

  // 获取点是否在控制面板中
  checkPointInControls (point: Point): boolean {
    for (let i = 0; i < Object.keys(this.defaultControls).length; i++) {
      let key = Object.keys(this.defaultControls)[i]
      if (this.defaultControls[key].checkPointInControl(point)) {
        this.activeControl = this.defaultControls[key]
        return true
      }
    }
    this.activeControl = null
    return false
  }
}

export default ControlGroup
