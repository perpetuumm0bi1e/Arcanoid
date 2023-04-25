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

    let level_bricks = [];
    level_bricks.push([]);
    if (sessionStorage.mode == 'infinity') {
        for (let row = 0; row < sessionStorage.bricksNumberRow; row++) {
            level_bricks.push([]);
            for (let col = 0; col < sessionStorage.bricksNumberColumn; col++) {
                level_bricks[row].push('P');
            }
        }
    }
    const colorMap = {
        'P': sessionStorage.bricksColor,
        'R': '#5955B3',
        'O': '#5955B3',
        'G': '#5955B3',
        'Y': '#5955B3'
    };

    // параметры 
    let score = 0,
        wallSize = 12,
        brickGap,
        brickHeight,
        brickWidth,
        paddleWidth,
        paddleHeight,
        bricks = [],
        sec = 0,
        min = 0,
        t;

    if (sessionStorage.mode == 'story') {
        brickGap = 5;
        (radioHorizontal.checked) ?
        (brickHeight = (field.offsetHeight - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length,
            brickWidth = brickHeight / 2.5,
            paddleHeight = sessionStorage.mode == 'infinity' ? Number(sessionStorage.paddleSize) : (field.offsetHeight - 2 * wallSize) / 5,
            paddleWidth = 10) :
        (brickWidth = (field.offsetWidth - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length,
            brickHeight = brickWidth / 2.5,
            paddleWidth = sessionStorage.mode == 'infinity' ? Number(sessionStorage.paddleSize) : (field.offsetWidth - 2 * wallSize) / 5,
            paddleHeight = 10);
    } else if (sessionStorage.mode == 'infinity') {
        brickGap = Number(sessionStorage.gapsSize);
        (radioHorizontal.checked) ?
        (brickHeight = (field.offsetHeight - 2 * wallSize - brickGap * (sessionStorage.bricksNumberColumn - 1)) / sessionStorage.bricksNumberColumn,
            brickWidth = brickHeight / 2.5,
            paddleHeight = sessionStorage.mode == 'infinity' ? Number(sessionStorage.paddleSize) : (field.offsetHeight - 2 * wallSize) / 5,
            paddleWidth = 10) :
        (brickWidth = (field.offsetWidth - 2 * wallSize - brickGap * (sessionStorage.bricksNumberColumn - 1)) / sessionStorage.bricksNumberColumn,
            brickHeight = brickWidth / 2.5,
            paddleWidth = sessionStorage.mode == 'infinity' ? Number(sessionStorage.paddleSize) : (field.offsetWidth - 2 * wallSize) / 5,
            paddleHeight = 10);
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

    function bricksFill(arr, option) {
        switch (option) {
            case 'horizontal':
                for (let row = 0; row < arr.length; row++) {
                    for (let col = 0; col < arr[row].length; col++) {
                        let colorCode = arr[row][col];
                        bricks.push({
                            x: wallSize + (brickWidth + brickGap) * row + field.offsetWidth * 0.05,
                            y: wallSize + (brickHeight + brickGap) * col,
                            color: colorMap[colorCode],
                            width: brickWidth,
                            height: brickHeight
                        });
                    }
                }
                break;
            case 'vertical':
                for (let row = 0; row < arr.length; row++) {
                    for (let col = 0; col < arr[row].length; col++) {
                        const colorCode = arr[row][col];
                        bricks.push({
                            x: wallSize + (brickWidth + brickGap) * col,
                            y: wallSize + (brickHeight + brickGap) * row + field.offsetHeight * 0.05,
                            color: colorMap[colorCode],
                            width: brickWidth,
                            height: brickHeight
                        });
                    }
                }
                break;
        }

    }
    (radioHorizontal.checked) ?
    (sessionStorage.mode == 'infinity' ? bricksFill(level_bricks, 'horizontal') : bricksFill(level1, 'horizontal')) :
    (sessionStorage.mode == 'infinity' ? bricksFill(level_bricks, 'vertical') : bricksFill(level1, 'vartical'));

    const paddle = {
        x: radioHorizontal.checked ? field.offsetWidth * 0.94 : field.offsetWidth / 2 - paddleWidth / 2,
        y: radioHorizontal.checked ? field.offsetHeight / 2 - paddleWidth / 2 : field.offsetHeight * 0.94,
        width: Number(paddleWidth),
        height: Number(paddleHeight),
        dx: 0, // направление по x
        dy: 0 // направление по y
    };
    const ball = {
        x: (radioHorizontal.checked) ? field.offsetWidth * 0.6 : field.offsetWidth * 0.4,
        y: (radioHorizontal.checked) ? field.offsetHeight * 0.4 : field.offsetHeight * 0.6,
        radius: (sessionStorage.mode == 'infinity') ? Number(sessionStorage.ballRadius) : 10,
        speed: (sessionStorage.mode == 'infinity') ? Number(sessionStorage.ballSpeed) : 7,
        dx: 0,
        dy: 0
    };

    // проверка касания объектов
    function collides(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.radius > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.radius > obj2.y;
    }

    // главный цикл игры
    function loop() {
        //очистка поля и новая отрисовка
        requestAnimationFrame(loop);
        context.clearRect(0, 0, field.offsetWidth, field.offsetHeight);

        (radioHorizontal.checked) ? paddle.y += paddle.dy: paddle.x += paddle.dx; // движение платформы с заданной скоростью

        // контроль за нахождением платформы в границах поля
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
            if (ball.x < wallSize + ball.radius) {
                ball.x = wallSize + ball.radius;
                ball.dx *= -1;
            }
            if (ball.y < wallSize + ball.radius) {
                ball.y = wallSize + ball.radius;
                ball.dy *= -1;
            } else if (ball.y + ball.radius > field.offsetHeight - wallSize) {
                ball.y = field.offsetHeight - wallSize - ball.radius;
                ball.dy *= -1;
            }
        } else if (radioVertical.checked) { // для вертикального
            if (ball.x - ball.radius < wallSize) {
                ball.x = wallSize + ball.radius;
                ball.dx *= -1;
            } else if (ball.x + ball.radius > field.offsetWidth - wallSize) {
                ball.x = field.offsetWidth - wallSize - ball.radius;
                ball.dx *= -1;
            }
            if (ball.y < wallSize + ball.radius) {
                ball.y = wallSize + ball.radius;
                ball.dy *= -1;
            }
        }

        // перезапуск шарика
        // для горизонтального
        if (radioHorizontal.checked && (ball.x + ball.radius > field.offsetWidth - wallSize)) {
            ball.x = field.offsetWidth * 0.6;
            ball.y = field.offsetHeight * 0.4;
            ball.dx = 0;
            ball.dy = 0;
        } else if (radioVertical.checked && (ball.y + ball.radius > field.offsetHeight - wallSize)) { // для вертикального
            ball.x = field.offsetWidth * 0.4;
            ball.y = field.offsetHeight * 0.6;
            ball.dx = 0;
            ball.dy = 0;
        }

        // проверка касания платформы
        if (radioHorizontal.checked && collides(ball, paddle)) {
            ball.dx *= -1;
            ball.x = paddle.x - ball.radius;
        } else if (radioVertical.checked && collides(ball, paddle)) {
            ball.dy *= -1;
            ball.y = paddle.y - ball.radius;
        }

        // проверка касания кирпича
        for (let i = 0; i < bricks.length; i++) {
            let brick = bricks[i];
            if (collides(ball, brick)) {
                bricks.splice(i, 1);
                if (ball.y + ball.radius - ball.speed <= brick.y) {
                    ball.y = brick.y - ball.radius;
                    ball.dy *= -1;
                } else if (ball.y + ball.speed >= brick.y + brick.height) {
                    ball.y = brick.y + brick.height + ball.radius;
                    ball.dy *= -1;
                } else if (ball.x + ball.radius - ball.speed <= brick.x) {
                    ball.x = brick.x - ball.radius;
                    ball.dx *= -1;
                } else if (ball.x >= brick.x + brick.width - ball.speed) {
                    ball.x = brick.x + brick.width + ball.radius;
                    ball.dx *= -1;
                }
                score++;
                document.getElementById('score').innerHTML = score;
                break;
            }
        }

        // отрисовка стен
        context.fillStyle = sessionStorage.fieldColor;
        document.getElementById('canvas-container').style.background = sessionStorage.fieldColor;
        document.getElementById('canvas-container').style.borderRadius = '2.15rem';
        context.fillRect(0, 0, field.offsetWidth, wallSize);
        context.fillRect(0, 0, wallSize, field.offsetHeight);
        context.fillRect(field.offsetWidth - wallSize, 0, wallSize, field.offsetHeight);
        context.fillRect(0, field.offsetHeight - wallSize, field.offsetWidth, wallSize);

        // отрисовка шарика,  если он в движении
        if (ball.dx || ball.dy) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, 360);
            context.fillStyle = sessionStorage.ballColor; // цвет мяча
            context.fill();
        }

        // отрисовка кирпичей
        bricks.forEach(function(brick) {
            context.fillStyle = brick.color;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        // отрисовка платформы
        context.fillStyle = sessionStorage.paddleColor;
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    // функция запуска мяча
    function threwBall(counter) {
        counter++;
        if (ball.dx === 0 && ball.dy === 0) {
            if (counter == 1) {
                timer();
                field.style.cursor = 'none';
            }
            if (radioHorizontal.checked) {
                ball.x = field.offsetWidth * 0.6;
                ball.y = field.offsetHeight * 0.4;
                ball.dx = ball.speed;
                ball.dy = ball.speed / 1.5;
            } else if (radioVertical.checked) {
                ball.x = field.offsetWidth * 0.4;
                ball.y = field.offsetHeight * 0.6;
                ball.dx = ball.speed / 1.5;
                ball.dy = ball.speed;
            }
        }
        return counter;
    }
    let сlickCounter = 0,
        touchPosition,
        pointerPosition;

    // нажатие тачскрина
    field.addEventListener('touchstart', e => {
        e.preventDefault();
    })

    // отжатие тачскрина
    field.addEventListener('touchend', e => {
        сlickCounter = threwBall(сlickCounter);
    })

    // ведение по тачскрину
    field.addEventListener('touchmove', e => {
        touchPosition = {
            x: e.changedTouches[0].clientX - field.getBoundingClientRect().left,
            y: e.changedTouches[0].clientY - field.getBoundingClientRect().top
        };
        if (radioTouchscreen.checked) {
            (radioHorizontal.checked) ? paddle.y = touchPosition.y - paddleHeight / 2: paddle.x = touchPosition.x - paddleWidth / 2;
        }
    })

    // нажатие клавиши
    document.addEventListener('keydown', function(e) {
        if (radioKeyboard.checked && radioHorizontal.checked) {
            if (e.which === 87 || e.which === 38) {
                paddle.dy = (sessionStorage.mode == 'infinity') ? (-1 * sessionStorage.paddleSpeed) : -10;
            } else if (e.which === 83 || e.which === 40) {
                paddle.dy = (sessionStorage.mode == 'infinity') ? sessionStorage.paddleSpeed : 10;
            }
            if (e.which === 32) {
                сlickCounter = threwBall(сlickCounter);
            }
        } else if (radioKeyboard.checked && radioVertical.checked) {
            if (e.which === 65 || e.which === 37) {
                paddle.dx = (sessionStorage.mode == 'infinity') ? (-1 * sessionStorage.paddleSpeed) : -10;
            } else if (e.which === 68 || e.which === 39) {
                paddle.dx = (sessionStorage.mode == 'infinity') ? sessionStorage.paddleSpeed : 10;
            }
            if (e.which === 32) {
                сlickCounter = threwBall(сlickCounter);
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
        сlickCounter = threwBall(сlickCounter);
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
    document.addEventListener('keyup', function(e) {
        if (e.which === 13) {
            windowSetting();
        }
    });

    requestAnimationFrame(loop);

}

function windowSetting() {
    let canvasWidth, canvasHeight;
    let radioHorizontal = document.getElementById('horizontal'),
        radioVertical = document.getElementById('vertical'),
        gameContainer = document.getElementById('game-container'),
        canvasContainer = document.getElementById('canvas-container');

    if (location.pathname.includes('index') || location.pathname.split('').pop() == '/') { // главная страница 
        let playButton = document.getElementById('play-box'),
            appearanceButton = document.getElementById('appearance-box'),
            settingsButton = document.getElementById('settings-box'),
            detailsButton = document.getElementById('details-box'),
            profileButton = document.getElementById('profile-box');

        playButton.onclick = function() {
            window.location.href = './mode.html';
        }
        appearanceButton.onclick = function() {
            window.location.href = './appearance.html';
        }
        settingsButton.onclick = function() {
            window.location.href = './settings.html';
        }
        detailsButton.onclick = function() {
            window.location.href = './details.html';
        }
        profileButton.onclick = function() {
            window.location.href = './profile.html';
        }


    } else if (location.pathname.includes('mode')) { // страница выбора режима
        let playButton = document.getElementById('infinity-button');

        playButton.onclick = function() {
            sessionStorage.setItem('mode', 'infinity');
            window.location.href = './infinity-game.html';
        }
    } else if (location.pathname.includes('appearance')) { // страница настройки внешнего вида
        let ballColorInput = document.getElementById('ball-color'),
            paddleColorInput = document.getElementById('paddle-color'),
            bricksColorInput = document.getElementById('bricks-color'),
            fieldColorInput = document.getElementById('field-color'),
            saveAppearanceButton = document.getElementById('save-appearance');

        setValueFromLocal(ballColorInput, 'ballColor');
        setValueFromLocal(paddleColorInput, 'paddleColor');
        setValueFromLocal(bricksColorInput, 'bricksColor');
        setValueFromLocal(fieldColorInput, 'fieldColor');

        function setValueFromLocal(input, key) {
            if (!input.hasAttribute('value')) {
                input.setAttribute('value', localStorage[key]);
            }
        }

        saveAppearanceButton.onclick = function() {
            localStorage.setItem('ballColor', ballColorInput.value);
            localStorage.setItem('paddleColor', paddleColorInput.value);
            localStorage.setItem('bricksColor', bricksColorInput.value);
            localStorage.setItem('fieldColor', fieldColorInput.value);
            window.location.href = './index.html';
        }

        document.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                localStorage.setItem('ballColor', ballColorInput.value);
                localStorage.setItem('paddleColor', paddleColorInput.value);
                localStorage.setItem('bricksColor', bricksColorInput.value);
                localStorage.setItem('fieldColor', fieldColorInput.value);
                window.location.href = './index.html';
            }
        });
        windowSetting();
    } else if (location.pathname.includes('profile')) {
        let saveSettingsButton = document.getElementById('save-settings'),
            playerName = document.getElementById('player-name'),
            forgetMeButton = document.getElementById('forget-me');

        (localStorage.userName) ? playerName.value = localStorage.userName: playerName.value = '';

        forgetMeButton.onclick = function() {
            let answer = prompt('Clear all user data? Write "YES" if you are sure:', '');
            switch (answer) {
                case 'YES':
                    localStorage.clear();
                    sessionStorage.clear();
                    location.reload();
                    break;
                default:
                    alert("Data cleanup canceled");
                    break;
            }
        }

        saveSettingsButton.onclick = function() {
            localStorage.setItem('userName', playerName.value);
            location.reload();
        }

        document.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                localStorage.setItem('userName', playerName.value);
                location.reload();
            }
        });
    } else if (location.pathname.includes('settings')) {
        let paddleSpeed = document.getElementById('paddle-speed'),
            resPaddleSpeed = document.getElementById('res-paddle-speed'),
            ballSpeed = document.getElementById('ball-speed'),
            resBallSpeed = document.getElementById('res-ball-speed'),
            paddleSize = document.getElementById('paddle-size'),
            resPaddleSize = document.getElementById('res-paddle-size'),
            ballRadius = document.getElementById('ball-radius'),
            resBallRadius = document.getElementById('res-ball-radius'),
            saveSettingsButton = document.getElementById('save-settings');

        if (!paddleSpeed.hasAttribute('value')) {
            paddleSpeed.setAttribute('value', localStorage.paddleSpeed);
            resPaddleSpeed.innerHTML = paddleSpeed.value;
        }
        if (!ballSpeed.hasAttribute('value')) {
            ballSpeed.setAttribute('value', localStorage.ballSpeed);
            resBallSpeed.innerHTML = ballSpeed.value;
        }
        if (!paddleSize.hasAttribute('value')) {
            paddleSize.setAttribute('value', localStorage.paddleSize);
            resPaddleSize.innerHTML = paddleSize.value;
        }
        if (!ballRadius.hasAttribute('value')) {
            ballRadius.setAttribute('value', localStorage.ballRadius);
            resBallRadius.innerHTML = ballRadius.value;
        }
        setRangeValue(paddleSpeed, resPaddleSpeed);
        setRangeValue(ballSpeed, resBallSpeed);
        setRangeValue(paddleSize, resPaddleSize);
        setRangeValue(ballRadius, resBallRadius);

        function setRangeValue(range, label) {
            range.style.backgroundSize = (range.value - range.min) * 100 / (range.max - range.min) + '% 100%';
            range.addEventListener('input', function() {
                label.innerHTML = range.value;
                range.style.backgroundSize = (range.value - range.min) * 100 / (range.max - range.min) + '% 100%';
            })
        }
        saveSettingsButton.onclick = function() {
            localStorage.setItem('paddleSpeed', paddleSpeed.value);
            localStorage.setItem('ballSpeed', ballSpeed.value);
            localStorage.setItem('paddleSize', paddleSize.value);
            localStorage.setItem('ballRadius', ballRadius.value);
            location.reload();
        }

        document.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                localStorage.setItem('paddleSpeed', paddleSpeed.value);
                localStorage.setItem('ballSpeed', ballSpeed.value);
                localStorage.setItem('paddleSize', paddleSize.value);
                localStorage.setItem('ballRadius', ballRadius.value);
                location.reload();
            }
        });
    } else if (location.pathname.includes('game')) { // страница игры
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

            // для телефонов
            (document.body.clientWidth < 740) ?
            (radioHorizontal.disabled = true,
                radioVertical.checked = true,
                canvasWidth = gameContainer.offsetWidth - 20,
                canvasHeight = canvasWidth * 2) :
            radioHorizontal.disabled = false;

            // для планшетов
            if (!radioHorizontal.checked && !radioVertical.checked && !radioHorizontal.disabled) {
                radioHorizontal.checked = true;
            }
            if (radioVertical.checked && !radioHorizontal.disabled) {
                canvasWidth = gameContainer.offsetWidth * .7;
                canvasHeight = canvasWidth * 1.9;
            } else if (radioHorizontal.checked && !radioHorizontal.disabled) {
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth / 1.3;
            }
            document.getElementById('touchscreen').checked = true;
        } else { // для пк
            if (!radioHorizontal.checked && !radioVertical.checked) {
                radioHorizontal.checked = true;
            }
            if (radioVertical.checked) {
                canvasWidth = gameContainer.offsetWidth * .6;
                canvasHeight = canvasWidth * 1.6;
            } else if (radioHorizontal.checked) {
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth / 1.6;
            }
            document.getElementById('mouse').checked = true;
        }

        canvasContainer.innerHTML = `<canvas id='game' width='${canvasWidth}' height='${canvasHeight}'></canvas>`;

        if (location.pathname.includes('infinity-game')) {
            let bricksNumberRow = document.getElementById('bricks-number-row'),
                resBricksNumberRow = document.getElementById('res-bricks-number-row'),
                bricksNumberColumn = document.getElementById('bricks-number-column'),
                resBricksNumberColumn = document.getElementById('res-bricks-number-column'),
                gapsSize = document.getElementById('gaps-size'),
                resGapsSize = document.getElementById('res-gaps-size'),
                paddleSpeed = document.getElementById('paddle-speed'),
                resPaddleSpeed = document.getElementById('res-paddle-speed'),
                ballSpeed = document.getElementById('ball-speed'),
                resBallSpeed = document.getElementById('res-ball-speed'),
                paddleSize = document.getElementById('paddle-size'),
                resPaddleSize = document.getElementById('res-paddle-size'),
                ballRadius = document.getElementById('ball-radius'),
                resBallRadius = document.getElementById('res-ball-radius'),
                ballColor = document.getElementById('ball-color'),
                paddleColor = document.getElementById('paddle-color'),
                bricksColor = document.getElementById('bricks-color'),
                fieldColor = document.getElementById('field-color');


            checkSessionStorageValueConst(bricksNumberRow, resBricksNumberRow, 13, 'bricksNumberRow');
            checkSessionStorageValueConst(bricksNumberColumn, resBricksNumberColumn, 12), 'bricksNumberColumn';
            checkSessionStorageValueConst(gapsSize, resGapsSize, 5, 'gapsSize');

            setInputValueFromSessionOrLocal(paddleSpeed, resPaddleSpeed, 'paddleSpeed');
            setInputValueFromSessionOrLocal(ballSpeed, resBallSpeed, 'ballSpeed');
            setInputValueFromSessionOrLocal(paddleSize, resPaddleSize, 'paddleSize');
            setInputValueFromSessionOrLocal(ballRadius, resBallRadius, 'ballRadius');
            setInputValueFromSessionOrLocal(ballRadius, resBallRadius, 'ballRadius');

            setInputValueFromSessionOrLocal(ballColor, '', 'ballColor');
            setInputValueFromSessionOrLocal(paddleColor, '', 'paddleColor');
            setInputValueFromSessionOrLocal(bricksColor, '', 'bricksColor');
            setInputValueFromSessionOrLocal(fieldColor, '', 'fieldColor');

            setSessionStorageItem(bricksNumberRow, 'bricksNumberRow');
            setSessionStorageItem(bricksNumberColumn, 'bricksNumberColumn');
            setSessionStorageItem(gapsSize, 'gapsSize');
            setSessionStorageItem(paddleSpeed, 'paddleSpeed');
            setSessionStorageItem(ballSpeed, 'ballSpeed');
            setSessionStorageItem(paddleSize, 'paddleSize');
            setSessionStorageItem(ballRadius, 'ballRadius');

            setSessionStorageItem(ballColor, 'ballColor');
            setSessionStorageItem(paddleColor, 'paddleColor');
            setSessionStorageItem(bricksColor, 'bricksColor');
            setSessionStorageItem(fieldColor, 'fieldColor');

            setRangeSessionValue(bricksNumberRow, resBricksNumberRow, 'bricksNumberRow');
            setRangeSessionValue(bricksNumberColumn, resBricksNumberColumn, 'bricksNumberColumn');
            setRangeSessionValue(gapsSize, resGapsSize, 'gapsSize');
            setRangeSessionValue(paddleSpeed, resPaddleSpeed, 'paddleSpeed');
            setRangeSessionValue(ballSpeed, resBallSpeed, 'ballSpeed');
            setRangeSessionValue(paddleSize, resPaddleSize, 'paddleSize');
            setRangeSessionValue(ballRadius, resBallRadius, 'ballRadius');

            function checkSessionStorageValueConst(range, label, value, key) {
                if (!range.hasAttribute('value')) {
                    (sessionStorage[key]) ?
                    range.setAttribute('value', sessionStorage[key]):
                        range.setAttribute('value', value);
                    label.innerHTML = range.value;
                }
            }

            function setInputValueFromSessionOrLocal(input, label, key) {
                if (!input.hasAttribute('value')) {
                    (sessionStorage[key]) ?
                    input.setAttribute('value', sessionStorage[key]):
                        input.setAttribute('value', localStorage[key]);
                    if (label != '') {
                        label.innerHTML = input.value;
                    }
                }
            }

            function setSessionStorageItem(input, key) {
                sessionStorage.setItem(key, input.value);
            }

            function setRangeSessionValue(range, label, key) {
                range.style.backgroundSize = (range.value - range.min) * 100 / (range.max - range.min) + '% 100%';
                range.addEventListener('input', function() {
                    sessionStorage.setItem(key, range.value);
                    label.innerHTML = range.value;
                    range.style.backgroundSize = (range.value - range.min) * 100 / (range.max - range.min) + '% 100%';
                })
            }

            console.log('после');
            console.log(sessionStorage);
            console.log(localStorage);
            executeGame();
        }
    }

}
window.addEventListener('resize', function(event) {
    windowSetting();
});
window.onload = function() {

    setValueToLocalIfNotExists('paddleSize', '120');
    setValueToLocalIfNotExists('paddleSpeed', '10');
    setValueToLocalIfNotExists('ballSpeed', '7');
    setValueToLocalIfNotExists('ballRadius', '10');
    setValueToLocalIfNotExists('fieldColor', '#FEFEFE');
    setValueToLocalIfNotExists('bricksColor', '#5955B3');
    setValueToLocalIfNotExists('paddleColor', '#282828');
    setValueToLocalIfNotExists('ballColor', '#DA2E2E');

    function setValueToLocalIfNotExists(key, value) {
        if (!localStorage[key]) {
            localStorage.setItem(key, value);
        }
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

    for (let element of impulseAppearedElements) { observer.observe(element); }
    for (let element of topAppearedElements) { observer.observe(element); }
    for (let element of bottomAppearedElements) { observer.observe(element); }

    if (location.pathname.includes('index') || location.pathname.split('').pop() == '/') { // главная страница 
        let greetingBox = document.getElementById('greeting-box');

        if (!localStorage.userName || localStorage.userName == undefined) {
            greetingBox.innerHTML = `
            <p class="medium-text-black" id="greetings">
                It seems like we didn't met yet. Please introduce yourself:
            </p>
            <div class="introduce-block">
                <div class="input-data">
                    <input class="medium-text-black" type="text" id="player-name" required />
                    <div class="underline"></div>
                    <label class="medium-text">My name is...</label>
                </div>
                <button class="medium-text button-type-1" id="set-up-name"></button>
            </div>`;

            let userNameInput = document.getElementById('player-name'),
                setUpUserName = document.getElementById('set-up-name');

            setUpUserName.onclick = function() {
                localStorage.setItem('userName', userNameInput.value);
                location.reload();
            }
            document.addEventListener('keyup', function(e) {
                if (e.which === 13) {
                    localStorage.setItem('userName', userNameInput.value);
                    location.reload();
                }
            });

        }
        if (localStorage.userName && localStorage.userName != undefined) {
            var now = new Date(),
                greetings = '';
            if (now.getHours() >= 6 && now.getHours() < 12) {
                let intros = [`Morning, ${localStorage.userName}! What a good day, isn't it?`,
                    `Sup, ${localStorage.userName}! Wanna start day with game?`,
                    `Yo, ${localStorage.userName}! Wanna play bright and early?`,
                    `Ahoy, ${localStorage.userName}! How pleasant to see ya this morning...`,
                    `Hi there, ${localStorage.userName}! Top of the morning to you <3`
                ];
                greetings = intros[Math.floor(Math.random() * intros.length)];
            } else if (now.getHours() >= 12 && now.getHours() < 18) {
                let intros = [`Hey, ${localStorage.userName}! What a good day, isn't it?`,
                    `Hi there, ${localStorage.userName}! Let's play?`,
                    `Wats's up, ${localStorage.userName}! Wanna break some blocks?`,
                    `Wassup, ${localStorage.userName}! Nice to see ya again :)`,
                    `Oh, ${localStorage.userName}, there's stacks to do and there's stacks to see, 
                    there's stacks to touch and there's stacks to be, so many ways to spend your time, but you decided to do it with me... 
                    So pathetically, but i'm still just a blocks breaker...`
                ];
                greetings = intros[Math.floor(Math.random() * intros.length)];
            } else if (now.getHours() >= 18 && now.getHours() < 24) {
                let intros = [`Sup, ${localStorage.userName}! Decided to spend the evening crashing bricks?`,
                    `Hi there, ${localStorage.userName}! Tnx for choosing to spend this evening with me...`,
                    `Wats's up, ${localStorage.userName}! So what are you doing up in the middle of the night?`,
                    `Evening, ${localStorage.userName}! Nice to see ya again :)`
                ];
                greetings = intros[Math.floor(Math.random() * intros.length)];
            } else if (now.getHours() < 6) {
                let intros = [`Yo, ${localStorage.userName}! Decided to dedicate the night to brickbreaker?`,
                    `Hi there, ${localStorage.userName}! People usually sleep at night... Well okay...`,
                    `Wats's up, ${localStorage.userName}! Wanna to brighten up your evening with a game?`,
                    `Sup, ${localStorage.userName}! Why are you awake, may I ask?`
                ];
                greetings = intros[Math.floor(Math.random() * intros.length)];
            }
            greetingBox.classList.remove('box');
            greetingBox.innerHTML = `<p class="medium-text description-label"> ${greetings} </p>`;
        }
    }
}