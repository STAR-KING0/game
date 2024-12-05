const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Game variables
let player = { x: 50, y: 350, width: 50, height: 50, dx: 0, dy: 0, speed: 5 };
let hearts = [];
let obstacles = [];
let score = 0;
let level = 1;
let gameOver = false;

// Controls
const keys = { left: false, right: false, up: false, down: false };

// Load images directly from URLs
const playerImage = new Image();
playerImage.src = 'https://files.catbox.moe/gkgthk.png'; // Akari sprite
const heartImage = new Image();
heartImage.src = 'https://files.catbox.moe/yriu1r.png'; // Heart sprite
const obstacleImage = new Image();
obstacleImage.src = 'https://files.catbox.moe/j4mdih.png'; // Obstacle sprite

// Listen for key presses
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === 'ArrowUp') keys.up = true;
  if (e.key === 'ArrowDown') keys.down = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === 'ArrowUp') keys.up = false;
  if (e.key === 'ArrowDown') keys.down = false;
});

// Heart and obstacle creation
function createHeart() {
  hearts.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    width: 30,
    height: 30
  });
}

function createObstacle() {
  obstacles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    width: 30,
    height: 30,
    speed: 2 + Math.random() * 2 * level // Increase speed with levels
  });
}

// Update player position
function updatePlayer() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  if (keys.up) player.y -= player.speed;
  if (keys.down) player.y += player.speed;

  // Boundary check
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Update hearts and obstacles
function updateObjects() {
  hearts.forEach((heart, index) => {
    // Check collision with player
    if (
      player.x < heart.x + heart.width &&
      player.x + player.width > heart.x &&
      player.y < heart.y + heart.height &&
      player.y + player.height > heart.y
    ) {
      hearts.splice(index, 1);
      score++;

      // Increase level every 10 points
      if (score % 10 === 0) {
        level++;
        alert(`You've reached Level ${level}! Akari is impressed!`);
      }
    }
  });

  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacle.speed;

    // Check collision with player
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
    }

    // Remove obstacle if off screen
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
    }
  });
}

// Draw game objects
function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawHearts() {
  hearts.forEach((heart) => {
    ctx.drawImage(heartImage, heart.x, heart.y, heart.width, heart.height);
  });
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Level: ${level}`, 10, 50);
}

function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 120, canvas.height / 2 + 50);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    updatePlayer();
    updateObjects();
    drawPlayer();
    drawHearts();
    drawObstacles();
    drawScore();

    // Add new hearts and obstacles
    if (Math.random() < 0.01) createHeart();
    if (Math.random() < 0.02 + level * 0.01) createObstacle(); // Increase obstacle frequency

    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

// Start game
gameLoop();