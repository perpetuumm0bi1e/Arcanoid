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

    (radioHorizontal.checked) ?
    (brickHeight = (field.offsetHeight - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length,
        brickWidth = brickHeight / 2,
        paddleHeight = sessionStorage.mode == 'infinity' ? localStorage.paddleSize : (field.offsetHeight - 2 * wallSize) / 5,
        paddleWidth = paddleHeight * 0.1) :
    (brickWidth = (field.offsetWidth - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length,
        brickHeight = brickWidth / 2,
        paddleWidth = sessionStorage.mode == 'infinity' ? localStorage.paddleSize : (field.offsetWidth - 2 * wallSize) / 5,
        paddleHeight = paddleWidth * 0.1);

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
        x: radioHorizontal.checked ? field.offsetWidth * 0.9 : field.offsetWidth / 2 - paddleWidth / 2,
        y: radioHorizontal.checked ? field.offsetHeight / 2 - paddleWidth / 2 : field.offsetHeight * 0.9,
        width: paddleWidth,
        height: paddleHeight,
        dx: 0, // направление по x
        dy: 0 // направление по y
    };
    const ball = {
        x: (radioHorizontal.checked) ? field.offsetWidth * 0.6 : field.offsetWidth * 0.4,
        y: (radioHorizontal.checked) ? field.offsetHeight * 0.4 : field.offsetHeight * 0.6,
        radius: (sessionStorage.mode == 'infinity') ? localStorage.ballRadius : 10,
        speed: (sessionStorage.mode == 'infinity') ? localStorage.ballSpeed : 7,
        dx: 0,
        dy: 0
    };

    // проверка на касание объектов
    function collides(ball, obj, orientation, config) {
        switch (orientation) {
            case 'horizontal':
                switch (config) {
                    case 'paddle':
                        return ball.x + ball.radius >= obj.x &&
                            ball.y >= obj.y &&
                            ball.y <= obj.y + obj.height;
                    case 'brick':
                        return ball.x - ball.radius <= obj.x + obj.width &&
                            ball.y >= obj.y &&
                            ball.y <= obj.y + obj.height ||
                            ball.x + ball.radius == obj.x &&
                            ball.y >= obj.y &&
                            ball.y <= obj.y + obj.height ||
                            ball.y - ball.radius == obj.y + obj.height &&
                            ball.x <= obj.x + obj.width &&
                            ball.x >= obj.x ||
                            ball.y + ball.radius == obj.y &&
                            ball.x <= obj.x + obj.width &&
                            ball.x >= obj.x;
                }
                break;
            case 'vertical':
                switch (config) {
                    case 'paddle':
                        return ball.y + ball.radius >= obj.y &&
                            ball.x >= obj.x &&
                            ball.x <= obj.x + obj.width;
                    case 'brick':
                        return ball.y - ball.radius <= obj.y + obj.height &&
                            ball.x >= obj.x &&
                            ball.x <= obj.x + obj.width ||
                            ball.y + ball.radius == obj.y &&
                            ball.x >= obj.x &&
                            ball.x <= obj.x + obj.width ||
                            ball.x + ball.radius == obj.x &&
                            ball.y <= obj.y + obj.height &&
                            ball.y >= obj.y ||
                            ball.x - ball.radius == obj.x + obj.width &&
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
        } else { // для вертикального
            if (ball.x - ball.radius < wallSize) {
                ball.x = wallSize;
                ball.dx *= -1;
            } else if (ball.x + ball.radius > field.offsetWidth - wallSize) {
                ball.x = field.offsetWidth - wallSize - ball.radius;
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
        if (radioHorizontal.checked && (ball.x + ball.radius > field.offsetWidth - wallSize)) {
            ball.x = field.offsetWidth * 0.6;
            ball.y = field.offsetHeight * 0.4;
            ball.dx = 0;
            ball.dy = 0;
        } else if (radioVertical.checked && (ball.y + ball.radius > field.offsetHeight - wallSize)) { // lkz dthnbrfkmyjuj
            ball.x = field.offsetWidth * 0.4;
            ball.y = field.offsetHeight * 0.6;
            ball.dx = 0;
            ball.dy = 0;
       }

        // проверка касания платформы
        if (radioHorizontal.checked && collides(ball, paddle, 'horizontal', 'paddle')) {
            ball.dx *= -1;
            ball.x = paddle.x - ball.radius;
        } else if (radioVertical.checked && collides(ball, paddle, 'vertical', 'paddle')) {
            ball.dy *= -1;
            ball.y = paddle.y - ball.radius;
        }

        // проверка касания кирпича
        if (radioHorizontal.checked) {
            for (let i = 0; i < bricks.length; i++) {
                let brick = bricks[i];
                if (collides(ball, brick, 'horizontal', 'brick')) {
                    bricks.splice(i, 1);
                    score++;
                    document.getElementById('score').innerHTML = score;
                    if (ball.y + ball.radius - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
                        ball.dy *= -1;
                    } else if (ball.x - ball.radius - ball.speed <= brick.x + brick.width - ball.speed) {
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
                    if (ball.y + ball.radius - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
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
            context.arc(ball.x, ball.y, ball.radius, 0, 360);
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
            (radioHorizontal.checked) ? paddle.y = touchPosition.y - paddleHeight / 2 : paddle.x = touchPosition.x - paddleWidth / 2;
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
                paddle.dx = (sessionStorage.mode == 'infinity') ? (-1 * localStorage.paddleSpeed) : -10;
            } else if (e.which === 68 || e.which === 39) {
                paddle.dx = (sessionStorage.mode == 'infinity') ? localStorage.paddleSpeed : 10;
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
            (radioHorizontal.checked) ?
                (ball.x = field.offsetWidth * 0.6, ball.y = field.offsetHeight * 0.4) :
                (ball.x = field.offsetWidth * 0.4, ball.y = field.offsetHeight * 0.6);
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


    let bricksNumberRow = document.getElementById('bricks-number-row'),
        resBricksNumberRow = document.getElementById('res-bricks-number-row'),
        bricksNumberColumn = document.getElementById('bricks-number-column'),
        resBricksNumberColumn = document.getElementById('res-bricks-number-column');

    if (!bricksNumberRow.hasAttribute('value')) {
        (sessionStorage.bricksNumberRow) ? 
        bricksNumberRow.setAttribute('value', sessionStorage.bricksNumberRow) : 
        bricksNumberRow.setAttribute('value', 13);
        resBricksNumberRow.innerHTML = bricksNumberRow.value;
    }
    if (!bricksNumberColumn.hasAttribute('value')) {
        (sessionStorage.bricksNumberColumn) ? 
        bricksNumberColumn.setAttribute('value', sessionStorage.bricksNumberColumn) : 
        bricksNumberColumn.setAttribute('value', 12);

        resBricksNumberColumn.innerHTML = bricksNumberColumn.value;
    }
    if (!sessionStorage.bricksNumberRow) {
        sessionStorage.setItem('bricksNumberRow', bricksNumberRow.value);
    }
    if (!sessionStorage.bricksNumberColumn) {
        sessionStorage.setItem('bricksNumberColumn', bricksNumberColumn.value);
    }

    bricksNumberRow.style.backgroundSize = (bricksNumberRow.value - bricksNumberRow.min) * 100 / (bricksNumberRow.max - bricksNumberRow.min) + '% 100%';
    bricksNumberRow.addEventListener('input', function() {
        sessionStorage.setItem('bricksNumberRow', bricksNumberRow.value);
        resBricksNumberRow.innerHTML = bricksNumberRow.value;
        bricksNumberRow.style.backgroundSize = (bricksNumberRow.value - bricksNumberRow.min) * 100 / (bricksNumberRow.max - bricksNumberRow.min) + '% 100%';
    })
    bricksNumberColumn.style.backgroundSize = (bricksNumberColumn.value - bricksNumberColumn.min) * 100 / (bricksNumberColumn.max - bricksNumberColumn.min) + '% 100%';
    bricksNumberColumn.addEventListener('input', function() {
        sessionStorage.setItem('bricksNumberColumn', bricksNumberColumn.value);
        resBricksNumberColumn.innerHTML = bricksNumberColumn.value;
        bricksNumberColumn.style.backgroundSize = (bricksNumberColumn.value - bricksNumberColumn.min) * 100 / (bricksNumberColumn.max - bricksNumberColumn.min) + '% 100%';
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
        let playButton = document.getElementById('play-box'),
            designButton = document.getElementById('appearance-box'),
            settingsButton = document.getElementById('settings-box');

        // (document.body.clientWidth <= 920 && document.body.clientWidth > 678) ?
        //     (designButton.style.order = '1', 
        //     playButton.style.order = '3', 
        //     settingsButton.style.order = '2') :
        // (document.body.clientWidth <= 678) ?
        //     (designButton.style.order = '2', 
        //     playButton.style.order = '1', 
        //     settingsButton.style.order = '3') :
        //     (designButton.style.order = '1', 
        //     playButton.style.order = '2', 
        //     settingsButton.style.order = '3');

    } else if (location.pathname.includes('game')) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // для телефонов
            (document.body.clientWidth < 740) ? 
                (radioHorizontal.disabled = true,
                radioVertical.checked = true, 
                canvasWidth = gameContainer.offsetWidth - 20, 
                canvasHeight = canvasWidth * 1.6) :
                radioHorizontal.disabled = false;
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
    if (!localStorage.ballRadius) {
        localStorage.setItem('ballRadius', '10');
    }
    if (!localStorage.ballSpeed) {
        localStorage.setItem('ballSpeed', '7');
    }
    if (!localStorage.paddleSpeed) {
        localStorage.setItem('paddleSpeed', '10');
    }
    if (!localStorage.paddleSize) {
        localStorage.setItem('paddleSize', '120');
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

    if (location.pathname.includes('infinity-game')) { // страница игры
        executeGame();
    } else if (location.pathname.includes('index') || location.pathname.split('').pop() == '/') { // главная страница 
        let playButton = document.getElementById('play-box'),
            appearanceButton = document.getElementById('appearance-box'),
            settingsButton = document.getElementById('settings-box'),
            greetingBox = document.getElementById('greeting-box'),
            detailsButton = document.getElementById('details-box'),
            setUpNameButton,
            userNameInput;

        //localStorage.removeItem('userName');
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
                <button class="medium-text button-type-1" id="set-up-name">
                    &#10003;
                </button>`;

            setUpNameButton = document.getElementById('set-up-name');
            userNameInput = document.getElementById('player-name');

            setUpNameButton.onclick = function() {
                localStorage.setItem('userName', userNameInput.value);
                location.reload();
            }
        }


        if (localStorage.userName && localStorage.userName != undefined) {
            var now = new Date(),
                greetings = '';
            if (now.getHours() >= 6 && now.getHours() < 12) {
                let intros = [`Morning, ${localStorage.userName}! What a good day, isn't it?`,
                    `Sup, ${localStorage.userName}! Wanna start day with game?`,
                    `Yo, ${localStorage.userName}! Wanna play bright and early?`,
                    `Ahoy, ${localStorage.userName}! How pleasant to see ya this morning...`
                ];
                greetings = intros[Math.floor(Math.random() * intros.length)];
            } else if (now.getHours() >= 12 && now.getHours() < 18) {
                let intros = [`Hey, ${localStorage.userName}! What a good day, isn't it?`,
                    `Hi there, ${localStorage.userName}! Let's play?`,
                    `Wats's up, ${localStorage.userName}! Wanna play?`,
                    `Wassup, ${localStorage.userName}! Nice to see ya again :)`
                ];
                greetings = intros[Math.floor(Math.random() * intros.length)];
            } else if (now.getHours() >= 18 && now.getHours() < 24) {
                let intros = [`Sup, ${localStorage.userName}! Have you decided to spend the evening playing?`,
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
            window.location.href = './index.html';
        }
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

        paddleSpeed.style.backgroundSize = (paddleSpeed.value - paddleSpeed.min) * 100 / (paddleSpeed.max - paddleSpeed.min) + '% 100%';
        paddleSpeed.addEventListener('input', function() {
            resPaddleSpeed.innerHTML = paddleSpeed.value;
            paddleSpeed.style.backgroundSize = (paddleSpeed.value - paddleSpeed.min) * 100 / (paddleSpeed.max - paddleSpeed.min) + '% 100%';
        })
        ballSpeed.style.backgroundSize = (ballSpeed.value - ballSpeed.min) * 100 / (ballSpeed.max - ballSpeed.min) + '% 100%';
        ballSpeed.addEventListener('input', function() {
            resBallSpeed.innerHTML = ballSpeed.value;
            ballSpeed.style.backgroundSize = (ballSpeed.value - ballSpeed.min) * 100 / (ballSpeed.max - ballSpeed.min) + '% 100%';
        })
        paddleSize.style.backgroundSize = (paddleSize.value - paddleSize.min) * 100 / (paddleSize.max - paddleSize.min) + '% 100%';
        paddleSize.addEventListener('input', function() {
            resPaddleSize.innerHTML = paddleSize.value;
            paddleSize.style.backgroundSize = (paddleSize.value - paddleSize.min) * 100 / (paddleSize.max - paddleSize.min) + '% 100%';
        })
        ballRadius.style.backgroundSize = (ballRadius.value - ballRadius.min) * 100 / (ballRadius.max - ballRadius.min) + '% 100%';
        ballRadius.addEventListener('input', function() {
            resBallRadius.innerHTML = ballRadius.value;
            ballRadius.style.backgroundSize = (ballRadius.value - ballRadius.min) * 100 / (ballRadius.max - ballRadius.min) + '% 100%';
        })
        saveSettingsButton.onclick = function() {
            localStorage.setItem('paddleSpeed', paddleSpeed.value);
            localStorage.setItem('ballSpeed', ballSpeed.value);
            localStorage.setItem('paddleSize', paddleSize.value);
            localStorage.setItem('ballRadius', ballRadius.value);
            window.location.href = './index.html';
        }
    }
}