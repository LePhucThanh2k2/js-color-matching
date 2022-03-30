export function getColorElementList() {
  return document.querySelectorAll('#colorList > li')
}
export function getColorListElement() {
  return document.getElementById('colorList')
}
export function getTimerElement() {
  return document.querySelector('.game .game__timer')
}

export function getPlayAgainButton() {
  return document.querySelector('.game .game__button')
}

export function getColorBackground() {
  return document.querySelector('.color-background')
}
export function pickLiElementHaveActive() {
  return document.querySelectorAll('#colorList > li:not(.active)')
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}
export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}
export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
  let interValid = null

  function start() {
    clear()

    let currentSecond = seconds
    interValid = setInterval(() => {
      onChange?.(currentSecond)
      currentSecond--

      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(interValid)
  }
  return {
    start,
    clear,
  }
}
