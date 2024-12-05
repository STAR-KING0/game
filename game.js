const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
let score = 0;

// Function to create a bubble
function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  // Random size, position, and speed
  const size = Math.random() * 50 + 30; // Between 30 and 80px
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 90}vw`; // Random horizontal position
  bubble.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2 to 5 seconds

  // Pop the bubble on click
  bubble.addEventListener("click", () => {
    bubble.remove(); // Remove the bubble
    score++;
    scoreElement.textContent = score; // Update the score
  });

  // Remove bubble when it reaches the top
  bubble.addEventListener("animationend", () => {
    bubble.remove();
  });

  gameArea.appendChild(bubble);
}

// Create bubbles at regular intervals
setInterval(createBubble, 800);