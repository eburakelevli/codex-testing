// Simple Flappy Bird clone using Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Bird properties
// Bird properties
let bird = {
  x: 50,
  // Start in middle of canvas
  y: H / 2,
  radius: 12,
  // Reduced gravity for slower fall
  gravity: 0.3,
  // Increased lift for stronger, but still smooth flap
  lift: -12,
  velocity: 0
};

// Pipes array
let pipes = [];
const pipeWidth = 40;
// Increased gap for easier passage
const gap = 300;
let frameCount = 0;
let score = 0;
let highScore = 0;
let gameOver = false;

// Input controls
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    bird.velocity = bird.lift;
    if (gameOver) resetGame();
  }
});
canvas.addEventListener('click', () => {
  bird.velocity = bird.lift;
  if (gameOver) resetGame();
});

// Reset game state
function resetGame() {
  bird.y = H / 2;
  bird.velocity = 0;
  pipes = [];
  frameCount = 0;
  score = 0;
  gameOver = false;
  loop();
}

// Main loop
function loop() {
  // Clear
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, W, H);

  // Add new pipes (spawn less frequently for more space)
  if (frameCount % 150 === 0) {
    const topHeight = Math.random() * (H - gap - 100) + 20;
    pipes.push({ x: W, top: topHeight, bottom: topHeight + gap, passed: false });
  }

  // Draw and update pipes
  pipes.forEach((p, i) => {
    // Slower pipe movement for easier play
    p.x -= 1.0;
    ctx.fillStyle = '#228B22';
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, p.bottom, pipeWidth, H - p.bottom);

    // Collision detection
    if (
      bird.x + bird.radius > p.x &&
      bird.x - bird.radius < p.x + pipeWidth &&
      (bird.y - bird.radius < p.top || bird.y + bird.radius > p.bottom)
    ) {
      gameOver = true;
    }
    // Score
    if (!p.passed && p.x + pipeWidth < bird.x) {
      score++;
      p.passed = true;
    }
  });

  // Remove offscreen pipes
  pipes = pipes.filter(p => p.x + pipeWidth > 0);

  // Draw bird
  ctx.fillStyle = '#FFC300';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // Physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Ground/Ceiling collision
  if (bird.y + bird.radius > H || bird.y - bird.radius < 0) {
    gameOver = true;
  }

  // Draw score
  ctx.fillStyle = '#FFF';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 25);
  ctx.fillText(`High: ${highScore}`, 10, 50);

  // Game over screen
  if (gameOver) {
    if (score > highScore) highScore = score;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', W / 2 - 80, H / 2 - 20);
    ctx.font = '18px Arial';
    ctx.fillText('Click or Space to Restart', W / 2 - 110, H / 2 + 20);
  } else {
    frameCount++;
    requestAnimationFrame(loop);
  }
}

// Start the game
loop();