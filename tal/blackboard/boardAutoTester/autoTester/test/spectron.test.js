const Application = require('spectron').Application
const AppModule = require('./appModule.js')
const assert = require('assert')

const exepath = 'C:/electronApp.exe'
let app = new Application({
  path: exepath
})
console.log('begin')
app.start().then(function () {
  console.log('waitUntilWindowLoaded .')
  return app.browserWindow.isVisible()
  console.log('waitUntilWindowLoaded')
  // app.client.waitUntilWindowLoaded()
  // .click(AppModule.accountLoginBtn).waitForVisible(AppModule.userAccount)
  // .setValue(AppModule.userAccount, '玩么')
  // console.log('waitUntilWindowLoaded..end')
}).then(function (isVisible) {
  // Verify the window is visible
  assert.equal(isVisible, true)
}).catch(function (error) {
  console.error('test fail', error)
  app.stop()
})



