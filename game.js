// game.js
let canvas, ctx;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let speed = 100;
let gameInterval = null;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем еду
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
    
    // Рисуем змейку
    ctx.fillStyle = "purple";
    snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20));
}

function update() {
    // Обновляем положение змейки
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    snake.unshift(head);
    
    // Проверка на столкновение с едой
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
    
    // Проверка на столкновение со стенами или с самой собой
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        alert('Игра окончена!');
        resetGame();
    }
    
    draw();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            direction = { x: 1, y: 0 };
            break;
    }
}

function startGame() {
    // Устанавливаем начальные значения
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    placeFood();
    
    // Получаем выбранную скорость
    const speedSelect = document.getElementById('speed');
    speed = parseInt(speedSelect.value);
    
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    
    gameInterval = setInterval(update, speed);
}

function resetGame() {
    document.getElementById('menu').style.display = 'block';
    canvas.style.display = 'none';
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    document.addEventListener('keydown', changeDirection);
}