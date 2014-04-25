animationDelay = 1;
minSearchTime = 50;
timesToRunExperiment = 1000;

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
});
