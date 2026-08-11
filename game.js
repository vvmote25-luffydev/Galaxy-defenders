const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let gameRunning = true;

const keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    if (event.key === " ") {
        shoot();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let gameRunning = true;

const keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    if (event.key === " ") {
        shoot();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

const player = {
    x: 375,
    y: 520,
    width: 50,
    height: 50,
    speed: 6
};

function drawPlayer() {

    ctx.fillStyle = "cyan";

    ctx.beginPath();

    ctx.moveTo(
        player.x + player.width / 2,
        player.y
    );

    ctx.lineTo(
        player.x,
        player.y + player.height
    );

    ctx.lineTo(
        player.x + player.width,
        player.y + player.height
    );

    ctx.closePath();

    ctx.fill();
}

function movePlayer() {

    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }

    if (
        keys["ArrowRight"] &&
        player.x < canvas.width - player.width
    ) {
        player.x += player.speed;
    }
}

let bullets = [];
function shoot() {

    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 15,
        speed: 8
    });
}

function drawBullets() {

    ctx.fillStyle = "yellow";

    bullets.forEach(bullet => {

        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );

    });
}

function moveBullets() {

    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });

    bullets = bullets.filter(
        bullet => bullet.y > 0
    );
}
let enemies = [];
function createEnemy() {

    const enemy = {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2
    };

    enemies.push(enemy);
}
function drawEnemies() {

    ctx.fillStyle = "red";

    enemies.forEach(enemy => {

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );

    });
}

function moveEnemies() {

    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
    });
}
setInterval(() => {

    if (gameRunning) {
        createEnemy();
    }

}, 1000);
function collision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}
function checkCollisions() {

    bullets.forEach((bullet, bulletIndex) => {

        enemies.forEach((enemy, enemyIndex) => {

            if (collision(bullet, enemy)) {

                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);

                score += 10;

                document.getElementById("score").textContent = score;
            }

        });

    });

}

function checkPlayerCollision() {

    enemies.forEach((enemy, index) => {

        if (collision(player, enemy)) {

            enemies.splice(index, 1);

            lives--;

            document.getElementById("lives").textContent = lives;

            if (lives <= 0) {
                endGame();
            }
        }

    });

}
function endGame() {

    gameRunning = false;

    document.getElementById("finalScore").textContent = score;

    document.getElementById("gameOver").style.display = "block";
}

function restartGame() {

    score = 0;
    lives = 3;

    bullets = [];
    enemies = [];

    player.x = 375;

    gameRunning = true;

    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;

    document.getElementById("gameOver").style.display = "none";

    gameLoop();
}

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    movePlayer();
    moveBullets();
    moveEnemies();

    checkCollisions();
    checkPlayerCollision();

    drawPlayer();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(gameLoop);
}

gameLoop();

const stars = [];

for (let i = 0; i < 100; i++) {

    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2
    });

}
function drawStars() {

    ctx.fillStyle = "white";

    stars.forEach(star => {

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );

    });

}
drawStars();
drawPlayer();
drawBullets();
drawEnemies();