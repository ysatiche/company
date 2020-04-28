import ElementBase from '../elements/element-base'
import Helper from './Helper'

/**
 * 撤销与恢复功能
 * 哪些操作可以放入撤销恢复呢？
 * 添加一个元素 ADD ID 1
 * 删除一个元素 DEL ID 1
 * 橡皮擦功能 ERASER ID 1 TO ID 4 ID 5
 */
interface HistoryStatus {
  revokeStatus: boolean
  recoveryStatus: boolean
}

class OperatorRecorder {
  private eles: Array<ElementBase>
  private elesActive: Array<ElementBase>
  private deleteEles: Array<ElementBase>
  private operatorArr: Array<string>
  private helper: any
  private historyIdx: number

  constructor (eles: Array<ElementBase>, elesActive: Array<ElementBase>) {
    this.eles = eles
    this.elesActive = elesActive
    this.deleteEles = [] // 暂时丢弃的画布元素
    this.operatorArr = [] // 历史操作记录
    this.historyIdx = - 1 // handleAddOperator下标
    this.helper = new Helper()
  }

  /**
   * 判断添加进来的操作语句是否合法
   */
  checkOperatorLegal (str: string): boolean {
    return true
  }

  /**
   * 去除字符串前后空格
   * @param str 
   */
  trim (str: any): string {
    if (!str) return ''
    return str.replace(/^\s*(.*?)[\s\n]*$/g,'$1')
  }

  /**
   * 对添加元素的反操作
   * @param { string } str 添加元素的语句 eg. ADD ID 1
   * @returns { boolean } 是否成功
   */
  handleAddOperator (str: string):void {
    let delIdArr = this.trim(str).split(' ')
    let delId = delIdArr[delIdArr.length - 1]
    this.delElementById(delId)
  }

  /**
   * 对删除元素的反操作
   * @param { string } str 添加元素的语句 eg. DEL ID 1
   * @returns { boolean } 是否成功
   */
  handleDelOperator (str: string):void {
    let delIdArr = this.trim(str).split(' ')
    let delId = delIdArr[delIdArr.length - 1]
    this.addDeletedEle(delId)
  }

  /**
   * 删除某id的元素
   */
  delElementById (id: string) {
    let idx = this.helper.findIdsInElementsArray(id, this.eles)
    if (idx > -1) {
      this.deleteEles.push(this.eles[idx])
      this.eles.splice(idx, 1)
    }
    idx = this.helper.findIdsInElementsArray(id, this.elesActive)
    if (idx > -1) {
      this.elesActive.splice(idx, 1)
    }
  }

  /**
   * 从 deleteEles 中添加已被删除的元素
   */
  addDeletedEle (id: string) {
    let idx = this.helper.findIdsInElementsArray(id, this.deleteEles)
    if (idx > -1) {
      const ele = this.deleteEles.splice(idx, 1)
      this.eles.push(ele[0])
    }
  }

  /**
   * 撤销
   * 从this.operatorArr pop出一个操作
   */
  revoke (): any {
    console.warn(`[revoke] [this.historyIdx] ${this.historyIdx} [this.operatorArr] ${JSON.stringify(this.operatorArr)}`)
    let status = false
    if (this.historyIdx > -1 && this.operatorArr[this.historyIdx]) {
      let opStr =  this.operatorArr[this.historyIdx]
      opStr = typeof opStr === 'undefined' ? '' : opStr
      let op = this.trim(opStr).split(' ')[0]
      switch (op) {
        case 'ADD':
          this.handleAddOperator(opStr)
          break
        case 'DEL':
          this.handleDelOperator(opStr)
          break
        default:
          break
      }
      this.historyIdx--
      status = true
    }
    return {
      status: status,
      historyStatus: this.getHistoryStatus()
    }
  }

  /**
   * 恢复
   */
  recovery (): any {
    console.warn(`[recovery] [this.historyIdx] ${this.historyIdx} [this.operatorArr] ${JSON.stringify(this.operatorArr)}`)
    let status = false
    if (this.historyIdx < this.operatorArr.length - 1 && this.operatorArr[this.historyIdx + 1]) {
      let opStr = this.operatorArr[this.historyIdx + 1]
      opStr = typeof opStr === 'undefined' ? '' : opStr
      let op = this.trim(opStr).split(' ')[0]
      switch (op) {
        case 'ADD':
          this.handleDelOperator(opStr)
          break
        case 'DEL':
          this.handleDelOperator(opStr)
          break
        default:
          break
      }
      this.historyIdx++
      status = true
    }
    return {
      status: status,
      historyStatus: this.getHistoryStatus()
    }
  }

  /**
   * 获取 revoke recovery的状态
   */
  getHistoryStatus  ():HistoryStatus {
    let revokeStatus = true
    if (this.historyIdx < 0) {
      revokeStatus = false
    }
    let recoveryStatus = true
    if (this.historyIdx >= this.operatorArr.length - 1 ) {
      recoveryStatus = false
    }
    return {
      revokeStatus,
      recoveryStatus
    }
  }

  /**
   * 添加一个操作记录
   * 判断 str 是否合法
   */
  addOperator (str: string): boolean {
    if (this.checkOperatorLegal(str)) {
      this.operatorArr.push(str)
      this.historyIdx++
      return true
    } else {
      return false
    }
  }

}

export default OperatorRecorder

