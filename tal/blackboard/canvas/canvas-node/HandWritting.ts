// declare var require: any
import ElementBase from './elements/element-base'
import Pen from './elements/pen/index'
import Eraser from './elements/eraser/index'
import ChoosePen from './elements/choose-pen/index'
import Helper from './Helper'
import ControlGroup from './elements/control/control-group'

interface PluginMap {
  [x: string]: ElementBase
}

const basicType: Array<string> = ['elementBase', 'pen', 'eraser']

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
  private pluginsMap: any
  public onStartWriting: Function
  public onWriting: Function
  public onEndWriting: Function
  private controlGroupShow: boolean
  private controlGroup: any

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
    this.controlGroupShow = false // 是否显示control
    this.historyIndex = -1 // 当前页撤销回退坐标
    this.gpuEnable = false // gpu是否满足要求
    this.helper.loadModulesInBrowser(['magic-pen']).then((modules) => {
      this.pluginsMap = modules
    })
    this.controlGroup = null

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

    /* 对外事件函数 */
    this.onStartWriting = () => {} // 下笔开始回调
    this.onWriting = () => {} // 笔记过程中
    this.onEndWriting = () => {} // 笔记结束回调

    /* 开启画布渲染 */
    this.startRender()

    // todo
    setTimeout(() => {
      this.status = 'choose-pen'
    }, 4000)
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
    // 如果有control存在，则先获取变化矩阵
    let matrixObj:any = null
    if (this.status === 'choose-pen' && this.controlGroupShow) {
      matrixObj = this.controlGroup.getMatrixObj()
      console.log('this.elesActive:', this.elesActive)
      if (matrixObj) {
        for (let ele of this.elesActive) {
          ele.updateMatrix(matrixObj)
        }
      }
      this.renderByData()
      return
    }
    for (let ele of this.elesActive) {
      const curType = ele.getType()
      if (curType === 'choose-pen' || (!this.judgeTypeIsInBasicType(curType) && ele.getCtxconfig().renderCtx === 'ctxTemp')) {
        ele.render(this.ctxTemp)
        continue
      }
      ele.render(this.ctx)
    }
  }

  // 判断当前类型是不是在基本类型中
  judgeTypeIsInBasicType (type: string) {
    return (basicType.indexOf(type) >= 0)
  }

  drawBegin (event: PointerEvent) {
    this.enableRender = true
    // 判断是否处于 control 面板中 todo
    if (this.controlGroupShow && this.status === 'choose-pen') {
      if (!(this.controlGroup && this.controlGroup.drawBegin(event))) {
        this.controlGroupShow = false
        this.controlGroup = null
        // todo 从画布中删除 control 
      }
      return
    }
    let ele: ElementBase = new ElementBase()
    // console.log(`[drawBegin] ${this.status}`)
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
    if (this.pluginsMap[this.status]) {
      ele = new this.pluginsMap[this.status].default()
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
        ele.resetStartIndex()
        ele.render(this.ctx)
      }
    }
  }

  clear (ctx: CanvasRenderingContext2D, canv: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canv.width / this.scale, canv.height / this.scale)
  }

  addElement (ele: any, pointerId?: number, config?: object) { // 为当前页添加一个笔记元素
    if (this.historyIndex >= -1) {
      this.eles.splice(this.historyIndex + 1)
    }
    this.eles.push(ele)
    this.historyIndex = this.eles.length - 1
    ele.setEleId(pointerId ? pointerId : 1)
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
    if (!this.enableRender) return
    // 判断是否处于 control 面板中 todo
    if (this.controlGroupShow) {
      this.controlGroup.drawing(event)
      return
    }
    for (let ele of this.elesActive) {
      if (ele.getID() === event.pointerId) {
        ele.drawing(event)
      }
    }
  }

  drawEnd (event: PointerEvent) {
    if (this.elesActive.length < 1) return
    this.enableRender = false
    let drawEndData:any = {}
    if (this.elesActive.length > 1) {
      for (let ele of this.elesActive) {
        if (ele.getID() === event.pointerId) {
          ele.drawEnd(event)
        }
      }
      this.elesActive = []
    } else {
      const type = this.elesActive[0].getType()
      const activeEle = this.elesActive[0]
      // 假如是圈选笔记
      if (type === 'choose-pen') {
        drawEndData = this.handleChoosePen(activeEle)
        this.clear(this.ctxTemp, this.canvTemp)
        this.elesActive = []
        // 如果有圈选到笔记,显示control外框
        if (drawEndData.length > 0) {
          let totalContainer = drawEndData[0].ele.getRectContainer()
          drawEndData.forEach((obj:{ele: ElementBase, index: number}) => {
            // this.elesActive.push(obj.ele)
            this.addElement(obj.ele)
            totalContainer = this.helper.getOuterTogether(totalContainer, obj.ele.getRectContainer())
          })
          // get control pos
          let centerX = (totalContainer.left + totalContainer.right) / 2
          let centerY = (totalContainer.top + totalContainer.bottom) / 2
          let width = totalContainer.right - totalContainer.left
          let height = totalContainer.bottom - totalContainer.top
          // console.log('pos::', { centerX, centerY, width, height })
          this.controlGroup = new ControlGroup({ centerX, centerY, width, height })
          this.addElement(this.controlGroup)
          this.controlGroupShow = true
        }
      }
      // 如果是插件
      if (this.pluginsMap[type]) {
        drawEndData = activeEle.drawEnd(event)
        // 如果配置成插件绘制后要删去
        if (!activeEle.getCtxconfig().saveCtx) {
          if (activeEle.getCtxconfig().renderCtx === 'ctxTemp') {
            this.clear(this.ctxTemp, this.canvTemp)
          }
          this.popElement()
        }
        this.elesActive = []
      }
    }
    this.onEndWriting(drawEndData)
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
    return choosedElesArr
  }

  // plugins api
  loadPlugin (name: string, module: any) {
    if (!this.pluginsMap[name]) {
      this.pluginsMap[name] = module
    }
  }
}
// new HandWritting('canvasId', 'canvasTmpId')
export default HandWritting
