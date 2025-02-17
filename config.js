class ConfigManager {
  constructor () {
    this.defaultHabits = [
      { id: 'water', name: 'Drink Water', emoji: '💧', target: '1/2 gallon' },
      { id: 'exercise', name: 'Exercise', emoji: '🏃‍♀️', target: '30 minutes' },
      { id: 'skincare', name: 'Skincare', emoji: '✨', target: 'AM & PM' },
      { id: 'stretch', name: 'Stretch', emoji: '🧘‍♀️', target: '10 minutes' },
      { id: 'shower', name: 'Shower', emoji: '🚿', target: 'Every day' },
      { id: 'chores', name: 'Chores', emoji: '🧹', target: '1 task' }
    ]

    this.defaultRewards = [
      { id: 'movie-night', points: 180, name: '🎬 Movie Night' },
      { id: 'sweet-treat', points: 200, name: '🍬 Sweet Treat' },
      { id: 'coffee-shop', points: 300, name: '☕ Coffee Shop Visit' },
      { id: 'chore-day-off', points: 400, name: '🎉 Chore Day Off' },
      { id: 'takeout', points: 500, name: '🍱 Takeout Dinner' },
      { id: 'back-scratches', points: 500, name: '🤗 Scratches (30 min)' }
    ]

    this.defaultSchedule = Array(14).fill(['Dishes', 'Floors'])
    this.defaultSchedule[4] = ['Dishes', 'Bathroom']
    this.defaultSchedule[13] = ['Bathroom', 'Floors']

    this.initialize()
  }

  initialize () {
    const savedHabits = localStorage.getItem('configHabits')
    this.habits = savedHabits ? JSON.parse(savedHabits) : this.defaultHabits

    const savedRewards = localStorage.getItem('configRewards')
    this.rewards = savedRewards ? JSON.parse(savedRewards) : this.defaultRewards

    const savedSchedule = localStorage.getItem('configSchedule')
    this.schedule = savedSchedule
      ? JSON.parse(savedSchedule)
      : this.defaultSchedule

    const savedPeople = localStorage.getItem('configPeople')
    this.people = savedPeople ? JSON.parse(savedPeople) : ['Elijah', 'Haley']

    console.log('ConfigManager initialized:', {
      habits: this.habits,
      rewards: this.rewards,
      schedule: this.schedule,
      people: this.people
    })
  }

  saveHabits (habits) {
    this.habits = habits
    localStorage.setItem('configHabits', JSON.stringify(habits))
  }

  saveRewards (rewards) {
    this.rewards = rewards
    localStorage.setItem('configRewards', JSON.stringify(rewards))
  }

  saveSchedule (schedule) {
    this.schedule = schedule
    localStorage.setItem('configSchedule', JSON.stringify(schedule))
  }

  savePeople (people) {
    this.people = people
    localStorage.setItem('configPeople', JSON.stringify(people))
  }

  getHabits () {
    return this.habits
  }

  getRewards () {
    return this.rewards
  }

  getSchedule () {
    return this.schedule
  }

  getPeople () {
    return this.people
  }

  resetToDefaults () {
    this.habits = this.defaultHabits
    this.rewards = this.defaultRewards
    this.schedule = this.defaultSchedule
    this.people = ['Elijah', 'Haley']

    localStorage.setItem('configHabits', JSON.stringify(this.defaultHabits))
    localStorage.setItem('configRewards', JSON.stringify(this.defaultRewards))
    localStorage.setItem('configSchedule', JSON.stringify(this.defaultSchedule))
    localStorage.setItem('configPeople', JSON.stringify(['Elijah', 'Haley']))
  }
}
