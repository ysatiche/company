'use strict'
const chai = require('chai')
chai.should()
const Application = require('spectron').Application
const AppModule = require('./appModule.js')
const assert = require('assert')

describe('application launch', function () {
  let app = null
  
  beforeEach(function () {
    const exepath = 'C:/blackboard.exe'
    app = new Application({
      path: exepath
    })
    app.start()
  })

  afterEach(function () {
    if (app && app.isRunning()) {
      app.stop
    }
  })

  // test unit
  describe('login.vue test', function () {

    it('login', function () {
      app.client.waitUntilWindowLoaded()
      .click(AppModule.accountLoginBtn).waitForVisible(AppModule.userAccount)
      .setValue(AppModule.userAccount, '玩么')
    })
  })


})




