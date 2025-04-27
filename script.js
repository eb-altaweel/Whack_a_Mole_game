if (document.getElementById('start-btn')) {
  document.getElementById('start-btn').addEventListener('click', () => {
    const difficulty = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value
    const time = document.querySelector('input[name="time"]:checked').value

    window.location.href = `game.html?difficulty=${difficulty}&time=${time}`
  })
} else {

  let score = 0
  let timeUp = false
  let lastHole = null
  let minPeepTime, maxPeepTime, gameDuration

  const urlParams = new URLSearchParams(window.location.search)
  const difficulty = urlParams.get('difficulty') || 'medium'
  const time = urlParams.get('time') || 15000

  switch (difficulty) {
    case 'fast':
      minPeepTime = 200
      maxPeepTime = 600
      break
    case 'medium':
      minPeepTime = 500
      maxPeepTime = 1000
      break
    case 'slow':
      minPeepTime = 800
      maxPeepTime = 1500
      break
  }

  gameDuration = parseInt(time)

  function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length)
    const hole = holes[idx]
    if (hole === lastHole) {
      return randomHole(holes)
    }
    lastHole = hole
    return hole
  }

  function peep() {
    const holes = document.querySelectorAll('.hole')
    const time = randomTime(minPeepTime, maxPeepTime)
    const hole = randomHole(holes)
    const mole = hole.querySelector('.mole')
    mole.classList.add('up')
    setTimeout(() => {
      mole.classList.remove('up')
      if (!timeUp) peep()
    }, time)
  }

  function startGame() {
    score = 0
    timeUp = false
    document.getElementById('score').textContent = 'Score: 0'
    peep()
    setTimeout(() => {
      timeUp = true
      alert('Time up! Your score is ' + score)
    }, gameDuration)
  }

  function whack(e) {
    if (!e.isTrusted) return
    score++
    this.classList.remove('up')
    document.getElementById('score').textContent = 'Score: ' + score
  }

  document
    .querySelectorAll('.mole')
    .forEach((mole) => mole.addEventListener('click', whack))
  document.getElementById('start-button').addEventListener('click', startGame)
}
