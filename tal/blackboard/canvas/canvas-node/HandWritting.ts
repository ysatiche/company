import ElementBase from './elements/element-base'
import Pen from './elements/pen/index'
import Eraser from './elements/eraser/index'
import ChoosePen from './elements/choose-pen/index'
import Helper from './Helper'

class HandWritting {
  private eles: Array<ElementBase>
  private elesActive: Array<ElementBase>
  private animationFrame: number
  private preRender: number
  private isRendering: boolean
  private canv: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private canvTemp: HTMLCanvasElement
  private ctxTemp: CanvasRenderingContext2D
  private status: string
  private touches: Array<any>
  private enableRender: boolean
  private historyIndex: number
  private helper: Helper
  private scale: number
  private gpuEnable: boolean

  constructor (canvasid: string, canvastemp: string) {
    this.eles = [] // 当前页画布元素集合
    this.elesActive = [] // 当前激活的元素
    this.animationFrame = 0
    this.preRender = 0 // 画笔上一次渲染时间
    this.isRendering = false // 当前帧是否正在渲染
    this.touches = [] // 当前存在的触点
    this.status = 'pen' // 最终状态
    this.helper = new Helper()
    this.enableRender = false
    this.scale = 1 // 缩放
    this.historyIndex = -1 // 当前页撤销回退坐标
    this.gpuEnable = false // gpu是否满足要求

    /* 主画布 */
    this.canv = <HTMLCanvasElement> document.getElementById(canvasid)
    this.ctx = <CanvasRenderingContext2D> this.canv.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.canv.addEventListener('pointerdown', this.drawBegin.bind(this))
    this.canv.addEventListener('pointermove', this.drawing.bind(this))
    this.canv.addEventListener('pointerup', this.drawEnd.bind(this))
    this.canv.addEventListener('pointerleave', this.drawEnd.bind(this))

    /* 临时画布 */
    this.canvTemp = <HTMLCanvasElement> document.getElementById(canvastemp)
    this.ctxTemp = <CanvasRenderingContext2D> this.canvTemp.getContext('2d')
    this.ctxTemp.imageSmoothingEnabled = false

    /* 开启画布渲染 */
    this.startRender()
  }

