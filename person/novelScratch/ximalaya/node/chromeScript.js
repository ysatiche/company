
// 直接放入chrome console中
// 由于$不能直接用，所以现在console 中申明 let $$ = $
let idx = 1

let savedNum = 30

let timer = setInterval(() => {
  // let liClass = '#anchor_sound_list > div.sound-list._Qp > ul > li:nth-child(' + idx + ') > div.icon-wrapper._Vc > div > i.xuicon.xuicon-web_album_btn_play_s.playIcon._Vc'
  let liClass = '#anchor_sound_list > div.sound-list._Qp > ul > li:nth-child(' + idx + ') > div.icon-wrapper._Vc > div > div.defaultDOM._Vc > span'
  $$(liClass).click()
  idx++
  if (idx > savedNum) {
    clearInterval(timer)
    timer = null
  }
}, 2000)

// 获取每章的名字 $('#anchor_sound_list > div.sound-list._Qp > ul > li:nth-child(1) > div.text._Vc > a > span').innerText
let savedN = 30
let titleArr = []
for (let i = 1; i <= savedN; i++) {
  let str = '#anchor_sound_list > div.sound-list._Qp > ul > li:nth-child(' + i + ') > div.text._Vc > a > span'
  titleArr.push($(str).innerText)
}
console.log(titleArr)
// window.location = "http://localhost:3000/?" + encodeURI(encodeURI(titleArr.join('+')))


