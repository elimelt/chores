class UIManager {
  constructor (stateManager, configManager) {
    this.stateManager = stateManager
    this.configManager = configManager
    this.setupEventListeners()
  }

  setupEventListeners () {
    this.render()
    this.setupModalListeners()
    this.setupAnimations()
  }

  setupModalListeners () {
    const modal = document.getElementById('rewardModal')
    const confirmButton = document.getElementById('confirmReward')
    const cancelButton = document.getElementById('cancelReward')
    let selectedReward = null

    window.attemptRewardRedeem = rewardId => {
      const reward = this.configManager
        .getRewards()
        .find(r => r.id === rewardId)
      if (reward) {
        selectedReward = reward
        document.getElementById(
          'modalText'
        ).textContent = `Would you like to spend ${reward.points} points on ${reward.name}?`
        modal.style.display = 'flex'
      }
    }

    confirmButton.addEventListener('click', () => {
      if (selectedReward) {
        this.stateManager.redeemReward(selectedReward.id)
        modal.style.display = 'none'
      }
    })

    cancelButton.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    window.addEventListener('click', event => {
      if (event.target === modal) {
        modal.style.display = 'none'
      }
    })
  }

  setupAnimations () {
    setInterval(() => this.createSparkle(), 200)
    setInterval(() => this.createFloatingHeart(), 200)
  }

  createSparkle () {
    const sparkle = document.createElement('div')
    sparkle.className = 'sparkle'
    sparkle.innerHTML = ['✨', '🌸', '💖', '⭐', '🩷'][
      Math.floor(Math.random() * 5)
    ]
    sparkle.style.left = `${Math.random() * 100}%`
    sparkle.style.top = `${Math.random() * 100}%`
    sparkle.style.fontSize = `${Math.random() * 20 + 40}px`
    document.querySelector('.container').appendChild(sparkle)
    setTimeout(() => sparkle.remove(), 2000)
  }

  createFloatingHeart () {
    const heart = document.createElement('div')
    heart.className = 'heart'
    heart.innerHTML = ['🌸', '💗', '💖', '💝', '🎀'][
      Math.floor(Math.random() * 5)
    ]
    heart.style.left = `${Math.random() * 100}%`
    heart.style.fontSize = `${Math.random() * 15 + 10}px`
    document.querySelector('.container').appendChild(heart)
    setTimeout(() => heart.remove(), 3000)
  }

  render () {
    this.renderHabits()
    this.renderRewards()
    this.renderTodaysTasks()
  }

  renderHabits () {
    const habitGrid = document.getElementById('habitGrid')
    if (!habitGrid) return

    const habits = this.configManager.getHabits()
    habitGrid.innerHTML = habits
      .map(habit => {
        const habitState = this.stateManager.state.habits[habit.id]
        return `
        <div class="habit-card animate__animated animate__fadeIn">
          <div class="habit-title">${habit.emoji} ${habit.name}</div>
          <div>Goal: ${habit.target}</div>
          <div class="habit-streak">✨ Streak: ${
            habitState?.streak || 0
          } days</div>
          <input type="checkbox"
                 class="habit-checkbox"
                 id="${habit.id}"
                 ${habitState?.completed ? 'checked' : ''}
                 onchange="stateManager.toggleHabit('${habit.id}')">
        </div>
      `
      })
      .join('')
  }

  renderRewards () {
    const rewardsContainer = document.getElementById('rewardsContainer')
    if (!rewardsContainer) return

    const points = this.stateManager.state.points
    const rewards = this.configManager.getRewards()

    rewardsContainer.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(
          (points / 500) * 100,
          100
        )}%"></div>
      </div>
      <div class="points-display">✨ ${points} Points ✨</div>
      ${rewards
        .map(
          reward => `
        <div class="reward-item ${points < reward.points ? 'disabled' : ''}"
             onclick="attemptRewardRedeem('${reward.id}')">
          <span class="reward-name">${reward.name}</span>
          <span class="reward-points">${reward.points} points</span>
        </div>
      `
        )
        .join('')}
    `
  }

  renderTodaysTasks () {
    const todayTasksContainer = document.getElementById('todayTasks')
    if (!todayTasksContainer) return

    const todaysTasks = this.stateManager.getScheduleForDay()
    const people = this.configManager.getPeople()
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    const today = new Date()

    todayTasksContainer.innerHTML = `
      <div class="today-task-card person1-card animate__animated animate__bounceIn">
        <div class="person-name">✨ ${people[0]} ✨</div>
        <div class="task-description">
          ${
            todaysTasks[0] === 'Dishes'
              ? '🍽️ Dishes'
              : todaysTasks[0] === 'Floors'
              ? '🧹 Floors'
              : '🚽 Bathroom'
          }
        </div>
      </div>
      <div class="today-task-card person2-card animate__animated animate__bounceIn">
        <div class="person-name">✨ ${people[1]} ✨</div>
        <div class="task-description">
          ${
            todaysTasks[1] === 'Dishes'
              ? '🍽️ Dishes'
              : todaysTasks[1] === 'Floors'
              ? '🧹 Floors'
              : '🚽 Bathroom'
          }
        </div>
      </div>
      <div class="date-display animate__animated animate__fadeIn">
        🌸 ${today.toLocaleDateString('en-US', dateOptions)} 🌸
      </div>
    `
  }
}
