import ElementBase from './element-base'

class MagicPen extends ElementBase {
  constructor () {
    super()
    this.type = 'magic-pen'
    this.ctxConfig = {
      renderCtx: 'ctxTemp',
      saveCtx: false
    }
  }

  drawEnd (event: PointerEvent): any {
    super.drawEnd(event)
    return {
      type: this.type,
      data: {
        resType: 'star'
      }
    }
  }
}

export default MagicPen

