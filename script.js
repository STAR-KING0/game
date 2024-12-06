const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to fit Android view
function resizeCanvas() {
  const maxWidth = 800; // Max width for the canvas
  const maxHeight = 400; // Max height for the canvas
  
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let width = Math.min(screenWidth, maxWidth);
  let height = width * (maxHeight / maxWidth);

  if (height > screenHeight) {
    height = screenHeight;
    width = height * (maxWidth / maxHeight);
  }

  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game variables
let player = { x: 50, y: canvas.height - 100, width: 50, height: 50, speed: 7 };
let hearts = [];
let obstacles = [];
let powerUps = [];
let score = 0;
let level = 1;
let gameOver = false;
let health = 100;
let powerUpActive = false;
let powerUpTimer = 0;

// Touch target variables
let touchTarget = null;

// Load images
const playerImage = new Image();
playerImage.src = 'https://files.catbox.moe/ea7tfh.png'; // Akari sprite
const heartImage = new Image();
heartImage.src = 'https://files.catbox.moe/uy48ql.png'; // Heart sprite
const obstacleImage = new Image();
obstacleImage.src = 'https://files.catbox.moe/2kgddw.png'; // Obstacle sprite
const backgroundImage = new Image();
backgroundImage.src = 'https://files.catbox.moe/rfkk9n.jpeg'; // Background image
const powerUpImage = new Image();
powerUpImage.src = 'https://files.catbox.moe/4ntnjp.png'; // Power-up sprite

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', () => {
  touchTarget = null;
});

function handleTouch(event) {
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchTarget = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

// Object creation functions
function createHeart() {
  hearts.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    width: 30,
    height: 30,
  });
}

function createObstacle() {
  obstacles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    width: 30,
    height: 30,
    speed: 2 + Math.random() * 2 * level,
  });
}

function createPowerUp() {
  powerUps.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    width: 30,
    height: 30,
  });
}

// Update functions
function updatePlayer() {
  if (touchTarget) {
    const dx = touchTarget.x - (player.x + player.width / 2);
    const dy = touchTarget.y - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
      player.x += (dx / distance) * player.speed;
      player.y += (dy / distance) * player.speed;
    } else {
      player.x = touchTarget.x - player.width / 2;
      player.y = touchTarget.y - player.height / 2;
    }
  }

  // Boundary check
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updateObjects() {
  hearts.forEach((heart, index) => {
    if (
      player.x < heart.x + heart.width &&
      player.x + player.width > heart.x &&
      player.y < heart.y + heart.height &&
      player.y + player.height > heart.y
    ) {
      hearts.splice(index, 1);
      score++;
      if (score % 10 === 0) level++;
    }
  });

  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacle.speed;

    if (
      !powerUpActive && // Only damage if not invincible
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      health -= 20;
      obstacles.splice(index, 1);

      if (health <= 0) gameOver = true;
    }

    if (obstacle.y > canvas.height) obstacles.splice(index, 1);
  });

  powerUps.forEach((powerUp, index) => {
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      powerUps.splice(index, 1);
      activatePowerUp();
    }
  });
}

function activatePowerUp() {
  health = 100; // Restore full health
  powerUpActive = true;
  powerUpTimer = 300; // Invincibility lasts for ~5 seconds
}

function managePowerUpEffect() {
  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) powerUpActive = false;
  }
}

// Draw functions
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

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

function drawPowerUps() {
  powerUps.forEach((powerUp) => {
    ctx.drawImage(powerUpImage, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  });
}

function drawHealthBar() {
  const barWidth = 200;
  const barHeight = 20;
  const barX = 10;
  const barY = 10;

  ctx.fillStyle = 'red';
  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = 'green';
  ctx.fillRect(barX, barY, (health / 100) * barWidth, barHeight);

  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Health: ${health}`, barX + 50, barY + 15);
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);
}

function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 120, canvas.height / 2 + 50);
  document.getElementById('restartButton').style.display = 'block';
}

// Reset game
function resetGame() {
  player = { x: 50, y: canvas.height - 100, width: 50, height: 50, speed: 7 };
  hearts = [];
  obstacles = [];
  powerUps = [];
  score = 0;
  level = 1;
  health = 100;
  powerUpActive = false;
  gameOver = false;
  gameLoop();
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    drawBackground();
    updatePlayer();
    updateObjects();
    managePowerUpEffect();
    drawPlayer();
    drawHearts();
    drawObstacles();
    drawPowerUps();
    drawHealthBar();
    drawScore();

    if (Math.random() < 0.01) createHeart();
    if (Math.random() < 0.02 + level * 0.01) createObstacle();
    if (Math.random() < 0.005) createPowerUp();

    requestAnimationFrame(gameLoop);
  } else {
    drawBackground();
    drawGameOver();
  }
}

// Start game
gameLoop();