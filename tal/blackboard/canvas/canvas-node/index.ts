import HandWritting from './HandWritting'
// import MagicPen from './plugins/magic-pen'
import Helper from './Helper'
// import CanvasOp from './canvas-operator/canvas-operator'


const helper = new Helper()
// import magicPenConfig from './plugins/magic-pen/magic-pen-config.json'
const magicPenConfig = {
    "renderCtx": "ctx",
    "saveCtx": true
  }
// CanvasOp()
let handWritting = new HandWritting('canvasId', 'canvasTmpId')
// handWritting.onEndWriting = (data:any) => {
//   console.log('data:', data)
// }

