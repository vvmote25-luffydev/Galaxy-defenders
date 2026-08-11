// ================================
// 🚀 GALAXY DEFENDER
// ================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================================
// GAME VARIABLES
// ================================

let score = 0;
let lives = 3;
let gameRunning = true;

let bullets = [];
let enemies = [];

const keys = {};

// ================================
// PLAYER
// ================================

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 7
};

// ================================
// STARS
// ================================

const stars = [];

for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1
    });
}

// ================================
// KEYBOARD CONTROLS
// ================================

document.addEventListener("keydown", function(event) {

    keys[event.key] = true;

    // Prevent space from scrolling the page
    if (event.key === " ") {
        event.preventDefault();
        shoot();
    }

});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

// ================================
// PLAYER MOVEMENT
// ================================

function movePlayer() {

    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    // Keep player inside canvas

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// ================================
// DRAW PLAYER
// ================================

function drawPlayer() {

    // Spaceship body
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

    // Cockpit
    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        player.x + player.width / 2,
        player.y + 25,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

// ================================
// SHOOT
// ================================

function shoot() {

    if (!gameRunning) {
        return;
    }

    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 15,
        speed: 9
    });
}

// ================================
// MOVE BULLETS
// ================================

function moveBullets() {

    bullets.forEach(function(bullet) {
        bullet.y -= bullet.speed;
    });

    bullets = bullets.filter(function(bullet) {
        return bullet.y + bullet.height > 0;
    });
}

// ================================
// DRAW BULLETS
// ================================

function drawBullets() {

    ctx.fillStyle = "yellow";

    bullets.forEach(function(bullet) {

        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );

    });
}

// ================================
// CREATE ENEMY
// ================================

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

// ================================
// MOVE ENEMIES
// ================================

function moveEnemies() {

    enemies.forEach(function(enemy) {
        enemy.y += enemy.speed;
    });

    // If enemy passes player
    enemies.forEach(function(enemy, index) {

        if (enemy.y > canvas.height) {

            enemies.splice(index, 1);

            lives--;

            updateLives();

            if (lives <= 0) {
                endGame();
            }
        }

    });
}

// ================================
// DRAW ENEMIES
// ================================

function drawEnemies() {

    enemies.forEach(function(enemy) {

        // Enemy body
        ctx.fillStyle = "red";

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );

        // Enemy eyes
        ctx.fillStyle = "white";

        ctx.fillRect(
            enemy.x + 8,
            enemy.y + 10,
            7,
            7
        );

        ctx.fillRect(
            enemy.x + 25,
            enemy.y + 10,
            7,
            7
        );

    });
}

// ================================
// COLLISION DETECTION
// ================================

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );
}

// ================================
// BULLET VS ENEMY
// ================================

function checkBulletCollisions() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        for (let j = enemies.length - 1; j >= 0; j--) {

            if (collision(bullets[i], enemies[j])) {

                bullets.splice(i, 1);

                enemies.splice(j, 1);

                score += 10;

                updateScore();

                break;
            }
        }
    }
}

// ================================
// PLAYER VS ENEMY
// ================================

function checkPlayerCollision() {

    for (let i = enemies.length - 1; i >= 0; i--) {

        if (collision(player, enemies[i])) {

            enemies.splice(i, 1);

            lives--;

            updateLives();

            if (lives <= 0) {
                endGame();
            }
        }
    }
}

// ================================
// UPDATE SCORE
// ================================

function updateScore() {

    document.getElementById("score").textContent = score;

}

// ================================
// UPDATE LIVES
// ================================

function updateLives() {

    document.getElementById("lives").textContent = lives;

}

// ================================
// DRAW STARS
// ================================

function drawStars() {

    ctx.fillStyle = "white";

    stars.forEach(function(star) {

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );

        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

    });
}

// ================================
// GAME OVER
// ================================

function endGame() {

    gameRunning = false;

    document.getElementById("finalScore").textContent = score;

    document.getElementById("gameOver").style.display = "flex";
}

// ================================
// RESTART GAME
// ================================

function restartGame() {

    score = 0;

    lives = 3;

    bullets = [];

    enemies = [];

    player.x = canvas.width / 2 - 25;

    gameRunning = true;

    updateScore();

    updateLives();

    document.getElementById("gameOver").style.display = "none";

    gameLoop();
}

// ================================
// SPAWN ENEMIES
// ================================

setInterval(function() {

    if (gameRunning) {
        createEnemy();
    }

}, 1000);

// ================================
// MAIN GAME LOOP
// ================================

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    // Clear screen
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Background
    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Stars
    drawStars();

    // Player
    movePlayer();

    drawPlayer();

    // Bullets
    moveBullets();

    drawBullets();

    // Enemies
    moveEnemies();

    drawEnemies();

    // Collision
    checkBulletCollisions();

    checkPlayerCollision();

    // Continue game
    requestAnimationFrame(gameLoop);
}

// ================================
// START GAME
// ================================

updateScore();

updateLives();

gameLoop();