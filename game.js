const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
let score = 0;
let bubbleInterval = 800;

// Function to create a bubble or bomb
function createItem() {
  const isBomb = Math.random() < 0.3; // 30% chance to create a bomb
  const item = document.createElement("div");
  item.classList.add(isBomb ? "bomb" : "bubble");

  // Random size, position, and speed
  const size = Math.random() * 50 + 30; // Between 30 and 80px
  item.style.width = `${size}px`;
  item.style.height = `${size}px`;
  item.style.left = `${Math.random() * 90}vw`; // Random horizontal position
  item.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2 to 5 seconds

  // Click behavior
  item.addEventListener("click", () => {
    if (isBomb) {
      score--; // Decrease score for bomb
    } else {
      score++; // Increase score for bubble
    }
    scoreElement.textContent = score; // Update the score
    item.remove(); // Remove the clicked item
  });

  // Remove item when it reaches the top
  item.addEventListener("animationend", () => {
    item.remove();
  });

  gameArea.appendChild(item);
}

// Adjust the bubble generation speed based on the score
function adjustSpeed() {
  if (score < 30) {
    bubbleInterval = Math.max(300, 800 - score * 20); // Gradually reduce interval
  }
}

// Main game loop
function gameLoop() {
  createItem(); // Create a bubble or bomb
  adjustSpeed(); // Adjust the bubble generation speed
  setTimeout(gameLoop, bubbleInterval); // Schedule the next item
}

// Start the game loop
gameLoop();