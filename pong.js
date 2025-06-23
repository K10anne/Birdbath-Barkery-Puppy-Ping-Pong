const ctx = canvas.getContext("2d");

function checkOrientation() {
  if (window.innerWidth < 800 && window.innerHeight > window.innerWidth) {
    document.getElementById("rotateMessage").style.display = "block";
    document.getElementById("gameCanvas").style.display = "none";
  } else {
    document.getElementById("rotateMessage").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
  }
}

// Paddle properties
let paddleWidth, paddleHeight, ballSize;

function adjustSizes() {
  if (window.innerWidth < 800) {
    // Mobile scaling
    paddleWidth = window.innerWidth * 0.12;
    paddleHeight = window.innerWidth * 0.15;
    ballSize = window.innerWidth * 0.08;

    // Mobile: Force a wide horizontal rectangle
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerWidth * 0.5;
  } else {
    // Desktop scaling
    paddleWidth = 100;
    paddleHeight = 100;
    ballSize = 50;

    // Desktop: Keep normal size
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
  }

  // Ensure paddles are positioned correctly
  playerY = (canvas.height - paddleHeight) / 2;
  aiY = (canvas.height - paddleHeight) / 2;
}

// Call function when game loads & when window resizes
window.addEventListener("resize", adjustSizes);
window.addEventListener("load", adjustSizes);
adjustSizes(); // Ensure paddles are set before the game starts

const paddleSpeed = 5;

// Ball properties
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 3.8, ballSpeedY = 3.8;

// AI speed
const aiSpeed = 3.8;

// Game state
let gameRunning = false;
let gameLoopId = null;

// Load images
const treatImage = new Image();
treatImage.src = "dog_treat.png";

const puppyPlayer = new Image();
puppyPlayer.src = "puppy_player.png";

const puppyAI = new Image();
puppyAI.src = "puppy_computer.png";

// Load sounds
const barkSound = new Audio("dog_bark.mp3");
const backgroundMusic = new Audio("happybackgroundmusic-.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.load();

function startGame() {
  if (window.innerWidth < 800 && window.innerHeight > window.innerWidth) {
    alert("🔄 Please rotate your phone to play Puppy Ping Pong!");
    return; // Stops the game from starting in portrait mode
  }

  if (!gameRunning) {
    gameRunning = true;
    ballSpeedX = 3.8;
    ballSpeedY = 3.8;
    document.getElementById("startButton").style.display = "none";
    backgroundMusic.play();

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}

function resetGame() {
  gameRunning = false;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }

  ballSpeedX = 3.8 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 3.8 * (Math.random() > 0.5 ? 1 : -1);

  document.getElementById("startButton").style.display = "block";
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function playBarkSound() {
  barkSound.play();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && playerY > 0) {
    playerY -= paddleSpeed;
  } else if (event.key === "ArrowDown" && playerY < canvas.height - paddleHeight) {
    playerY += paddleSpeed;
  }
});

document.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Stops scrolling when touching the screen
}, { passive: false });

document.addEventListener("touchmove", (event) => {
  event.preventDefault(); // Stops scrolling when moving the paddle
}, { passive: false });

function update() {
  if (gameRunning) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
      ballSpeedY = -Math.sign(ballSpeedY) * 3.8;
    }

    if (
      (ballX <= paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) ||
      (ballX >= canvas.width - paddleWidth - ballSize && ballY > aiY && ballY < aiY + paddleHeight)
    ) {
      ballSpeedX = -Math.sign(ballSpeedX) * 3.8;
      playBarkSound();
    }

    if (ballX <= 0 || ballX >= canvas.width) resetGame();

    aiY += aiY + paddleHeight / 2 < ballY ? aiSpeed : -aiSpeed;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(puppyPlayer, 0, playerY, paddleWidth, paddleHeight);
  ctx.drawImage(puppyAI, canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
  ctx.drawImage(treatImage, ballX, ballY, ballSize, ballSize);
}

function gameLoop() {
  update();
  draw();
  gameLoopId = requestAnimationFrame(gameLoop);
}

