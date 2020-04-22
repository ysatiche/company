
import Helper from '../../Helper'
import Point from '../point'
interface CustomStyle {
  [x: string]: any
}

interface Options {
  position: {
    x: number
    y: number
  }
  name: string
  actionHandler: Function
  [x: string]: any
}

// (x, y) 是绘制的 center
class Control {
  private x: number
  private y: number
  private visible: boolean
  private offsetX: number
  private offsetY: number
  private cursorStyle: string
  private actionName: string
  private styleOverride: CustomStyle
  private actionHandler: Function
  private helper: Helper
  private customWidth: number
  [x: string]: any

  constructor (options: Options) {
    this.visible = true
    this.x = 0
    this.y = 0
    if (options.position) {
      this.x = options.position.x
      this.y = options.position.y
    }
    this.name = options.name
    this.offsetX = 0
    this.offsetY = 0
    this.cursorStyle = 'crosshair' // control 鼠标样式
    this.actionName = 'scale' // action 名字
    this.styleOverride = {}
    this.centerPos = options.centerPos // 初始化中心点 { centerX, centerY, width, height }
    this.customWidth = options.customWidth || -1 // 当是 circle 时， radius = this.customWidth 当是 square时，width = height = this.customWidth
    this.helper = new Helper()
    this.actionHandler = options.actionHandler
    delete options.position
    for (var option in options) {
      this[option] = options[option];
    }
  }
  
  getActionName(): string{
    return this.actionName
  }

  setCenterPos() {

  }

  getActionHandler():Function {
    return this.actionHandler
  }

  getName ():string {
    return this.name
  }

  // 判断点是否在control中
  checkPointInControl (point: Point): boolean {
    const { realX, realY, radius, width, height } = this.getControlPos()
    if (this.styleOverride.cornerStyle === 'circle') {
      return true
    } else {
      return this.helper.isPointInRect(point, {
        left: realX - width / 2,
        top: realY - height / 2,
        right: realX + width / 2,
        bottom: realY + height / 2
      })
    }
  }

  // get related pos
  getControlPos (): any {
    let realX = this.centerPos.centerX + this.x * this.centerPos.width
    let realY = this.centerPos.centerY + this.y * this.centerPos.height
    const radius = this.customWidth < 0 ? 5 : this.customWidth
    const width = this.customWidth < 0 ? this.centerPos.width : this.customWidth
    const height = this.customWidth < 0 ? this.centerPos.height : this.customWidth
    return { realX, realY, radius, width, height }
  }

  // control icon render
  _render (ctx: CanvasRenderingContext2D): any {
    const { realX, realY, radius, width, height } = this.getControlPos()
    if (this.styleOverride.cornerStyle === 'circle') {
      this.helper.renderCircleControl(ctx, realX, realY, radius, this.styleOverride)
      return true
    } else {
      this.helper.renderSquareControl(ctx, realX, realY, width, height, this.styleOverride)
      return true
    }
  }
}

export default Control
