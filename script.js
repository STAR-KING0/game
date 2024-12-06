const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize Canvas
function resizeCanvas() {
  const maxWidth = 800;
  const maxHeight = 400;

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
let particles = [];
let score = 0;
let level = 1;
let gameOver = false;
let health = 100;

// Touch control
let touchTarget = null;

// Load images
const playerImage = new Image();
playerImage.src = 'https://files.catbox.moe/ea7tfh.png';
const heartImage = new Image();
heartImage.src = 'https://files.catbox.moe/uy48ql.png';
const obstacleImage = new Image();
obstacleImage.src = 'https://files.catbox.moe/2kgddw.png';
const powerUpImage = new Image();
powerUpImage.src = 'https://files.catbox.moe/4ntnjp.png';
const backgroundImage = new Image();
backgroundImage.src = 'https://files.catbox.moe/rfkk9n.jpeg';

// Load sounds
const heartSound = new Audio('https://files.catbox.moe/ygqrcb.mp3');
const powerUpSound = new Audio('https://files.catbox.moe/yuulgv.mp3');
const backgroundMusic = new Audio('https://files.catbox.moe/a8bwj4.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

// Event listeners
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', () => (touchTarget = null));
document.getElementById('restartButton').addEventListener('click', resetGame);

function handleTouch(event) {
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchTarget = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}

// Create objects
function createHeart() {
  hearts.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height / 2, width: 30, height: 30 });
}

function createObstacle() {
  obstacles.push({ x: Math.random() * canvas.width, y: -50, width: 30, height: 30, speed: 2 + Math.random() * level });
}

function createPowerUp() {
  powerUps.push({ x: Math.random() * canvas.width, y: -50, width: 30, height: 30, speed: 3 });
}

// Create particles
function createParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x,
      y,
      size: Math.random() * 5,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 - 2,
      color,
      life: 50,
    });
  }
}

// Update player
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

  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

// Update objects
function updateObjects() {
  hearts.forEach((heart, i) => {
    if (checkCollision(player, heart)) {
      hearts.splice(i, 1);
      score++;
      heartSound.play();
      createParticles(heart.x + 15, heart.y + 15, 'red');
      if (score % 10 === 0) level++;
    }
  });

  obstacles.forEach((obstacle, i) => {
    obstacle.y += obstacle.speed;
    if (checkCollision(player, obstacle)) {
      health -= 20;
      obstacles.splice(i, 1);
      createParticles(obstacle.x + 15, obstacle.y + 15, 'black');
      if (health <= 0) gameOver = true;
    }
  });

  powerUps.forEach((powerUp, i) => {
    powerUp.y += powerUp.speed;
    if (checkCollision(player, powerUp)) {
      health = Math.min(100, health + 30);
      powerUps.splice(i, 1);
      powerUpSound.play();
      createParticles(powerUp.x + 15, powerUp.y + 15, 'yellow');
    }
  });
}

// Update particles
function updateParticles() {
  particles.forEach((particle, i) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.life--;
    if (particle.life <= 0) particles.splice(i, 1);
  });
}

// Check collision
function checkCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// Draw functions
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawHealthBar() {
  const barWidth = 200;
  const barHeight = 20;
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, barWidth, barHeight);
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, (health / 100) * barWidth, barHeight);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(10, 10, barWidth, barHeight);
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
}

// Reset game
function resetGame() {
  player = { x: 50, y: canvas.height - 100, width: 50, height: 50, speed: 7 };
  hearts = [];
  obstacles = [];
  powerUps = [];
  particles = [];
  score = 0;
  level = 1;
  health = 100;
  gameOver = false;
  document.getElementById('restartButton').style.display = 'none';
  backgroundMusic.play();
  gameLoop();
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    drawBackground();
    updatePlayer();
    updateObjects();
    updateParticles();

    drawPlayer();
    drawHealthBar();
    drawParticles();

    if (Math.random() < 0.01) createHeart();
    if (Math.random() < 0.02 + level * 0.01) createObstacle();
    if (Math.random() < 0.005) createPowerUp();

    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
    backgroundMusic.pause();
  }
}

// Start game on interaction
window.onload = () => {
  resizeCanvas();
  backgroundImage.onload = () => {
    document.body.addEventListener('click', () => {
      backgroundMusic.play();
      gameLoop();
    });
  };
};