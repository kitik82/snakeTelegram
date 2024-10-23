let canvas, ctx;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let speed = 100;
let gameInterval = null;
let score = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем еду
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
    
    // Рисуем змейку
    ctx.fillStyle = "purple";
    snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20));
    
    // Обновляем счёт
    document.getElementById('score').textContent = "Счёт: " + score;
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    snake.unshift(head);
    
    // Проверка на столкновение с едой
    if (head.x === food.x && head.y === food.y) {
        score += 10;  // Добавляем очки за еду
        placeFood();
    } else {
        snake.pop();
    }
    
    // Проверка на столкновение со стенами или с самой собой
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        setTimeout(startGame, 1000); // Перезапускаем игру через 1 секунду
        return;
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
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0; // Сбрасываем счёт
    placeFood();

    const speedSelect = document.getElementById('speed');
    speed = parseInt(speedSelect.value);

    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    document.addEventListener('keydown', changeDirection);
}
