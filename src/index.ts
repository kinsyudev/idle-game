import Game from "./core/game";

// Initialize the game
async function startGame() {
  const game = new Game();
  await game.init();
  
  // Expose game instance to the window for debugging
  (window as any).game = game;
  
  console.log('Game started!');
}

// Start the game
startGame().catch(error => {
  console.error('Failed to start the game:', error);
});