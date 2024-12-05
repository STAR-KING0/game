const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 400;
canvas.height = 600;

// Game variables
let player = { x: 200, y: 500, width: 20, height: 20, dx: 0, dy: 0, gravity: 0.5, jump: -10, score: 0 };
let platforms = [];
const platformCount = 6;
const platformWidth = 80;
const platformHeight = 10;
const keys = { left: false, right: false };

// Initialize platforms
for (let i = 0; i < platformCount; i++) {
  platforms.push({
    x: Math.random() * (canvas.width - platformWidth),
    y: canvas.height - i * 100,
    width: platformWidth,
    height: platformHeight
  });
}

// Listen for keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
});

// Update player position
function updatePlayer() {
  if (keys.left) player.dx = -3;
  else if (keys.right) player.dx = 3;
  else player.dx = 0;

  player.dy += player.gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Keep player inside canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Bounce on platforms
  platforms.forEach((platform) => {
    if (
      player.y + player.height <= platform.y &&
      player.y + player.height + player.dy >= platform.y &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width
    ) {
      player.dy = player.jump;
      player.score++;
    }
  });

  // Reset if player falls
  if (player.y > canvas.height) {
    alert('Game Over! Score: ' + player.score);
    document.location.reload();
  }
}

// Move platforms
function updatePlatforms() {
  platforms.forEach((platform) => {
    platform.y += 2;

    // Reset platform when it goes off screen
    if (platform.y > canvas.height) {
      platform.y = 0;
      platform.x = Math.random() * (canvas.width - platformWidth);
    }
  });
}

// Draw game objects
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
function drawPlatforms() {
  ctx.fillStyle = 'green';
  platforms.forEach((platform) => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + player.score, 10, 20);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  updatePlatforms();
  drawPlayer();
  drawPlatforms();
  drawScore();

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();