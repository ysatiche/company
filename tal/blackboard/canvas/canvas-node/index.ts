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
let div = document.createElement("div")
div.style.width ='100px'
div.style.height = '100px'
div.style.background = '#333333'
div.style.zIndex = '100'
div.style.position = 'fixed'
div.setAttribute('id', 'choosepen')
div.addEventListener('click', () => {
  handWritting.setStatus('choose-pen')
})
document.getElementsByTagName('body')[0].appendChild(div)
// handWritting.onEndWriting = (data:any) => {
//   console.log('data:', data)
// }

