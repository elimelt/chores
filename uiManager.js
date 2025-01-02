class UIManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.render();
      this.setupModalListeners();
      this.setupAnimations();
    });
  }

  setupModalListeners() {
    const modal = document.getElementById('rewardModal');
    const confirmButton = document.getElementById('confirmReward');
    const cancelButton = document.getElementById('cancelReward');
    let selectedReward = null;

    window.attemptRewardRedeem = (rewardId) => {
      const reward = REWARDS.find(r => r.id === rewardId);
      if (reward) {
        selectedReward = reward;
        document.getElementById('modalText').textContent = 
          `Would you like to spend ${reward.points} points on ${reward.name}?`;
        modal.style.display = 'flex';
      }
    };

    confirmButton.addEventListener('click', () => {
      if (selectedReward) {
        this.stateManager.redeemReward(selectedReward.id);
        modal.style.display = 'none';
      }
    });

    cancelButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  setupAnimations() {
    setInterval(() => this.createSparkle(), 300);
    setInterval(() => this.createFloatingHeart(), 2000);
  }

  createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = ['✨', '🌸', '💖', '⭐'][Math.floor(Math.random() * 4)];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.fontSize = `${Math.random() * 20 + 10}px`;
    document.querySelector('.container').appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 2000);
  }

  createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = ['🌸', '💗', '💖', '💝', '🎀'][Math.floor(Math.random() * 5)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${Math.random() * 15 + 10}px`;
    document.querySelector('.container').appendChild(heart);

    setTimeout(() => heart.remove(), 3000);
  }

  render() {
    this.renderHabits();
    this.renderRewards();
    this.renderTodaysTasks();
  }

  renderHabits() {
    const habitGrid = document.getElementById('habitGrid');
    if (!habitGrid) return;

    habitGrid.innerHTML = HABITS.map(habit => {
      const habitState = this.stateManager.state.habits[habit.id];
      return `
        <div class="habit-card animate__animated animate__fadeIn">
          <div class="habit-title">${habit.emoji} ${habit.name}</div>
          <div>Goal: ${habit.target}</div>
          <div class="habit-streak">✨ Streak: ${habitState?.streak || 0} days</div>
          <input type="checkbox"
                 class="habit-checkbox"
                 id="${habit.id}"
                 ${habitState?.completed ? 'checked' : ''}
                 onchange="stateManager.toggleHabit('${habit.id}')">
        </div>
      `;
    }).join('');
  }

  renderRewards() {
    const rewardsContainer = document.getElementById('rewardsContainer');
    if (!rewardsContainer) return;

    const points = this.stateManager.state.points;
    rewardsContainer.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min((points / 500) * 100, 100)}%"></div>
      </div>
      <div class="points-display">✨ ${points} Magic Points ✨</div>
      ${REWARDS.map(reward => `
        <div class="reward-item ${points < reward.points ? 'disabled' : ''}"
             onclick="attemptRewardRedeem('${reward.id}')">
          <span class="reward-name">${reward.name}</span>
          <span class="reward-points">${reward.points} points</span>
        </div>
      `).join('')}
    `;
  }

  renderTodaysTasks() {
    const todayTasksContainer = document.getElementById('todayTasks');
    if (!todayTasksContainer) return;

    const startDate = new Date(2025, 0, 1);
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const dayInCycle = daysDiff % 14;
    const todaysTasks = CHORE_SCHEDULE[dayInCycle];

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    todayTasksContainer.innerHTML = `
      <div class="today-task-card elijah-card animate__animated animate__bounceIn">
        <div class="person-name">✨ Elijah ✨</div>
        <div class="task-description">
          ${todaysTasks[0] === 'Dishes' ? '🍽️ Dishes' : 
            todaysTasks[0] === 'Floors' ? '🧹 Floors' : '🚽 Bathroom'}
        </div>
      </div>
      <div class="today-task-card haley-card animate__animated animate__bounceIn">
        <div class="person-name">✨ Haley ✨</div>
        <div class="task-description">
          ${todaysTasks[1] === 'Dishes' ? '🍽️ Dishes' : 
            todaysTasks[1] === 'Floors' ? '🧹 Floors' : '🚽 Bathroom'}
        </div>
      </div>
      <div class="date-display animate__animated animate__fadeIn">
        🌸 ${today.toLocaleDateString('en-US', dateOptions)} 🌸
      </div>
    `;
  }
}