  startRender () {
    this.animationFrame = requestAnimationFrame(this.startRender.bind(this))
    let now = Date.now()
    let delta = now - this.preRender
    let interval = 1000 / 30
    // let interval = 60000 / 30
    if (!this.isRendering && delta > interval) {
      this.preRender = now - (delta % interval)
      this.isRendering = true
      this.render()
      this.isRendering = false
    }
  }
  stopRender () {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame)
    }
  }

  render () {
    // 判断是否需要render
    // 鼠标在屏幕里移动，直接就会触发 drawing (暂不知道原因)
    // 所以根据 enableRender 来确定是否触发渲染
    if (this.elesActive.length === 0 || !this.enableRender) {
      return
    }
    for (let ele of this.elesActive) {
      if (ele.getType() === 'choose-pen') {
        ele.render(this.ctxTemp)
        continue
      }
      ele.render(this.ctx)
    }
  }

  drawBegin (event: PointerEvent) {
    this.enableRender = true
    let ele: ElementBase = new ElementBase()
    switch (this.status) {
      case 'pen':
        ele = new Pen()
        break
      case 'eraser':
        ele = new Eraser()
        break
      case 'choose-pen':
        ele = new ChoosePen()
        break
      default:
        break
    }
    this.addElement(ele, event.pointerId)
    ele.drawBegin(event)
  }

  getRevokeStatus () { // 获取是否可以撤销或者恢复的状态
    let revokeNext = this.historyIndex > -1
    let recoveryNext = this.historyIndex < this.eles.length - 1
    return { revokeNext, recoveryNext }
  }

  revoke (): any { // 撤销
    if (this.historyIndex === null) {
      this.historyIndex = this.eles.length - 1
    }
    if (this.historyIndex > -1) {
      if (!this.eles[this.historyIndex]) {
        this.historyIndex--
        return this.revoke()
      } else {
        this.historyIndex--
        this.renderByData()
      }
    }
    return this.getRevokeStatus()
  }
  recovery (): any { // 恢复
    if (this.historyIndex === null) {
      this.historyIndex = this.eles.length - 1
    }
    if (this.historyIndex < this.eles.length - 1) {
      this.historyIndex++
      if (!this.eles[this.historyIndex]) {
        return this.recovery()
      } else {
        this.renderByData()
      }
    }
    return this.getRevokeStatus()
  }

  renderByData (): void {
    this.clear(this.ctx, this.canv)
    if (this.historyIndex >= 0) {
      for (let i = 0; i < this.historyIndex + 1; i++) {
        let ele = this.eles[i]
        if (!ele || !ele.isFinish()) continue
        ele.render(this.ctx)
      }
    }
  }

  clear (ctx: CanvasRenderingContext2D, canv: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canv.width / this.scale, canv.height / this.scale)
  }

  addElement (ele: ElementBase, pointerId: number, config?: object) { // 为当前页添加一个笔记元素
    if (this.historyIndex >= -1) {
      this.eles.splice(this.historyIndex + 1)
    }
    this.eles.push(ele)
    this.historyIndex = this.eles.length - 1
    ele.setEleId(pointerId)
    if (config) {
      ele.setConfig(config)
    }
    this.elesActive.push(ele)
  }

  popElement (indexs:Array<number> = []) { // 去除当前页最后一个元素或者传入的元素（长按选中时会用到、几何图形删除）
    if (indexs.length > 0) {
      for (let index of indexs) {
        // todo 去掉之前的置为 null 的方式，待确认可行性
        // this.eles[index] = null
        this.eles.splice(index, 1)
        this.historyIndex--
      }
    } else {
      let result = this.eles.pop()
      if (result) {
        this.historyIndex = this.eles.length - 1
      }
    }
  }

  drawing (event: PointerEvent) {
    for (let ele of this.elesActive) {
      if (ele.getID() === event.pointerId) {
        ele.drawing(event)
      }
    }
  }

  drawEnd (event: PointerEvent) {
    this.enableRender = false
    for (let ele of this.elesActive) {
      if (ele.getID() === event.pointerId) {
        ele.drawEnd(event)
      }
    }
    // 假如是圈选笔记
    if (this.elesActive.length === 1 && this.elesActive[0].getType() === 'choose-pen') {
      const choosedData = this.handleChoosePen(this.elesActive[0])
      this.clear(this.ctxTemp, this.canvTemp)
      console.warn('choosedData:', choosedData)
    }
    this.elesActive = []
  }

  handleChoosePen (ele: ElementBase): any {
    const pointListLen = ele.getPointList().length
    if (pointListLen < 1) return
    let choosedElesArr = []
    let chooseWay = 'drawChoose' // 'drawChoose' 圈选 'clickChoose' 点选
    // 点选
    if (pointListLen === 1) {
      this.clear(this.ctxTemp, this.canvTemp)
      let clickPoint = ele.getPointList()[0]
      let baseRect = 20
      this.ctxTemp.beginPath()
      this.ctxTemp.moveTo(clickPoint.x - baseRect / 2, clickPoint.y - baseRect / 2)
      this.ctxTemp.lineTo(clickPoint.x - baseRect / 2, clickPoint.y + baseRect / 2)
      this.ctxTemp.lineTo(clickPoint.x + baseRect / 2, clickPoint.y + baseRect / 2)
      this.ctxTemp.lineTo(clickPoint.x + baseRect / 2, clickPoint.y - baseRect / 2)
      chooseWay = 'clickChoose'
    }
    for (let i = this.historyIndex; i >= 0; i--) {
      // 点选时只选择最上面的一个
      if (chooseWay === 'clickChoose' && choosedElesArr.length > 0) {
        break
      }
      let tmpEle = this.eles[i]
      if (!tmpEle) continue
      // 当检测元素是画笔或者几何图形时
      const tmpType = tmpEle.getType()
      if (tmpType === 'pen') {
        let scale = this.gpuEnable ? this.scale * 2 : this.scale
        if (tmpEle.judgeIsPointInPath(this.ctxTemp, ele.getRectContainer(), scale)) {
          choosedElesArr.push({
            ele: tmpEle,
            index: i
          })
        }
      }
    }
    return { choosedElesArr }
  }
}
new HandWritting('canvasId', 'canvasTmpId')
