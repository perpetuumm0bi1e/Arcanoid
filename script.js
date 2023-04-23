function executeGame() {
    let field = document.getElementById('game'),
        context = field.getContext('2d'),
        radioKeyboard = document.querySelector('#keyboard'),
        radioMouse = document.querySelector('#mouse'),
        radioTouchscreen = document.querySelector('#touchscreen'),
        restartButton = document.getElementById('restart'),
        radioHorizontal = document.querySelector('#horizontal'),
        radioVertical = document.querySelector('#vertical');

    const level1 = [
        [],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ];
    const level2 = [
        [],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
    ];

    const colorMap = {
        'P': localStorage.bricksColor,
        'R': '#5955B3',
        'O': '#5955B3',
        'G': '#5955B3',
        'Y': '#5955B3'
    };

    // параметры 
    let score = 0,
        wallSize = 12,
        brickGap = 5,
        brickHeight,
        brickWidth,
        paddleWidth,
        paddleHeight,
        bricks = [],
        sec = 0,
        min = 0,
        t;

    if (radioHorizontal.checked) {
        brickHeight = (field.offsetHeight - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length;
        brickWidth = brickHeight / 2;
        paddleHeight = (field.offsetHeight - 2 * wallSize) / 5;
        paddleWidth = paddleHeight * 0.1;
    } else if (radioVertical.checked) {
        brickWidth = (field.offsetWidth - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length;
        brickHeight = brickWidth / 2;
        paddleWidth = (field.offsetWidth - 2 * wallSize) / 5;
        paddleHeight = paddleWidth * 0.1;
    }

    function tick() {
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++;
            if (min >= 60) {
                min = 0;
                hrs++;
            }
        }
    }

    function add() {
        tick();
        document.getElementById('time').innerHTML = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
        timer();
    }

    function timer() {
        t = setTimeout(add, 1000);
    }

    document.getElementById('score').innerHTML = score;
    field.style.cursor = 'crosshair';

    if (radioHorizontal.checked) {
        for (let row = 0; row < level1.length; row++) {
            for (let col = 0; col < level1[row].length; col++) {
                const colorCode = level1[row][col];
                bricks.push({
                    x: wallSize + (brickWidth + brickGap) * row + field.offsetWidth * 0.05,
                    y: wallSize + (brickHeight + brickGap) * col,
                    color: colorMap[colorCode],
                    width: brickWidth,
                    height: brickHeight
                });
            }
        }
    } else {
        for (let row = 0; row < level2.length; row++) {
            for (let col = 0; col < level2[row].length; col++) {
                const colorCode = level2[row][col];
                bricks.push({
                    x: wallSize + (brickWidth + brickGap) * col,
                    y: wallSize + (brickHeight + brickGap) * row + field.offsetHeight * 0.05,
                    color: colorMap[colorCode],
                    width: brickWidth,
                    height: brickHeight
                });
            }
        }
    }
    const paddle = {
        x: (radioHorizontal.checked) ? field.offsetWidth * 0.9 : field.offsetWidth / 2 - paddleWidth / 2,
        y: (radioHorizontal.checked) ? field.offsetHeight / 2 - paddleWidth / 2 : field.offsetHeight * 0.9,
        width: paddleWidth,
        height: paddleHeight,
        dx: 0, // направление по x
        dy: 0 // направление по y
    };

    const ball = {
        x: (radioHorizontal.checked) ? field.offsetWidth * 0.6 : field.offsetWidth * 0.4,
        y: (radioHorizontal.checked) ? field.offsetHeight * 0.4 : field.offsetHeight * 0.6,
        width: 10,
        height: 10,
        speed: 7,
        dx: 0,
        dy: 0
    };

    // проверка на касание объектов
    function collides(ball, obj, orientation, config) {
        switch (orientation) {
            case 'horizontal':
                switch (config) {
                    case 'paddle':
                        return ball.x + ball.width >= obj.x &&
                            ball.y >= obj.y &&
                            ball.y <= obj.y + obj.height;
                    case 'brick':
                        return ball.x - ball.width <= obj.x + obj.width &&
                            ball.y >= obj.y &&
                            ball.y <= obj.y + obj.height ||
                            ball.x + ball.width == obj.x &&
                            ball.y >= obj.y &&
                            ball.y <= obj.y + obj.height ||
                            ball.y - ball.height == obj.y + obj.height &&
                            ball.x <= obj.x + obj.width &&
                            ball.x >= obj.x ||
                            ball.y + ball.height == obj.y &&
                            ball.x <= obj.x + obj.width &&
                            ball.x >= obj.x;
                }
                break;
            case 'vertical':
                switch (config) {
                    case 'paddle':
                        return ball.y + ball.height >= obj.y &&
                            ball.x >= obj.x &&
                            ball.x <= obj.x + obj.width;
                    case 'brick':
                        return ball.y - ball.height <= obj.y + obj.height &&
                            ball.x >= obj.x &&
                            ball.x <= obj.x + obj.width ||
                            ball.y + ball.height == obj.y &&
                            ball.x >= obj.x &&
                            ball.x <= obj.x + obj.width ||
                            ball.x + ball.width == obj.x &&
                            ball.y <= obj.y + obj.height &&
                            ball.y >= obj.y ||
                            ball.x - ball.width == obj.x + obj.width &&
                            ball.y <= obj.y + obj.height &&
                            ball.y >= obj.y;
                }
                break;
        }
    }

    // главный цикл игры
    function loop() {
        //очистка поля и новая отрисовка
        requestAnimationFrame(loop);
        context.clearRect(0, 0, field.offsetWidth, field.offsetHeight);

        (radioHorizontal.checked) ? paddle.y += paddle.dy: paddle.x += paddle.dx; // движение платформы с заданной скоростью

        // контроль за нахождением в границах поля
        // для горизонтального
        if (paddle.y < wallSize) {
            paddle.y = wallSize
        } else if (paddle.y > field.offsetHeight - wallSize - paddle.height) {
            paddle.y = field.offsetHeight - wallSize - paddle.height;
        }

        // для вертикального
        if (paddle.x < wallSize) {
            paddle.x = wallSize
        } else if (paddle.x + paddle.width > field.offsetWidth - wallSize) {
            paddle.x = field.offsetWidth - wallSize - paddle.width;
        }

        // движение шарика
        ball.x += ball.dx;
        ball.y += ball.dy;

        // проверка координат шарика
        // для горизонтального
        if (radioHorizontal.checked) {
            if (ball.x < wallSize + ball.width) {
                ball.x = wallSize + ball.width;
                ball.dx *= -1;
            }
            if (ball.y < wallSize + ball.height) {
                ball.y = wallSize + ball.height;
                ball.dy *= -1;
            } else if (ball.y + ball.height > field.offsetHeight - wallSize) {
                ball.y = field.offsetHeight - wallSize - ball.height;
                ball.dy *= -1;
            }
        } else { // для вертикального
            if (ball.x < wallSize) {
                ball.x = wallSize;
                ball.dx *= -1;
            } else if (ball.x + ball.width > field.offsetWidth - wallSize) {
                ball.x = field.offsetWidth - wallSize - ball.width;
                ball.dx *= -1;
            }
            // проверяем верхнюю границу
            if (ball.y < wallSize) {
                ball.y = wallSize;
                ball.dy *= -1;
            }
        }

        // перезапуск шарика
        // для горизонтального
        if (radioHorizontal.checked) {
            if (ball.x + ball.width > field.offsetWidth - wallSize) {
                ball.x = field.offsetWidth * 0.6;
                ball.y = field.offsetHeight * 0.4;
                ball.dx = 0;
                ball.dy = 0;
            }
        } else { // для вертикального
            if (ball.y + ball.width > field.offsetHeight - wallSize) {
                ball.x = field.offsetWidth * 0.4;
                ball.y = field.offsetHeight * 0.6;
                ball.dx = 0;
                ball.dy = 0;
            }
        }

        // проверка касания платформы
        if (radioHorizontal.checked && collides(ball, paddle, 'horizontal', 'paddle')) {
            ball.dx *= -1;
            ball.x = paddle.x - ball.width;
        } else if (radioVertical.checked && collides(ball, paddle, 'vertical', 'paddle')) {
            ball.dy *= -1;
            ball.y = paddle.y - ball.height;
        }

        // проверка касания кирпича
        if (radioHorizontal.checked) {
            for (let i = 0; i < bricks.length; i++) {
                let brick = bricks[i];
                if (collides(ball, brick, 'horizontal', 'brick')) {
                    bricks.splice(i, 1);
                    score++;
                    document.getElementById('score').innerHTML = score;
                    if (ball.y + ball.height - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
                        ball.dy *= -1;
                    } else if (ball.x - ball.width - ball.speed <= brick.x + brick.width - ball.speed) {
                        ball.dx *= -1;
                    }
                    break;
                }
            }
        } else {
            for (let i = 0; i < bricks.length; i++) {
                let brick = bricks[i];
                if (collides(ball, brick, 'vertical', 'brick')) {
                    bricks.splice(i, 1);
                    if (ball.y + ball.height - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
                        ball.dy *= -1;
                    } else {
                        ball.dx *= -1;
                    }
                    score++;
                    document.getElementById('score').innerHTML = score;
                    break;
                }
            }
        }
        // отрисовка стен
        context.fillStyle = localStorage.fieldColor;
        document.getElementById('canvas-container').style.background = localStorage.fieldColor;
        document.getElementById('canvas-container').style.borderRadius = '2.15rem';
        context.fillRect(0, 0, field.offsetWidth, wallSize);
        context.fillRect(0, 0, wallSize, field.offsetHeight);
        context.fillRect(field.offsetWidth - wallSize, 0, wallSize, field.offsetHeight);
        context.fillRect(0, field.offsetHeight - wallSize, field.offsetWidth, wallSize);

        // отрисовка шарика,  если он в движении
        if (ball.dx || ball.dy) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.height, 0, 360);
            context.fillStyle = localStorage.ballColor; // цвет мяча
            context.fill();
        }

        // отрисовка кирпичей
        bricks.forEach(function(brick) {
            context.fillStyle = brick.color;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        // отрисовка платформы
        context.fillStyle = localStorage.paddleColor;
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    let touchscreenClickCounter = 0,
        mouseClickCounter = 0,
        touchPosition,
        pointerPosition;

    // нажатие тачскрина
    field.addEventListener('touchstart', e => {
        e.preventDefault();
    })

    // отжатие тачскрина
    field.addEventListener('touchend', e => {
        touchscreenClickCounter++;
        if (touchscreenClickCounter % 2 == 1 && ball.dx === 0 && ball.dy === 0) {
            ball.dx = ball.speed / 2;
            ball.dy = ball.speed;
        }
        if (touchscreenClickCounter == 1) {
            timer();
        }
    })

    // ведение по тачскрину
    field.addEventListener('touchmove', e => {
        touchPosition = {
            x: e.changedTouches[0].clientX - field.getBoundingClientRect().left,
            y: e.changedTouches[0].clientY - field.getBoundingClientRect().top
        };
        if (radioTouchscreen.checked) {
            if (radioHorizontal.checked) {
                paddle.y = touchPosition.y - paddleHeight / 2;
            } else {
                paddle.x = touchPosition.x - paddleWidth / 2;
            }
        }
    })

    // нажатие клавиши
    document.addEventListener('keydown', function(e) {
        if (radioKeyboard.checked && radioHorizontal.checked) {
            if (e.which === 87 || e.which === 38) {
                paddle.dy = -10;
            } else if (e.which === 83 || e.which === 40) {
                paddle.dy = 10;
            }
            if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
                ball.dx = ball.speed;
                ball.dy = ball.speed / 2;
            }
        } else if (radioKeyboard.checked && radioVertical.checked) {
            if (e.which === 65 || e.which === 37) {
                paddle.dx = -10;
            } else if (e.which === 68 || e.which === 39) {
                paddle.dx = 10;
            }
            if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
                ball.dx = ball.speed / 2;
                ball.dy = ball.speed;
            }
        }
    });

    // отжатие клавиши
    document.addEventListener('keyup', function(e) {
        if (radioKeyboard.checked && radioHorizontal.checked && (e.which === 87 || e.which === 83 || e.which === 38 || e.which === 40)) {
            paddle.dy = 0;
        } else if (radioKeyboard.checked && radioVertical.checked && (e.which === 65 || e.which === 37 || e.which === 68 || e.which === 39)) {
            paddle.dx = 0;
        }
    });

    // клик по полю для запуска мяча
    field.addEventListener('click', function(e) {
        mouseClickCounter++;

        if (radioMouse.checked && ball.dx === 0 && ball.dy === 0) {
            if (mouseClickCounter == 1) {
                timer();
            }
            if (radioHorizontal.checked) {
                ball.x = field.offsetWidth * 0.6;
                ball.y = field.offsetHeight * 0.4;
            } else {
                ball.x = field.offsetWidth * 0.4;
                ball.y = field.offsetHeight * 0.6;
            }
            ball.dx = ball.speed;
            ball.dy = ball.speed;
            field.style.cursor = 'none';
        }
    });

    // отслеживание движения курсора
    document.addEventListener('mousemove', e => {
        pointerPosition = {
            x: e.pageX - field.getBoundingClientRect().left,
            y: e.pageY - field.getBoundingClientRect().top
        };
        if (radioMouse.checked && radioHorizontal.checked) {
            paddle.y = pointerPosition.y - paddleHeight;
        } else if (radioMouse.checked && radioVertical.checked) {
            paddle.x = pointerPosition.x - paddleWidth;
        }

    });

    // Перезапуск
    restartButton.addEventListener('click', function(e) {
        clearTimeout(t);
        document.getElementById('time').innerHTML = "00:00";
        executeGame();
    })

    document.getElementById('save').onclick = function() {
        windowSetting();
    }
    requestAnimationFrame(loop);

}

