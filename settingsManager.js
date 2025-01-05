class SettingsManager {
  constructor (stateManager, configManager) {
    this.stateManager = stateManager
    this.configManager = configManager
    this.setupEventListeners()
    this.chores = ['Dishes', 'Floors', 'Bathroom']
  }

  setupEventListeners () {
    const settingsButton = document.getElementById('settingsButton')
    const settingsModal = document.getElementById('settingsModal')
    const closeSettings = document.getElementById('closeSettings')

    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'flex'
        this.renderSettings()
      })
    }

    if (closeSettings) {
      closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none'
      })
    }

    const saveButtons = {
      saveHabits: () => this.saveHabits(),
      saveRewards: () => this.saveRewards(),
      saveSchedule: () => this.saveSchedule(),
      savePeople: () => this.savePeople()
    }

    Object.entries(saveButtons).forEach(([id, handler]) => {
      const button = document.getElementById(id)
      if (button) {
        button.addEventListener('click', handler)
      }
    })

    const resetButton = document.getElementById('resetDefaults')
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset to default settings?')) {
          this.configManager.resetToDefaults()
          this.stateManager.resetState()
          this.renderSettings()
          window.location.reload()
        }
      })
    }

    window.addEventListener('click', event => {
      if (event.target === settingsModal) {
        settingsModal.style.display = 'none'
      }
    })
  }

  renderSettings () {
    this.renderHabitsSettings()
    this.renderRewardsSettings()
    this.renderScheduleSettings()
    this.renderPeopleSettings()
  }

  renderHabitsSettings () {
    const habitsContainer = document.getElementById('habitsSettings')
    if (!habitsContainer) return

    const habits = this.configManager.getHabits()
    habitsContainer.innerHTML =
      habits
        .map(
          (habit, index) => `
      <div class="settings-item">
        <input type="text" class="habit-emoji" value="${habit.emoji}" placeholder="Emoji">
        <input type="text" class="habit-name" value="${habit.name}" placeholder="Name">
        <input type="text" class="habit-target" value="${habit.target}" placeholder="Target">
        <button class="delete-btn" onclick="settingsManager.deleteHabit(${index})">🗑️</button>
      </div>
    `
        )
        .join('') +
      `
      <button class="add-btn" onclick="settingsManager.addHabit()">+ Add Habit</button>
    `
  }

  renderRewardsSettings () {
    const rewardsContainer = document.getElementById('rewardsSettings')
    if (!rewardsContainer) return

    const rewards = this.configManager.getRewards()
    rewardsContainer.innerHTML =
      rewards
        .map(
          (reward, index) => `
      <div class="settings-item">
        <input type="text" class="reward-name" value="${reward.name}" placeholder="Name">
        <input type="number" class="reward-points" value="${reward.points}" placeholder="Points">
        <button class="delete-btn" onclick="settingsManager.deleteReward(${index})">🗑️</button>
      </div>
    `
        )
        .join('') +
      `
      <button class="add-btn" onclick="settingsManager.addReward()">+ Add Reward</button>
    `
  }

  renderScheduleSettings () {
    const scheduleContainer = document.getElementById('scheduleSettings')
    if (!scheduleContainer) return

    const schedule = this.configManager.getSchedule()
    const people = this.configManager.getPeople()

    scheduleContainer.innerHTML = schedule
      .map(
        (day, index) => `
      <div class="settings-item">
        <span class="day-label">Day ${index + 1}</span>
        <select class="person1-task">
          ${this.chores
            .map(
              task =>
                `<option ${day[0] === task ? 'selected' : ''}>${task}</option>`
            )
            .join('')}
        </select>
        <select class="person2-task">
          ${this.chores
            .map(
              task =>
                `<option ${day[1] === task ? 'selected' : ''}>${task}</option>`
            )
            .join('')}
        </select>
      </div>
    `
      )
      .join('')
  }

  renderPeopleSettings () {
    const peopleContainer = document.getElementById('peopleSettings')
    if (!peopleContainer) return

    const people = this.configManager.getPeople()
    peopleContainer.innerHTML =
      people
        .map(
          (person, index) => `
      <div class="settings-item">
        <input type="text" class="person-name" value="${person}" placeholder="Name">
        <button class="delete-btn" onclick="settingsManager.deletePerson(${index})">🗑️</button>
      </div>
    `
        )
        .join('') +
      `
      <button class="add-btn" onclick="settingsManager.addPerson()">+ Add Person</button>
    `
  }

  saveHabits () {
    const habitItems = document.querySelectorAll(
      '#habitsSettings .settings-item'
    )
    const habits = Array.from(habitItems).map(item => ({
      id: this.slugify(item.querySelector('.habit-name').value),
      emoji: item.querySelector('.habit-emoji').value,
      name: item.querySelector('.habit-name').value,
      target: item.querySelector('.habit-target').value
    }))

    this.configManager.saveHabits(habits)
    this.stateManager.resetState()
    window.location.reload()
  }

  saveRewards () {
    const rewardItems = document.querySelectorAll(
      '#rewardsSettings .settings-item'
    )
    const rewards = Array.from(rewardItems).map(item => ({
      id: this.slugify(item.querySelector('.reward-name').value),
      name: item.querySelector('.reward-name').value,
      points: parseInt(item.querySelector('.reward-points').value)
    }))

    this.configManager.saveRewards(rewards)
    window.location.reload()
  }

  saveSchedule () {
    const scheduleItems = document.querySelectorAll(
      '#scheduleSettings .settings-item'
    )
    const schedule = Array.from(scheduleItems).map(item => [
      item.querySelector('.person1-task').value,
      item.querySelector('.person2-task').value
    ])

    this.configManager.saveSchedule(schedule)
    window.location.reload()
  }

  savePeople () {
    const peopleItems = document.querySelectorAll(
      '#peopleSettings .settings-item'
    )
    const people = Array.from(peopleItems).map(
      item => item.querySelector('.person-name').value
    )

    this.configManager.savePeople(people)
    window.location.reload()
  }

  addHabit () {
    const habits = this.configManager.getHabits()
    habits.push({
      id: 'new-habit',
      emoji: '✨',
      name: 'New Habit',
      target: 'Daily'
    })
    this.configManager.saveHabits(habits)
    this.renderHabitsSettings()
  }

  deleteHabit (index) {
    const habits = this.configManager.getHabits()
    habits.splice(index, 1)
    this.configManager.saveHabits(habits)
    this.renderHabitsSettings()
  }

  addReward () {
    const rewards = this.configManager.getRewards()
    rewards.push({ id: 'new-reward', name: '✨ New Reward', points: 100 })
    this.configManager.saveRewards(rewards)
    this.renderRewardsSettings()
  }

  deleteReward (index) {
    const rewards = this.configManager.getRewards()
    rewards.splice(index, 1)
    this.configManager.saveRewards(rewards)
    this.renderRewardsSettings()
  }

  addPerson () {
    const people = this.configManager.getPeople()
    if (people.length < 2) {
      people.push('New Person')
      this.configManager.savePeople(people)
      this.renderPeopleSettings()
    } else {
      alert('Maximum of 2 people supported')
    }
  }

  deletePerson (index) {
    const people = this.configManager.getPeople()
    if (people.length > 1) {
      people.splice(index, 1)
      this.configManager.savePeople(people)
      this.renderPeopleSettings()
    } else {
      alert('At least one person is required')
    }
  }

  slugify (text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }
}
