const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
let score = 0;
let bubbleInterval = 800;
let bombsToSpawn = 0;

// Store active item positions to avoid overlaps
let activePositions = [];

// Function to create a bubble or bomb
function createItem(isBomb = false) {
  const item = document.createElement("div");
  item.classList.add(isBomb ? "bomb" : "bubble");

  // Random size
  const size = Math.random() * 50 + 40; // Between 40 and 90px
  item.style.width = `${size}px`;
  item.style.height = `${size}px`;

  // Determine a position that doesn't overlap
  let leftPosition;
  do {
    leftPosition = Math.random() * (gameArea.clientWidth - size); // Random horizontal position
  } while (checkOverlap(leftPosition, size));
  activePositions.push({ left: leftPosition, size });
  item.style.left = `${leftPosition}px`;

  // Start at the top
  item.style.top = `-80px`;

  // Set random animation duration
  item.style.animationDuration = `${Math.random() * 3 + 3}s`; // 3 to 6 seconds

  // Click behavior
  item.addEventListener("click", () => {
    if (isBomb) {
      score--; // Decrease score for bomb
      bombsToSpawn--; // Decrease remaining bombs to spawn
    } else {
      score++; // Increase score for bubble
    }
    scoreElement.textContent = score; // Update the score
    item.remove(); // Remove the clicked item
    clearPosition(leftPosition, size); // Clear the position
    checkForBombSpawn(); // Check if it's time to spawn bombs
  });

  // Remove item when it reaches the bottom
  item.addEventListener("animationend", () => {
    item.remove();
    clearPosition(leftPosition, size); // Clear the position
  });

  gameArea.appendChild(item);
}

// Check if a position overlaps with any active items
function checkOverlap(left, size) {
  for (const pos of activePositions) {
    if (left < pos.left + pos.size && left + size > pos.left) {
      return true; // Overlaps
    }
  }
  return false; // No overlap
}

// Clear the position after the item is removed
function clearPosition(left, size) {
  activePositions = activePositions.filter(
    (pos) => !(pos.left === left && pos.size === size)
  );
}

// Check if it's time to spawn bombs
function checkForBombSpawn() {
  if (score >= 30 && score % 30 === 0 && bombsToSpawn === 0) {
    bombsToSpawn = 5; // Spawn 5 bombs every 30 points
  }
}

// Adjust the bubble generation speed based on the score
function adjustSpeed() {
  if (score < 30) {
    bubbleInterval = Math.max(300, 800 - score * 20); // Gradually reduce interval
  }
}

// Main game loop
function gameLoop() {
  if (bombsToSpawn > 0) {
    createItem(true); // Create a bomb
  } else {
    createItem(false); // Create a bubble
  }
  adjustSpeed(); // Adjust the bubble generation speed
  setTimeout(gameLoop, bubbleInterval); // Schedule the next item
}

// Start the game loop
gameLoop();