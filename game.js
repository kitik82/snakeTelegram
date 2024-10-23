const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('main-menu');
const speedButtons = document.querySelectorAll('.speed-btn');
const scoreList = document.getElementById('score-list');
let snake = [];
let direction = 'RIGHT';
let food = {};
let score = 0;
let speed = 100;
let gameInterval;
let previousScores = [];

function initGame() {
    snake = [{ x: 9 * 20, y: 10 * 20 }];
    direction = 'RIGHT';
    createFood();
    score = 0;
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#000' : '#00AA00';
        ctx.fillRect(snake[i].x, snake[i].y, 20, 20);
    }

    // Рисуем еду
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, 20, 20);

    // Сохраняем положение головы
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Обновляем направление
    if (direction === 'LEFT') snakeX -= 20;
    if (direction === 'UP') snakeY -= 20;
    if (direction === 'RIGHT') snakeX += 20;
    if (direction === 'DOWN') snakeY += 20;

    // Проверяем столкновение с границами
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(snakeX, snakeY, snake)) {
        gameOver();
        return;
    }

    // Проверяем съела ли змейка еду
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        createFood();
    } else {
        snake.pop();
    }

    // Добавляем новую голову
    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);
}

function collision(x, y, array) {
    for (let i = 0; i < array.length; i++) {
        if (x === array[i].x && y === array[i].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    previousScores.push(score);
    updateScoreList();
    mainMenu.style.display = 'block';
    canvas.style.display = 'none';
}

function updateScoreList() {
    scoreList.innerHTML = '';
    previousScores.forEach((s, index) => {
        let li = document.createElement('li');
        li.textContent = `Игра ${index + 1}: ${s} очков`;
        scoreList.appendChild(li);
    });
}

// Управление с клавиатуры
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
});

// Выбор скорости
speedButtons.forEach(button => {
    button.addEventListener('click', () => {
        let selectedSpeed = button.getAttribute('data-speed');
        if (selectedSpeed === 'low') speed = 200;
        else if (selectedSpeed === 'medium') speed = 150;
        else if (selectedSpeed === 'fast') speed = 100;
        else if (selectedSpeed === 'very-fast') speed = 50;

        mainMenu.style.display = 'none';
        canvas.style.display = 'block';
        initGame();
        gameInterval = setInterval(draw, speed);
    });
});
