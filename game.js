const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('main-menu');
const speedButtons = document.querySelectorAll('.speed-btn');
const scoreList = document.getElementById('score-list');
const snakeColorInput = document.getElementById('snake-color');
const headColorInput = document.getElementById('head-color');
const scoreDisplay = document.getElementById('score-display');
let snake = [];
let direction = 'RIGHT';
let food = {};
let score = 0;
let speed = 100;
let gameInterval;
let previousScores = [];
let snakeColor = '#00AA00';
let headColor = '#000000';
let gridSize = 20;
let canvasSize = 400; // Размер канваса по умолчанию

function initGame() {
    // Устанавливаем размер канваса в зависимости от доступной ширины
    adjustCanvasSize();

    // Инициализируем позицию змейки в центре канваса
    const initialX = Math.floor((canvas.width / gridSize) / 2) * gridSize;
    const initialY = Math.floor((canvas.height / gridSize) / 2) * gridSize;
    snake = [{ x: initialX, y: initialY }];

    direction = 'RIGHT';
    createFood();
    score = 0;
    scoreDisplay.textContent = 'Счет: 0';
    snakeColor = snakeColorInput.value;
    headColor = headColorInput.value;
}

function adjustCanvasSize() {
    // Определяем размер канваса в зависимости от размера окна или мини-приложения
    let minDimension = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvasSize = Math.floor(minDimension / gridSize) * gridSize; // Убедимся, что размер кратен gridSize

    // Устанавливаем минимальный размер канваса
    if (canvasSize < 200) {
        canvasSize = 200;
    }

    canvas.width = canvasSize;
    canvas.height = canvasSize;
}

function createFood() {
    const maxCellsX = canvas.width / gridSize;
    const maxCellsY = canvas.height / gridSize;
    food = {
        x: Math.floor(Math.random() * maxCellsX) * gridSize,
        y: Math.floor(Math.random() * maxCellsY) * gridSize,
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? headColor : snakeColor;
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
    }

    // Рисуем еду
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Сохраняем положение головы
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Обновляем направление
    if (direction === 'LEFT') snakeX -= gridSize;
    if (direction === 'UP') snakeY -= gridSize;
    if (direction === 'RIGHT') snakeX += gridSize;
    if (direction === 'DOWN') snakeY += gridSize;

    // Проверяем столкновение с границами или с самой собой
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(snakeX, snakeY, snake)
    ) {
        gameOver();
        return;
    }

    // Проверяем, съела ли змейка еду
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreDisplay.textContent = 'Счет: ' + score;
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
    document.getElementById('game-container').style.display = 'none';
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
        document.getElementById('game-container').style.display = 'block';
        initGame();
        gameInterval = setInterval(draw, speed);
    });
});

// Обновляем размер канваса при изменении размера окна
window.addEventListener('resize', () => {
    if (canvas.style.display !== 'none') {
        adjustCanvasSize();
    }
});
