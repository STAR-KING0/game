const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Game variables
let player = { x: 50, y: 350, width: 50, height: 50, speed: 7 }; // Increased speed
let hearts = [];
let obstacles = [];
let score = 0;
let level = 1;
let gameOver = false;

// Touch target variables
let touchTarget = null;

// Sprite animation variables
const SPRITE_WIDTH = 50;  // Width of a single frame in the sprite sheet
const SPRITE_HEIGHT = 50; // Height of a single frame in the sprite sheet
let frameX = 0;           // Current frame on the X-axis
let frameY = 0;           // Current animation row (e.g., for direction)
let frameCount = 6;       // Number of frames in the sprite sheet row
let animationSpeed = 5;   // Frame change speed
let frameDelay = 0;       // Counter for animation speed control

// Load images
const playerImage = new Image();
playerImage.src = 'https://files.catbox.moe/gkgthk.png'; // Akari sprite sheet
const heartImage = new Image();
heartImage.src = 'https://files.catbox.moe/yriu1r.png'; // Heart sprite
const obstacleImage = new Image();
obstacleImage.src = 'https://files.catbox.moe/j4mdih.png'; // Obstacle sprite

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', () => {
  touchTarget = null; // Stop moving when touch ends
});

function handleTouch(event) {
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchTarget = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

// Heart and obstacle creation
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
    speed: 2 + Math.random() * 2 * level, // Increase speed with levels
  });
}

// Update player position
function updatePlayer() {
  if (touchTarget) {
    const dx = touchTarget.x - (player.x + player.width / 2);
    const dy = touchTarget.y - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
      player.x += (dx / distance) * player.speed;
      player.y += (dy / distance) * player.speed;

      // Set animation direction based on movement
      if (Math.abs(dx) > Math.abs(dy)) {
        frameY = dx > 0 ? 2 : 1; // Right or Left row in sprite sheet
      } else {
        frameY = dy > 0 ? 0 : 3; // Down or Up row in sprite sheet
      }
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

// Update hearts and obstacles
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

      if (score % 10 === 0) {
        level++;
        document.getElementById('level').textContent = `Level: ${level}`;
      }
    }
  });

  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacle.speed;

    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
    }

    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
    }
  });
}

// Draw game objects
function drawPlayer() {
  // Update animation frame
  if (frameDelay++ > animationSpeed) {
    frameX = (frameX + 1) % frameCount; // Loop through frames
    frameDelay = 0;
  }

  // Draw current frame
  ctx.drawImage(
    playerImage,
    frameX * SPRITE_WIDTH, // Source X
    frameY * SPRITE_HEIGHT, // Source Y
    SPRITE_WIDTH,
    SPRITE_HEIGHT,
    player.x,
    player.y,
    player.width,
    player.height
  );
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
  document.getElementById('score').textContent = `Score: ${score}`;
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

    if (Math.random() < 0.01) createHeart();
    if (Math.random() < 0.02 + level * 0.01) createObstacle();

    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

// Start game
gameLoop();