// ============================================================
// 🚀 GALAXY DEFENDER
// RETRO ARCADE SPACE SHOOTER
// ============================================================


// ============================================================
// CANVAS SETUP
// ============================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ============================================================
// GAME STATE
// ============================================================

let score = 0;
let lives = 3;

let gameRunning = false;

let bullets = [];
let enemies = [];
let particles = [];
let stars = [];

let keys = {};

let enemyTimer = 0;
let difficultyTimer = 0;

let enemySpawnRate = 1000;

let lastTime = 0;


// ============================================================
// PLAYER
// ============================================================

const player = {
    x: 0,
    y: 0,

    width: 60,
    height: 80,

    speed: 8
};


// ============================================================
// CANVAS RESIZE
// ============================================================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player.x = canvas.width / 2;
    player.y = canvas.height - 120;

    createStars();
}

window.addEventListener("resize", resizeCanvas);


// ============================================================
// CREATE STARS
// ============================================================

function createStars() {

    stars = [];

    for (let i = 0; i < 180; i++) {

        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            size: Math.random() * 2 + 1,

            speed: Math.random() * 2 + 0.5,

            brightness: Math.random()
        });
    }
}


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

document.addEventListener("keydown", function (event) {

    keys[event.key] = true;

    // Prevent SPACE from scrolling the browser
    if (event.key === " ") {

        event.preventDefault();

        shoot();
    }
});


document.addEventListener("keyup", function (event) {

    keys[event.key] = false;
});


// ============================================================
// START GAME
// ============================================================

function startGame() {

    // Hide start screen
    const startScreen =
        document.getElementById("startScreen");

    startScreen.classList.add("hidden");

    // Hide game-over screen
    const gameOver =
        document.getElementById("gameOver");

    gameOver.classList.add("hidden");

    // Reset everything
    resetGame();

    // Start game
    gameRunning = true;

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}


// ============================================================
// RESET GAME
// ============================================================

function resetGame() {

    score = 0;
    lives = 3;

    bullets = [];
    enemies = [];
    particles = [];

    enemyTimer = 0;
    difficultyTimer = 0;

    enemySpawnRate = 1000;

    player.x = canvas.width / 2;
    player.y = canvas.height - 120;

    updateHUD();
}


// ============================================================
// RESTART GAME
// ============================================================

