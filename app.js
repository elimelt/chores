const stateManager = new StateManager();
const uiManager = new UIManager(stateManager);

stateManager.initialize();
stateManager.addListener(() => uiManager.render());

window.stateManager = stateManager;