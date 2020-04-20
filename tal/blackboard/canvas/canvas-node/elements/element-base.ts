import Point from './point'
import Helper from '../Helper'

interface Config {
  [x: string]: any
}

interface RectContainer {
  left: number
  right: number
  bottom: number
  top: number
}

class ElementBase {
  protected config: Config
  protected pointList: Array<Point>
  protected transformMatrix: Array<number>
  private id: number
  protected type: string
  protected finish: boolean
  protected from: number
  protected rectContainer: RectContainer
  private helper: Helper

  constructor () {
    // 绘制元素的ID号，用于查找到指定元素
    this.id = -1
    this.pointList = []
    // 元素配置
    this.config = {
      lineColor: '#000000',
      lineWidth: 1
    }
    this.type = 'elementBase'
    this.transformMatrix = [1, 0, 0, 1, 0, 0]
    this.finish = false
    this.from = 0
    this.helper = new Helper()
    this.rectContainer = {
      left: -1,
      right: -1,
      bottom: -1,
      top: -1
    }
  }

  getType (): string {
    return this.type
  }

  getPointList (): Array<Point> {
    return this.pointList
  }

  drawBegin(event: PointerEvent): void {
    let curPoint = this._getPoint(event)
    this._addPoint(curPoint)
  }

  drawing(event: PointerEvent): void {
    let curPoint = this._getPoint(event)
    this._addPoint(curPoint)
  }

  drawEnd(event: PointerEvent): void {
    if (event) {
      let curPoint = this._getPoint(event)
      this._addPoint(curPoint)
    }
  }

  updateRectContainer (p: Point): void {
    if (this.rectContainer.left < 0) {
      this.rectContainer.left = p.x
      this.rectContainer.right = p.x
      this.rectContainer.top = p.y
      this.rectContainer.bottom = p.y
    } else {
      if (p.x < this.rectContainer.left) {
        this.rectContainer.left = p.x
      }
      if (p.x > this.rectContainer.right) {
        this.rectContainer.right = p.x
      }
      if (p.y < this.rectContainer.top) {
        this.rectContainer.top = p.y
      }
      if (p.y > this.rectContainer.bottom) {
        this.rectContainer.bottom = p.y
      }
    }
  }

  render(context: CanvasRenderingContext2D): boolean {
    this._beginRender(context)
    let result = this._render(context)
    this._endRender(context)
    return result
  }

  _beginRender (context: CanvasRenderingContext2D) {
    context.save()
    context.transform(this.transformMatrix[0], this.transformMatrix[1], this.transformMatrix[2], this.transformMatrix[3], this.transformMatrix[4], this.transformMatrix[5])
  }

  getRectContainer (): RectContainer {
    return this.rectContainer
  }

  _endRender (context: CanvasRenderingContext2D) {
    context.restore()
    this.finish = true
  }

  /**
   * 根据pointList生成路径或图形
   */
  _render (ctx: CanvasRenderingContext2D): boolean {
    if (!this.pointList || this.pointList.length < 1) return this.finish
    if (this.pointList.length === 1) {
      this._renderPoint(ctx)
    } else if (this.pointList.length > 1) {
      this._renderPath(ctx)
    }
    this.from = this.pointList.length - 1
    return this.finish
  }

  isFinish (): boolean {
    return this.finish
  }

  /**
   * 绘制一个点
   * @param {Point} point 点
   */
  _renderPoint (ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.config.lineColor
    ctx.beginPath()
    ctx.arc(this.pointList[0].x, this.pointList[0].y, this.config.lineWidth / 2, 0, 2 * Math.PI, true)
    ctx.fill()
  }

  /**
   * 点选与圈选
   * @param {ctx} 当前所在画布
   * @param {chooseZoneInfo} 路径点的外框数据
   * @param {scale} 画布是否缩放
   */
  judgeIsPointInPath (ctx: CanvasRenderingContext2D, chooseZoneInfo: any, scale: number) {
    let calcSteps = 6
    let preDrawPoints = []
    if (this.type === 'pen') { // 兼容笔记的内存优化方案
      let drawPoints = JSON.parse(JSON.stringify(this.pointList))
      for (let v of drawPoints) {
        preDrawPoints.push(this.helper.transformPoint(v, this.transformMatrix))
      }
    } else {
      for (let v of this.pointList) {
        preDrawPoints.push(this.helper.transformPoint(v, this.transformMatrix))
      }
    }
    const info = this.rectContainer
    if (this.helper.isRectOverlap(chooseZoneInfo, info)) {
      for (let j = 0; j < this.pointList.length;) {
        let point = this.pointList[j]
        // 对旋转，移动，缩放的元素的点进行处理
        if (this.helper.isPointInRect(this.helper.transformPoint(point, this.transformMatrix), chooseZoneInfo) && ctx.isPointInPath(point.x * scale, point.y * scale)) {
          return true
        }
        j = j + calcSteps
      }
    }
  }

  /**
   * 绘制一个路径
   * @param pointList 点的集合
   */
  _renderPath (ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.config.lineColor
    ctx.lineWidth = this.config.lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    let endIndex = this.pointList.length - 1
    for (let i = this.from; i < endIndex; i++) {
      if (i === 0) {
        ctx.beginPath()
        ctx.moveTo(this.pointList[i].x, this.pointList[i].y)
      } else {
        this._renderLineTo(ctx, this.pointList[i])
      }
    }
  }

  /**
   * 绘制一条直线
   */
  _renderLineTo (ctx: CanvasRenderingContext2D, p: Point) {
    if (!p) return
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  /**
   * 添加过滤之后的采样点
   * @param {Point} point 点
   * @returns {number} 如果成功添加采样点，返回过滤后采样点数组长度，否则返回-1
   */
  _addPoint (point: Point): number {
    if (this._pointFilter(point)) {
      this.pointList.push(point)
      this.updateRectContainer(point)
      return this.pointList.length
    } else {
      return -1
    }
  }

  /**
   * 点过滤器
   * @param {Point} point 点
   * @returns {Boolean} 返回是否被过滤，true表示不过滤，false表示被过滤
   */
  _pointFilter (point: Point): boolean {
    if (this.pointList.length === 0) return true
    const lastPoint = this.pointList[this.pointList.length - 1]
    if (point.x === lastPoint.x && point.y === lastPoint.y) {
      return false
    } else {
      return true
    }
  }

  _getPoint (event: PointerEvent) {
    return new Point(event.offsetX, event.offsetY, event.pressure)
  }

  setEleId (id: number): void {
    this.id = id
  }

  getID (): number {
    return this.id
  }

  setConfig (cfg: object): void {
    this.config = cfg
  }
}

export default ElementBase