const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size for PC
canvas.width = 800;
canvas.height = 400;

// Paddle properties
const paddleWidth = 100, paddleHeight = 100;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;

// Ball properties
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 3.5, ballSpeedY = 3.5;
const ballSize = 50;

// AI speed
const aiSpeed = 3.5;

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
  if (!gameRunning) {
    gameRunning = true;
    ballSpeedX = 3.5;
    ballSpeedY = 3.5;
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

  ballSpeedX = 3.5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 3.5 * (Math.random() > 0.5 ? 1 : -1);

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
      ballSpeedX = -Math.sign(ballSpeedX) * 3.5;
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

