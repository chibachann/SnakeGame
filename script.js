const gameBoard = document.getElementById("game-board");
const boardSize = 50;
const squareSize = 10;
const snake = [{ x: 20, y: 20 }];
const newGameButton = document.getElementById("new-game-btn");
newGameButton.addEventListener("click", startNewGame);
let food = null;
let direction = "right";
let score = 0;
let intervalId = null;

function drawSnake() {
  snake.forEach(segment => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function updateGame() {
  // Move the snake
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);
  snake.pop();

  // Check for collision with the wall or the snake's own tail
  if (head.x <= 0 || head.x > boardSize || head.y <= 0 || head.y > boardSize || checkCollision()) {
    clearInterval(intervalId);
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = `Game over! Your score is ${score}`;
    return;
  }

  // Check for collision with the food
  if (head.x === food.x && head.y === food.y) {
    // Increase the score
    score++;

    // Draw a new food segment
    food = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1
    };
    drawFood();

    // Add a new tail segment to the end of the snake array
    snake.push(snake[snake.length - 1]);
  }

  // Clear the game board and redraw the game elements
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();

  // Update the score display
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = `Score: ${score}`;
}

function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") {
        direction = "up";
      }
      break;
    case "ArrowDown":
      if (direction !== "up") {
        direction = "down";
      }
      break;
    case "ArrowLeft":
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case "ArrowRight":
      if (direction !== "left") {
        direction = "right";
      }
      break;
  }
}

function startNewGame() {
  // Reset the snake, food, and score
  snake.length = 1;
  snake[0] = { x: 20, y: 20 };
  food = {
    x: Math.floor(Math.random() * boardSize) + 1,
    y: Math.floor(Math.random() * boardSize) + 1
  };
  score = 0;

  // Clear the game board and redraw the game elements
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();

  // Update the score display
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = `Score: ${score}`;

  // Restart the game loop
  clearInterval(intervalId);
  intervalId = setInterval(updateGame, 100);
}


// Set up the initial game board and state
gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, ${squareSize}px)`;
gameBoard.style.gridTemplateRows = `repeat(${boardSize}, ${squareSize}px)`;
drawSnake();

// Draw the initial food segment
food = {
  x: Math.floor(Math.random() * boardSize) + 1,
  y: Math.floor(Math.random() * boardSize) + 1
};
drawFood();

// Set up the score display
const scoreElement = document.createElement("div");
scoreElement.id = "score";
scoreElement.innerText = "Score: 0";
document.body.appendChild(scoreElement);

// Add event listener for keyboard input
document.addEventListener("keydown", handleInput);

// Start the game loop
intervalId = setInterval(updateGame, 100);
