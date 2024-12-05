const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
let score = 0;
let bubbleInterval = 800;
let bombsToSpawn = 0;
let activePositions = [];

// Observer to clean up off-screen items
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      const item = entry.target;
      item.remove();
      clearPosition(parseFloat(item.style.left), parseFloat(item.style.width));
    }
  });
});

// Function to create a bubble or bomb
function createItem(isBomb = false) {
  const item = document.createElement("div");
  item.classList.add(isBomb ? "bomb" : "bubble");

  const size = Math.random() * 50 + 40; // Size between 40 and 90px
  item.style.width = `${size}px`;
  item.style.height = `${size}px`;

  let leftPosition;
  do {
    leftPosition = Math.random() * (gameArea.clientWidth - size);
  } while (checkOverlap(leftPosition, size));
  activePositions.push({ left: leftPosition, size });
  item.style.left = `${leftPosition}px`;

  item.style.top = `-80px`;
  item.style.animationDuration = `${Math.random() * 3 + 3}s`;

  item.addEventListener("click", () => {
    if (isBomb) {
      score--;
      bombsToSpawn--;
    } else {
      score++;
    }
    scoreElement.textContent = score;
    item.remove();
    clearPosition(leftPosition, size);
    checkForBombSpawn();
  });

  observer.observe(item); // Attach observer to clean up items
  gameArea.appendChild(item);
}

// Check if a position overlaps
function checkOverlap(left, size) {
  for (const pos of activePositions) {
    if (left < pos.left + pos.size && left + size > pos.left) {
      return true;
    }
  }
  return false;
}

// Clear the position
function clearPosition(left, size) {
  activePositions = activePositions.filter(
    (pos) => !(pos.left === left && pos.size === size)
  );
}

// Check if it's time to spawn bombs
function checkForBombSpawn() {
  if (score >= 30 && score % 30 === 0 && bombsToSpawn === 0) {
    bombsToSpawn = 5; // Spawn 5 bombs
  }
}

// Adjust bubble generation speed
function adjustSpeed() {
  if (score < 30) {
    bubbleInterval = Math.max(300, 800 - score * 20);
  }
}

// Game loop using requestAnimationFrame
function gameLoop() {
  if (bombsToSpawn > 0) {
    createItem(true);
  } else {
    createItem(false);
  }
  adjustSpeed();
  setTimeout(gameLoop, bubbleInterval); // Adjust for dynamic intervals
}

// Start the game
gameLoop();