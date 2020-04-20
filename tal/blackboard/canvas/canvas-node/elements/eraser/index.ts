import ElementBase from '../element-base'
import Point from '../point'

class Eraser extends ElementBase {
  constructor () {
    super()
    this.type = 'eraser'
    this.config = {
      eraserWidth: 60
    }
  }

  _render (ctx: CanvasRenderingContext2D): boolean {
    if (!this.pointList || this.pointList.length < 1) return this.finish
    let endIndex = this.pointList.length - 1
    for (let i = this.from; i < endIndex; i++) {
      this._clearCircle(ctx, this.pointList[i])
    }
    this.from = this.pointList.length - 1
    return this.finish
  }

  _clearCircle (ctx: CanvasRenderingContext2D, p: Point): void {
    const radius = this.config.eraserWidth
    ctx.beginPath()
    ctx.arc(p.x, p.y, radius, 2 * Math.PI, 0)
    ctx.clip()
    ctx.clearRect(p.x - radius - 1, p.y - radius - 1, 2 * radius + 2, 2 * radius + 2)
  }
}

export default Eraser



