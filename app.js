document.addEventListener('DOMContentLoaded', () => {
  window.configManager = new ConfigManager()

  const stateManager = new StateManager(configManager)
  const uiManager = new UIManager(stateManager, configManager)
  const settingsManager = new SettingsManager(stateManager, configManager)

  stateManager.initialize()

  stateManager.addListener(() => uiManager.render())

  window.stateManager = stateManager
  window.uiManager = uiManager
  window.settingsManager = settingsManager

  uiManager.render()

  console.log('App initialized', {
    configManager: window.configManager,
    stateManager: window.stateManager,
    uiManager: window.uiManager,
    settingsManager: window.settingsManager
  })
})