function windowSetting() {
    let canvasWidth, canvasHeight;
    let radioHorizontal = document.getElementById('horizontal'),
        radioVertical = document.getElementById('vertical'),
        gameContainer = document.getElementById('game-container'),
        canvasContainer = document.getElementById('canvas-container');

    if (location.pathname.includes('index') || location.pathname == '/') {
        let playButton = document.getElementById('box-3'),
            designButton = document.getElementById('box-2'),
            settingsButton = document.getElementById('box-4');

        if (document.body.clientWidth < 920 && document.body.clientWidth > 678) {
            designButton.style.order = '1';
            playButton.style.order = '3';
            settingsButton.style.order = '2';
        } else if (document.body.clientWidth < 678) {
            designButton.style.order = '2';
            playButton.style.order = '1';
            settingsButton.style.order = '3';
        } else {
            designButton.style.order = '1';
            playButton.style.order = '2';
            settingsButton.style.order = '3';
        }
    } else if (location.pathname.includes('game')) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // для телефонов
            if (document.body.clientWidth < 740) {
                radioHorizontal.disabled = true;
                radioVertical.checked = true;
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth * 1.6;
            }
            // для планшетов
            if (!radioHorizontal.checked && !radioVertical.checked && !radioHorizontal.disabled) {
                radioHorizontal.checked = true;
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth / 1.6;
            } else if (radioVertical.checked && !radioHorizontal.disabled) {
                canvasWidth = gameContainer.offsetWidth * .7;
                canvasHeight = canvasWidth * 1.6;
            }
            document.getElementById('touchscreen').checked = true;
        } else { // для пк
            if (!radioHorizontal.checked && !radioVertical.checked) {
                radioHorizontal.checked = true;
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth / 1.6;
            }
            if (radioVertical.checked) {
                canvasWidth = gameContainer.offsetWidth * .6;
                canvasHeight = canvasWidth * 1.6;
            }
            document.getElementById('mouse').checked = true;
        }

        canvasContainer.innerHTML = `<canvas id='game' width='${canvasWidth}' height='${canvasHeight}'></canvas>`;
        executeGame();
    }
}
window.addEventListener('resize', function(event) {
    windowSetting();
});

