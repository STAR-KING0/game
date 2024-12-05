const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to fit Android view
function resizeCanvas() {
  const maxWidth = 800;  // Max width for the canvas
  const maxHeight = 400; // Max height for the canvas
  
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Scale the canvas to fit within screen size, while maintaining a 2:1 aspect ratio (800x400)
  let width = Math.min(screenWidth, maxWidth);
  let height = width * (maxHeight / maxWidth);

  // If height exceeds screen, adjust it
  if (height > screenHeight) {
    height = screenHeight;
    width = height * (maxWidth / maxHeight);
  }

  // Apply calculated width and height to canvas
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas); // Adjust on resize

// Game variables
let player = { x: 50, y: canvas.height - 100, width: 50, height: 50, speed: 7 };
let hearts = [];
let obstacles = [];
let score = 0;
let level = 1;
let gameOver = false;

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
    speed: 2 + Math.random() * 2 * level,
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

function drawScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 120, canvas.height / 2 + 50);
  document.getElementById('restartButton').style.display = 'block'; // Show the restart button
}

// Function to reset game variables
function resetGame() {
  player = { x: 50, y: canvas.height - 100, width: 50, height: 50, speed: 7 };
  hearts = [];
  obstacles = [];
  score = 0;
  level = 1;
  gameOver = false;
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('level').textContent = `Level: ${level}`;
  document.getElementById('restartButton').style.display = 'none'; // Hide the restart button
  gameLoop(); // Start the game again
}

// Event listener for restart button
document.getElementById('restartButton').addEventListener('click', resetGame);

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    drawBackground(); // Draw background first
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
    drawBackground(); // Draw background even on game over
    drawGameOver();
  }
}

// Start game
gameLoop();