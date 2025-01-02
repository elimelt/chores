class StateManager {
  constructor() {
    this.state = {
      habits: {},
      points: 0,
      lastReset: new Date().toISOString(),
      redeemedRewards: []
    };
    this.listeners = new Set();
  }

  initialize() {
    const savedState = localStorage.getItem('magicalLifeTracker');
    if (savedState) {
      this.state = JSON.parse(savedState);
      this.checkReset();
    } else {
      this.resetState();
    }
  }

  checkReset() {
    const lastReset = new Date(this.state.lastReset);
    const now = new Date();
    const daysSinceReset = (now - lastReset) / (1000 * 60 * 60 * 24);
    if (daysSinceReset >= 14) {
      this.resetState();
    }
  }

  resetState() {
    this.state = {
      habits: HABITS.reduce((acc, habit) => {
        acc[habit.id] = {
          streak: 0,
          lastCompleted: null,
          completed: false
        };
        return acc;
      }, {}),
      points: this.state?.points || 0,
      lastReset: new Date().toISOString(),
      redeemedRewards: this.state?.redeemedRewards || []
    };
    this.save();
  }

  save() {
    localStorage.setItem('magicalLifeTracker', JSON.stringify(this.state));
    this.notifyListeners();
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }

  toggleHabit(habitId) {
    const habit = this.state.habits[habitId];
    const today = new Date().toDateString();

    if (!habit.completed) {
      if (habit.lastCompleted === today) {
        habit.streak++;
      } else {
        habit.streak = 1;
      }
      habit.completed = true;
      habit.lastCompleted = today;
      this.state.points += 10;
      NotificationManager.show('✨ +10 points! Keep up the magic! ✨');
    } else {
      habit.completed = false;
      this.state.points = Math.max(0, this.state.points - 10);
    }

    this.save();
  }

  redeemReward(rewardId) {
    const reward = REWARDS.find(r => r.id === rewardId);
    if (!reward || this.state.points < reward.points) {
      NotificationManager.show('✨ Not enough points for this reward! ✨');
      return false;
    }

    this.state.points -= reward.points;
    this.state.redeemedRewards.push({
      id: rewardId,
      redeemedAt: new Date().toISOString()
    });
    
    this.save();
    NotificationManager.show(`✨ Redeemed ${reward.name}! ✨`);
    return true;
  }
}