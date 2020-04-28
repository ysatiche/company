import HandWritting from './HandWritting'
// import MagicPen from './plugins/magic-pen'
import Helper from './libs/Helper'
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

// eraser
let div1 = document.createElement("div")
div1.style.width ='100px'
div1.style.height = '100px'
div1.style.background = '#333333'
div1.style.zIndex = '100'
div1.style.position = 'fixed'
div1.style.right = '0'
div1.setAttribute('id', 'choosepen')
div1.addEventListener('click', () => {
  handWritting.setStatus('eraser')
})

// revoke
let div2 = document.createElement("div")
div2.style.width ='100px'
div2.style.height = '100px'
div2.style.background = '#333333'
div2.style.zIndex = '100'
div2.style.position = 'fixed'
div2.style.bottom = '0'
div2.style.left = '0'
div2.innerHTML = 'Revoke'
div2.addEventListener('click', () => {
  handWritting.revoke()
})

// recovery
let div3 = document.createElement("div")
div3.style.width ='100px'
div3.style.height = '100px'
div3.style.background = '#333333'
div3.style.zIndex = '100'
div3.style.position = 'fixed'
div3.style.right = '0'
div3.style.bottom = '0'
div3.innerHTML = 'Recovery'
div3.addEventListener('click', () => {
  handWritting.recovery()
})

document.getElementsByTagName('body')[0].appendChild(div)
document.getElementsByTagName('body')[0].appendChild(div1)
document.getElementsByTagName('body')[0].appendChild(div2)
document.getElementsByTagName('body')[0].appendChild(div3)
// handWritting.onEndWriting = (data:any) => {
//   console.log('data:', data)
// }

