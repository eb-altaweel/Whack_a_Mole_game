if (document.getElementById('start')) {
  document.getElementById('start').addEventListener('click', () => {
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value
    const time = document.querySelector('input[name="time"]:checked').value
    window.location.href = `game.html?difficulty=${difficulty}&time=${time}`
  })
} else {
  let score = 0
  let timeUp = false
  let lastHole = null
  let minPeepTime, maxPeepTime, gameDuration
  let countdownInterval

  const moleSound = document.getElementById('mole-sound')
  const bombSound = document.getElementById('bomb-sound')

  const urlParams = new URLSearchParams(window.location.search)
  const difficulty = urlParams.get('difficulty')
  const time = urlParams.get('time')

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
    if (hole === lastHole) return randomHole(holes)
    lastHole = hole
    return hole
  }

  function peep() {
    const holes = document.querySelectorAll('.hole')
    const time = randomTime(minPeepTime, maxPeepTime)
    const hole = randomHole(holes)
    const mole = hole.querySelector('.mole')
    const obstacle = hole.querySelector('.obstacle')

    const showObstacle = Math.random() < 0.3

    if (showObstacle) {
      obstacle.classList.add('show')
      setTimeout(() => {
        obstacle.classList.remove('show')
        if (!timeUp) peep()
      }, time)
    } else {
      mole.classList.add('show')
      setTimeout(() => {
        mole.classList.remove('show')
        if (!timeUp) peep()
      }, time)
    }
  }

  function updateTimerDisplay(secondsLeft) {
    const timerDisplay = document.getElementById('timer')
    timerDisplay.textContent = `Time Left: ${secondsLeft}s`
  }

  function startCountdown() {
    let secondsLeft = gameDuration / 1000
    updateTimerDisplay(secondsLeft)
    countdownInterval = setInterval(() => {
      secondsLeft--
      updateTimerDisplay(secondsLeft)
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval)
      }
    }, 1000)
  }

  function startGame() {
    const startBtn = document.getElementById('start-button')
    startBtn.disabled = true
    score = 0
    timeUp = false
    document.getElementById('score').textContent = 'Score: 0'
    updateTimerDisplay(gameDuration / 1000)
    peep()
    startCountdown()
    setTimeout(() => {
      timeUp = true
      clearInterval(countdownInterval)
      alert('Time up! Your final score is ' + score)
      startBtn.disabled = false
    }, gameDuration)
  }

  function whack(e) {
    if (!e.isTrusted) return
    if (this.classList.contains('mole')) {
      score++
      moleSound.currentTime = 0
      moleSound.play()
    } else if (this.classList.contains('obstacle')) {
      score--
      bombSound.currentTime = 0
      bombSound.play()
    }
    this.classList.remove('show')
    document.getElementById('score').textContent = 'Score: ' + score
  }

  document.querySelectorAll('.mole').forEach((mole) => mole.addEventListener('click', whack))
  document.querySelectorAll('.obstacle').forEach((obstacle) => obstacle.addEventListener('click', whack))
  document.getElementById('start-button').addEventListener('click', startGame)
}
