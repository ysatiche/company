import ElementBase from '../elements/element-base'
import Helper from '../Helper'

/**
 * 撤销与恢复功能
 * 哪些操作可以放入撤销恢复呢？
 * 添加一个元素 ADD ID 1
 * 删除一个元素 DEL ID 1
 * 橡皮擦功能 ERASER ID 1 TO ID 4 ID 5
 */


class OperatorRecorder {
  private eles: Array<ElementBase>
  private elesActive: Array<ElementBase>
  private deleteEles: Array<ElementBase>
  private operatorArr: Array<string>
  private helper: any

  constructor (eles: Array<ElementBase>, elesActive: Array<ElementBase>) {
    this.eles = eles
    this.elesActive = elesActive
    this.deleteEles = [] // 暂时丢弃的画布元素
    this.operatorArr = [] // 历史操作记录
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
  trim (str: string): string {
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


}