function restartGame() {

    // Hide Game Over screen
    document.getElementById("gameOver")
        .classList.add("hidden");

    // Hide Start screen
    document.getElementById("startScreen")
        .classList.add("hidden");

    // Reset game
    resetGame();

    // Start game
    gameRunning = true;

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function movePlayer() {

    if (keys["ArrowLeft"]) {

        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {

        player.x += player.speed;
    }


    // Keep player inside screen

    const halfWidth =
        player.width / 2;

    if (player.x < halfWidth) {

        player.x = halfWidth;
    }

    if (
        player.x >
        canvas.width - halfWidth
    ) {

        player.x =
            canvas.width - halfWidth;
    }
}


// ============================================================
// DRAW PLAYER SPACESHIP
// ============================================================

function drawPlayer() {

    const x = player.x;
    const y = player.y;

    ctx.save();

    ctx.translate(x, y);


    // --------------------------------------------------------
    // Ship glow
    // --------------------------------------------------------

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00eaff";


    // --------------------------------------------------------
    // Main spaceship body
    // --------------------------------------------------------

    ctx.fillStyle = "#e9fbff";

    ctx.beginPath();

    ctx.moveTo(0, -42);

    ctx.lineTo(-12, -12);

    ctx.lineTo(-36, 28);

    ctx.lineTo(-18, 22);

    ctx.lineTo(-25, 43);

    ctx.lineTo(0, 31);

    ctx.lineTo(25, 43);

    ctx.lineTo(18, 22);

    ctx.lineTo(36, 28);

    ctx.lineTo(12, -12);

    ctx.closePath();

    ctx.fill();


    // --------------------------------------------------------
    // Left cyan wing
    // --------------------------------------------------------

    ctx.fillStyle = "#00eaff";

    ctx.beginPath();

    ctx.moveTo(-12, -5);
    ctx.lineTo(-36, 28);
    ctx.lineTo(-10, 18);

    ctx.closePath();

    ctx.fill();


    // --------------------------------------------------------
    // Right pink wing
    // --------------------------------------------------------

    ctx.fillStyle = "#ff2299";

    ctx.beginPath();

    ctx.moveTo(12, -5);
    ctx.lineTo(36, 28);
    ctx.lineTo(10, 18);

    ctx.closePath();

    ctx.fill();


    // --------------------------------------------------------
    // Cockpit
    // --------------------------------------------------------

    ctx.shadowColor = "#00eaff";

    ctx.fillStyle = "#158cff";

    ctx.beginPath();

    ctx.arc(
        0,
        -8,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------------------------
    // Engine flame
    // --------------------------------------------------------

    ctx.shadowColor = "#ff6600";

    ctx.fillStyle = "#ff7b00";

    ctx.beginPath();

    ctx.moveTo(-9, 28);
    ctx.lineTo(0, 58);
    ctx.lineTo(9, 28);

    ctx.closePath();

    ctx.fill();


    // --------------------------------------------------------
    // Engine inner flame
    // --------------------------------------------------------

    ctx.fillStyle = "#fff200";

    ctx.beginPath();

    ctx.moveTo(-4, 30);
    ctx.lineTo(0, 50);
    ctx.lineTo(4, 30);

    ctx.closePath();

    ctx.fill();


    ctx.restore();
}


// ============================================================
// SHOOT BULLET
// ============================================================

function shoot() {

    if (!gameRunning) {
        return;
    }


    bullets.push({

        x: player.x,

        y: player.y - 45,

        width: 5,

        height: 25,

        speed: 14
    });
}


// ============================================================
// UPDATE BULLETS
// ============================================================

function updateBullets() {

    for (const bullet of bullets) {

        bullet.y -= bullet.speed;
    }


    // Remove bullets outside screen

    bullets = bullets.filter(
        bullet => bullet.y + bullet.height > 0
    );
}


// ============================================================
// DRAW BULLETS
// ============================================================

function drawBullets() {

    for (const bullet of bullets) {

        ctx.save();

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00eaff";

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            bullet.x - 2.5,
            bullet.y,
            bullet.width,
            bullet.height
        );

        ctx.restore();
    }
}


// ============================================================
// CREATE ENEMY
// ============================================================

function createEnemy() {

    const size = 42;

    const colors = [
        "#ff2299",
        "#8c4dff",
        "#00aaff",
        "#ff5c00"
    ];

    const color =
        colors[
            Math.floor(
                Math.random() * colors.length
            )
        ];


    enemies.push({

        x:
            Math.random() *
            (canvas.width - size),

        y: -60,

        width: size,

        height: size,

        speed:
            1.5 +
            Math.random() * 2.5,

        color: color
    });
}


// ============================================================
// UPDATE ENEMIES
// ============================================================

function updateEnemies(deltaTime) {

    enemyTimer += deltaTime;

    difficultyTimer += deltaTime;


    // --------------------------------------------------------
    // Spawn enemies
    // --------------------------------------------------------

    if (enemyTimer >= enemySpawnRate) {

        createEnemy();

        enemyTimer = 0;
    }


    // --------------------------------------------------------
    // Increase difficulty every 10 seconds
    // --------------------------------------------------------

    if (difficultyTimer >= 10000) {

        enemySpawnRate =
            Math.max(
                300,
                enemySpawnRate - 80
            );

        difficultyTimer = 0;
    }


    // --------------------------------------------------------
    // Move enemies
    // --------------------------------------------------------

    for (const enemy of enemies) {

        enemy.y += enemy.speed;
    }


    // --------------------------------------------------------
    // Enemies reaching bottom
    // --------------------------------------------------------

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        if (
            enemies[i].y >
            canvas.height
        ) {

            enemies.splice(i, 1);

            loseLife();
        }
    }
}


// ============================================================
// DRAW ENEMIES
// ============================================================

function drawEnemies() {

    for (const enemy of enemies) {

        const centerX =
            enemy.x +
            enemy.width / 2;

        const centerY =
            enemy.y +
            enemy.height / 2;


        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );


        // Glow

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            enemy.color;


        // Main alien body

        ctx.fillStyle =
            enemy.color;

        ctx.beginPath();

        ctx.moveTo(0, -21);

        ctx.lineTo(21, -5);

        ctx.lineTo(15, 17);

        ctx.lineTo(0, 11);

        ctx.lineTo(-15, 17);

        ctx.lineTo(-21, -5);

        ctx.closePath();

        ctx.fill();


        // Eyes

        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            -11,
            -6,
            7,
            8
        );

        ctx.fillRect(
            4,
            -6,
            7,
            8
        );


        // Eye glow

        ctx.fillStyle = "#00eaff";

        ctx.fillRect(
            -9,
            -4,
            3,
            4
        );

        ctx.fillRect(
            6,
            -4,
            3,
            4
        );


        ctx.restore();
    }
}


// ============================================================
// COLLISION DETECTION
// ============================================================

function collision(a, b) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y
    );
}


// ============================================================
// BULLET VS ENEMY COLLISION
// ============================================================

function checkBulletCollisions() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        for (
            let j = enemies.length - 1;
            j >= 0;
            j--
        ) {

            const bullet =
                bullets[i];

            const enemy =
                enemies[j];


            const enemyBox = {

                x: enemy.x,

                y: enemy.y,

                width: enemy.width,

                height: enemy.height
            };


            if (
                collision(
                    bullet,
                    enemyBox
                )
            ) {

                // Remove bullet

                bullets.splice(i, 1);

                // Remove enemy

                enemies.splice(j, 1);


                // Add score

                score += 100;


                // Explosion

                createExplosion(
                    enemy.x +
                        enemy.width / 2,

                    enemy.y +
                        enemy.height / 2
                );


                updateHUD();

                break;
            }
        }
    }
}


// ============================================================
// PLAYER VS ENEMY COLLISION
// ============================================================

