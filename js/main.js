import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  createTimer,
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getPlayAgainButton,
  hidePlayAgainButton,
  pickLiElementHaveActive,
  setTimerText,
  showPlayAgainButton,
} from './selectors.js'
import { getRandomColorPairs } from './utils.js'
// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function initColor() {
  // random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  //   bind to li > div.overlay
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
    liElement.dataset.color = colorList[index]
  })
}
function setBackColor(color) {
  const background = getColorBackground()
  background.style.backgroundColor = color
}
function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClick = liElement.classList.contains('active')
  if (!liElement || isClick || shouldBlockClick) return
  liElement.classList.add('active')
  // save click cell to selections
  selections.push(liElement)
  if (selections.length < 2) return

  // check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    setBackColor(firstColor)
    // check win
    const isWin = pickLiElementHaveActive().length === 0
    if (isWin) {
      showPlayAgainButton()
      setTimerText('You WIN !')
      timer.clear()
      gameStatus = GAME_STATUS.FINISHED
    }
    selections = []
    return
  }
  gameStatus = GAME_STATUS.BLOCKING
  // in case of not match
  setTimeout(() => {
    // remove active class for 2 li elements
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    // reset selections for the next turn
    selections = []

    // update gameStatus
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}
function handleTimerChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2)
  setTimerText(fullSecond)
}
function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over !')
  showPlayAgainButton()
}
function attachEventForColorList() {
  const ulElement = getColorListElement()
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      handleColorClick(event.target)
    }
  })
}
function resetGame() {
  setBackColor('#daa520')

  // reset global vars
  selections = []
  gameStatus = GAME_STATUS.PLAYING
  // reset Dom elements
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }
  hidePlayAgainButton()
  setTimerText('')
  // re-generate new colors
  initColor()
  //start a new game
  startTimer()
}
function attachEventForButton() {
  const playAgainButton = getPlayAgainButton()
  playAgainButton.addEventListener('click', resetGame)
}
function startTimer() {
  timer.start()
}
;(() => {
  initColor()
  attachEventForColorList()
  attachEventForButton()
  startTimer()
})()
