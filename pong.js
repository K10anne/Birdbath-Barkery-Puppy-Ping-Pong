const ctx = canvas.getContext("2d");

// Paddle properties
const paddleWidth = 80, paddleHeight = 80;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;

// Ball properties (Dog Treat)
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 3.5, ballSpeedY = 3.5;  // ✅ Slightly faster ball speed
const ballSize = 40;  // Updated size for dog treat

// AI Speed (Balanced)
const aiSpeed = 3.5;  // ✅ Slightly faster AI movement

// Game state
let gameRunning = false;  // Prevent game from running immediately
let gameLoopId = null;  // ✅ Track the game loop

// Load images
const treatImage = new Image();
treatImage.src = "dog treat (2).png";  // Replace with your actual file name

const puppyPlayer = new Image();
puppyPlayer.src = "_puppy ping pong pl1.png";  // Replace with your actual file name

const puppyAI = new Image();
puppyAI.src = "puppy ping pong player 1.png";  // Replace with your actual file name

// Load sounds
const barkSound = new Audio("dog-bark-179915.mp3");  // Replace with your actual file name
const backgroundMusic = new Audio("happybackgroundmusic-.mp3");  // Replace with your actual file name
backgroundMusic.loop = true;  // Make the music loop
backgroundMusic.volume = 0.5;  // Adjust volume if needed
backgroundMusic.load();  // Load the music so it's ready

// Function to ensure ball speed stays at 3.5 while flipping direction
function flipBallDirection() {
    ballSpeedX = Math.sign(ballSpeedX) * 3.5;  // ✅ Keep speed at 3.5 while flipping direction
    ballSpeedY = Math.sign(ballSpeedY) * 3.5;
}

// Play music when the game starts
function startGame() {
    if (!gameRunning) {  // ✅ Prevent multiple game loops
        gameRunning = true;
        ballSpeedX = 3.5;
        ballSpeedY = 3.5;
        document.getElementById("startButton").style.display = "none";
        backgroundMusic.play();  // Start background music
        
        // ✅ Stop previous game loop before starting a new one
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
        }
        
        gameLoopId = requestAnimationFrame(gameLoop);  // ✅ Start the game loop
    }
}

// Stop music when the game resets
function resetGame() {
    gameRunning = false;  // Stop the game loop
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    
    // ✅ Stop the game loop when resetting
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }

    flipBallDirection();  // ✅ Ensure speed resets to 3.5 every round
    
    document.getElementById("startButton").style.display = "block";  // Show button
    backgroundMusic.pause();  // Stop the music when the game resets
    backgroundMusic.currentTime = 0;  // Reset to the beginning
}

// Play bark sound when ball hits a paddle
function playBarkSound() {
    barkSound.play();
}

// Player movement (Keyboard)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && playerY > 0) {
        playerY -= paddleSpeed;
    } else if (event.key === "ArrowDown" && playerY < canvas.height - paddleHeight) {
        playerY += paddleSpeed;
    }
});

// ✅ Mobile Touch Controls
document.addEventListener("touchmove", (event) => {
    let touchY = event.touches[0].clientY;
    if (touchY > 0 && touchY < window.innerHeight) {
        playerY = touchY - (paddleHeight / 2);  // ✅ Adjust paddle position
    }
});

// Game loop
function update() {
    if (gameRunning) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with top and bottom walls
        if (ballY <= 0 || ballY >= canvas.height - ballSize) {
            ballSpeedY = -Math.sign(ballSpeedY) * 3.5;
        }

        // Ball collision with paddles
        if (
            (ballX <= paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) ||
            (ballX >= canvas.width - paddleWidth - ballSize && ballY > aiY && ballY < aiY + paddleHeight)
        ) {
            ballSpeedX = -Math.sign(ballSpeedX) * 3.5;
            playBarkSound();
        }

        if (ballX <= 0 || ballX >= canvas.width) {
            resetGame();  
        }

        if (aiY + paddleHeight / 2 < ballY) {
            aiY += aiSpeed;
        } else {
            aiY -= aiSpeed;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(puppyPlayer, 0, playerY, 80, 80);
    ctx.drawImage(puppyAI, canvas.width - 80, aiY, 80, 80);
    ctx.drawImage(treatImage, ballX, ballY, 40, 40);
}

function gameLoop() {
    update();
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}