function checkPlayerCollision() {

    const playerBox = {

        x:
            player.x -
            player.width / 2,

        y:
            player.y -
            player.height / 2,

        width:
            player.width,

        height:
            player.height
    };


    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        if (
            collision(
                playerBox,
                enemies[i]
            )
        ) {

            createExplosion(
                player.x,
                player.y
            );

            enemies.splice(i, 1);

            loseLife();
        }
    }
}


// ============================================================
// LOSE LIFE
// ============================================================

function loseLife() {

    if (!gameRunning) {
        return;
    }


    lives--;

    updateHUD();


    if (lives <= 0) {

        endGame();
    }
}


// ============================================================
// UPDATE HUD
// ============================================================

function updateHUD() {

    const scoreElement =
        document.getElementById("score");

    const livesElement =
        document.getElementById("lives");


    scoreElement.textContent =
        String(score).padStart(
            6,
            "0"
        );


    let hearts = "";


    for (
        let i = 0;
        i < lives;
        i++
    ) {

        hearts += "♥ ";

    }


    livesElement.textContent =
        hearts.trim();
}


// ============================================================
// CREATE EXPLOSION
// ============================================================

function createExplosion(x, y) {

    for (let i = 0; i < 30; i++) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5)
                * 9,

            vy:
                (Math.random() - 0.5)
                * 9,

            life: 1,

            size:
                Math.random() * 5 + 2
        });
    }
}


// ============================================================
// UPDATE EXPLOSIONS
// ============================================================

function updateParticles() {

    for (const particle of particles) {

        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.life -= 0.035;
    }


    particles = particles.filter(
        particle =>
            particle.life > 0
    );
}


// ============================================================
// DRAW EXPLOSIONS
// ============================================================

function drawParticles() {

    for (const particle of particles) {

        ctx.save();

        ctx.globalAlpha =
            particle.life;

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            "#ff2299";

        ctx.fillStyle =
            particle.life > 0.5
                ? "#ffd900"
                : "#ff2299";


        ctx.fillRect(
            particle.x,
            particle.y,
            particle.size,
            particle.size
        );

        ctx.restore();
    }
}


// ============================================================
// UPDATE STARS
// ============================================================

function updateStars() {

    for (const star of stars) {

        star.y += star.speed;


        if (
            star.y >
            canvas.height
        ) {

            star.y = 0;

            star.x =
                Math.random() *
                canvas.width;
        }
    }
}


// ============================================================
// DRAW STARS
// ============================================================

function drawStars() {

    for (const star of stars) {

        ctx.globalAlpha =
            0.3 +
            star.brightness * 0.7;

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );
    }


    ctx.globalAlpha = 1;
}


// ============================================================
// DRAW SPACE BACKGROUND
// ============================================================

function drawBackground() {

    const gradient =
        ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width
        );


    gradient.addColorStop(
        0,
        "#111b55"
    );

    gradient.addColorStop(
        0.45,
        "#06082b"
    );

    gradient.addColorStop(
        1,
        "#01020a"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


// ============================================================
// GAME OVER
// ============================================================

function endGame() {

    gameRunning = false;


    // Stop player movement

    keys = {};


    // Show final score

    document.getElementById(
        "finalScore"
    ).textContent =
        String(score).padStart(
            6,
            "0"
        );


    // Show Game Over screen

    document.getElementById(
        "gameOver"
    ).classList.remove("hidden");
}


// ============================================================
// MAIN GAME LOOP
// ============================================================

function gameLoop(timestamp) {

    // Do not continue after game over

    if (!gameRunning) {
        return;
    }


    // Calculate time

    const deltaTime =
        timestamp - lastTime;

    lastTime = timestamp;


    // --------------------------------------------------------
    // DRAW BACKGROUND
    // --------------------------------------------------------

    drawBackground();


    // --------------------------------------------------------
    // STARS
    // --------------------------------------------------------

    updateStars();

    drawStars();


    // --------------------------------------------------------
    // PLAYER
    // --------------------------------------------------------

    movePlayer();

    drawPlayer();


    // --------------------------------------------------------
    // BULLETS
    // --------------------------------------------------------

    updateBullets();

    drawBullets();


    // --------------------------------------------------------
    // ENEMIES
    // --------------------------------------------------------

    updateEnemies(deltaTime);

    drawEnemies();


    // --------------------------------------------------------
    // COLLISIONS
    // --------------------------------------------------------

    checkBulletCollisions();

    checkPlayerCollision();


    // --------------------------------------------------------
    // EXPLOSIONS
    // --------------------------------------------------------

    updateParticles();

    drawParticles();


    // --------------------------------------------------------
    // NEXT FRAME
    // --------------------------------------------------------

    if (gameRunning) {

        requestAnimationFrame(
            gameLoop
        );
    }
}


// ============================================================
// INITIALIZATION
// ============================================================

// Prepare canvas

resizeCanvas();


// Reset HUD

updateHUD();


// IMPORTANT:
// We DO NOT call gameLoop() here.
//
// The game starts only when the user
// presses START GAME.
//
// ============================================================