window.onload = function() {
    if (!localStorage.ballColor) {
        localStorage.setItem('ballColor', '#DA2E2E');
    }
    if (!localStorage.paddleColor) {
        localStorage.setItem('paddleColor', '#282828');
    }
    if (!localStorage.bricksColor) {
        localStorage.setItem('bricksColor', '#5955B3');
    }
    if (!localStorage.fieldColor) {
        localStorage.setItem('fieldColor', '#FEFEFE');
    }
    windowSetting();

    function onEntry(element) {
        element.forEach(change => {
            if (change.isIntersecting) {
                change.target.classList.add('appeared');
            }
        });
    }

    let options = { threshold: [0.5] };
    let observer = new IntersectionObserver(onEntry, options);

    let topAppearedElements = document.querySelectorAll('.top-appearance-animation'),
        impulseAppearedElements = document.querySelectorAll('.impulse-appearance-animation'),
        bottomAppearedElements = document.querySelectorAll('.bottom-appearance-animation');

    for (let element of impulseAppearedElements) {
        observer.observe(element);
    }
    for (let element of topAppearedElements) {
        observer.observe(element);
    }
    for (let element of bottomAppearedElements) {
        observer.observe(element);
    }
    console.log(location.pathname)
    if (location.pathname.includes('game')) { // страница игры
        executeGame();
    } else if (location.pathname.includes('index') || location.pathname == '/' || location.pathname.includes('Arcanoid')) { // главная страница 
        let playButton = document.getElementById('box-3'),
            appearanceButton = document.getElementById('box-2');

        playButton.onclick = function() {
            window.location.href = './mode.html';
        }
        appearanceButton.onclick = function() {
            window.location.href = './appearance.html';
        }


    } else if (location.pathname.includes('mode')) { // страница выбора режима
        let playButton = document.getElementById('infinity-button');

        playButton.onclick = function() {
            window.location.href = './game.html';
        }
    } else if (location.pathname.includes('appearance')) { // страница настройки внешнего вида
        let ballColorInput = document.getElementById('ball-color'),
            paddleColorInput = document.getElementById('paddle-color'),
            bricksColorInput = document.getElementById('bricks-color'),
            fieldColorInput = document.getElementById('field-color'),
            saveAppearanceButton = document.getElementById('save-appearance');

        if (!ballColorInput.hasAttribute('value')) {
            ballColorInput.setAttribute('value', localStorage.ballColor);
        }
        if (!paddleColorInput.hasAttribute('value')) {
            paddleColorInput.setAttribute('value', localStorage.paddleColor);
        }
        if (!bricksColorInput.hasAttribute('value')) {
            bricksColorInput.setAttribute('value', localStorage.bricksColor);
        }
        if (!fieldColorInput.hasAttribute('value')) {
            fieldColorInput.setAttribute('value', localStorage.fieldColor);
        }

        saveAppearanceButton.onclick = function() {
            localStorage.setItem('ballColor', ballColorInput.value);
            localStorage.setItem('paddleColor', paddleColorInput.value);
            localStorage.setItem('bricksColor', bricksColorInput.value);
            localStorage.setItem('fieldColor', fieldColorInput.value);
        }
    }
}