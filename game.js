const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Установите размеры канваса
canvas.width = 400;
canvas.height = 400;

let snake = [{x: 200, y: 200}];
let direction = 'RIGHT';
let food = {x: Math.floor(Math.random() * canvas.width / 20) * 20, 
            y: Math.floor(Math.random() * canvas.height / 20) * 20};
let score = 0;

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'purple' : 'green'; // Голова змейки — фиолетовая
        ctx.fillRect(snake[i].x, snake[i].y, 20, 20);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    if (direction === 'RIGHT') head.x += 20;
    if (direction === 'LEFT') head.x -= 20;
    if (direction === 'UP') head.y -= 20;
    if (direction === 'DOWN') head.y += 20;

    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = {x: Math.floor(Math.random() * canvas.width / 20) * 20, 
                y: Math.floor(Math.random() * canvas.height / 20) * 20};
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    }
    if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    }
    if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
    if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

document.addEventListener('keydown', setDirection);

function gameLoop() {
    if (checkCollision()) {
        alert('Игра окончена! Ваш счет: ' + score);
        snake = [{x: 200, y: 200}];
        direction = 'RIGHT';
        score = 0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
}

setInterval(gameLoop, 100);
