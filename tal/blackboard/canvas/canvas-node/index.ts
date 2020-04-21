import HandWritting from './HandWritting'
// import MagicPen from './plugins/magic-pen'
import Helper from './Helper'

const helper = new Helper()
// import magicPenConfig from './plugins/magic-pen/magic-pen-config.json'
const magicPenConfig = {
    "renderCtx": "ctx",
    "saveCtx": true
  }

// let magicPen = new MagicPen()
// console.log(magicPen.getRectContainer())

// function pluginConstruct (): MagicPen {
//   return new MagicPen()
// }
let handWritting = new HandWritting('canvasId', 'canvasTmpId')
handWritting.onEndWriting = (data:any) => {
  console.log('data:', data)
}

// handWritting.loadPlugin('magic-pen', MagicPen, magicPenConfig)
// async function test ():Promise<any> {
//   let pluginsModule = await helper.loadModules()

//   console.warn(pluginsModule)
// }
// test()

// import('C:\\tal\\company\\tal\\blackboard\\canvas\\canvas-node\\plugins\\magic-pen\\index')
//   .then(plugin => {
//     console.log(plugin);
//   })
//   .catch(err => {
//     console.log('Failed to load moment', err);
//   });

