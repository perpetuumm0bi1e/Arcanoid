let playButton = document.getElementById('box-3');

playButton.onclick = function() {
    window.location.href = './arcanoid.html';
}

if (location.pathname.includes('arcanoid')) {

    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const choice = document.getElementById('choice');
    radio_keyboard = document.querySelector('#keyboard');
    radio_mouse = document.querySelector('#mouse');
    body = document.querySelector('.body');

    const level1 = [
        [],
        ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
        ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y']
    ];

    const colorMap = {
        'R': 'purple',
        'O': 'indigo',
        'G': 'mediumpurple',
        'Y': 'darkslateblue'
    };

    const brickGap = 4;
    const brickWidth = 20;
    const brickHeight = 52;
    const wallSize = 8;
    const bricks = [];

    for (let row = 0; row < level1.length; row++) {
        for (let col = 0; col < level1[row].length; col++) {
            const colorCode = level1[row][col];
            bricks.push({
                x: wallSize + (brickWidth + brickGap) * row + 100,
                y: wallSize + (brickHeight + brickGap) * col,
                color: colorMap[colorCode],
                width: brickWidth,
                height: brickHeight
            });
        }
    }
    const paddle = {
        x: 1050,
        y: canvas.height / 2 - 150 / 2,
        width: 20,
        height: 120,
        dx: 0,
        dy: 0
    };
    const ball = {
        x: 700,
        y: 200,
        width: 11,
        height: 11,
        speed: 9,
        dx: 0,
        dy: 0
    };

    function collides(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y;
    }

    function loop() {
        requestAnimationFrame(loop);
        context.clearRect(0, 0, canvas.width, canvas.height);
        paddle.y += paddle.dy;
        if (paddle.y < wallSize) {
            paddle.y = wallSize
        } else if (paddle.y > canvas.height - wallSize - paddle.height) {
            paddle.y = canvas.height - wallSize - paddle.height;
        }
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (ball.x < wallSize + ball.width) {
            ball.x = wallSize + ball.width;
            ball.dx *= -1;
        }
        if (ball.y < wallSize + ball.height) {
            ball.y = wallSize + ball.height;
            ball.dy *= -1;
        } else if (ball.y + ball.height > canvas.height - wallSize) {
            ball.y = canvas.height - wallSize - ball.height;
            ball.dy *= -1;
        }
        if (ball.x + ball.width > canvas.width - wallSize) {
            ball.x = 700;
            ball.y = 200;
            ball.dx = 0;
            ball.dy = 0;
        }
        if (collides(ball, paddle)) {
            ball.dx *= -1;
            ball.x = paddle.x - ball.width;
        }

        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];
            if (collides(ball, brick)) {
                bricks.splice(i, 1);
                if (ball.y + ball.height - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
                    ball.dy *= -1;
                } else if (ball.x + ball.width - ball.speed <= brick.x || ball.x >= brick.x + brick.width - ball.speed) {
                    ball.dx *= -1;
                }
                break;
            }
        }
        context.fillStyle = 'snow';

        context.fillRect(0, 0, canvas.width, wallSize);
        context.fillRect(0, 0, wallSize, canvas.height);
        context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);
        context.fillRect(0, canvas.height - wallSize, canvas.width, wallSize);
        if (ball.dx || ball.dy) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.height, 0, 360);
            context.fill();
        }
        bricks.forEach(function(brick) {
            context.fillStyle = brick.color;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });
        context.fillStyle = 'yellowgreen';
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    document.addEventListener('keydown', function(e) {
        if (radio_keyboard.checked) {
            if (e.which === 87 || e.which === 38) {
                paddle.dy = -12;
            } else if (e.which === 83 || e.which === 40) {
                paddle.dy = 12;
            }
            if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
                ball.dx = ball.speed;
                ball.dy = ball.speed;
            }
        }
    });

    document.addEventListener('keyup', function(e) {
        if (radio_keyboard.checked) {
            if (e.which === 87 || e.which === 83 || e.which === 38 || e.which === 40) {
                paddle.dy = 0;
            }
        }
    });

    canvas.onclick = function() {
        if (radio_mouse.checked) {
            if (ball.dx === 0 && ball.dy === 0) {
                ball.dx = ball.speed;
                ball.dy = ball.speed;
            }
        }
    };

    document.addEventListener('mousemove', e => {
        if (radio_mouse.checked) {
            paddle.y = e.pageY - 75;
        }
    });
    requestAnimationFrame(loop);

    choice.addEventListener("change", () => {
        let id = choice.id;
        if (id == keyboard) {
            radio_mouse.checked = false;
        } else if (id == mouse) {
            radio_keyboard.checked = false;
        }
    });
}