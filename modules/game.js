import { levels } from './levels.js';
import { windowSetting } from './window-settings.js';

export function executeGame() {
    // модальное окно
    let modal = document.getElementById('modal'),
        closeModalButton = document.getElementById('close-modal-button'),
        modalTriggers = document.querySelectorAll('[data-trigger]');
    
    let isModalOpen = false, pageYOffset = 0;

     modalTriggers.forEach(function(item) {
        item.addEventListener('click', function() {
            pageYOffset = window.pageYOffset;
            modal.classList.add('is-open');
            isModalOpen = true;
        });
    })
    
    document.addEventListener('scroll', function(e) {
        if (isModalOpen) {
            e.preventDefault();
            window.scrollTo(0, pageYOffset);
        }
    });

    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('is-open');
        isModalOpen = false;
    });

    let field = document.getElementById('game'),
        context = field.getContext('2d'),
        radioKeyboard = document.querySelector('#keyboard'),
        radioMouse = document.querySelector('#mouse'),
        radioTouchscreen = document.querySelector('#touchscreen'),
        restartButton = document.getElementById('restart'),
        radioHorizontal = document.querySelector('#horizontal'),
        radioVertical = document.querySelector('#vertical');

    let level_bricks = [], maxScore = 0, colorMap = {}, parameters = {}, environmentColors = {};

    if(sessionStorage.mode == 'story'){

        parameters = levels[`level${sessionStorage.level}`].parameters;
        colorMap = levels[`level${sessionStorage.level}`].colorMap;
        environmentColors = levels[`level${sessionStorage.level}`].environmentColors;
        level_bricks = levels[`level${sessionStorage.level}`].level_bricks;

    } else if(sessionStorage.mode == 'infinity'){

        if (sessionStorage.mode == 'infinity') {
            for (let row = 0; row < sessionStorage.bricksNumberRow; row++) {
                level_bricks.push([]);
                for (let col = 0; col < sessionStorage.bricksNumberColumn; col++) {
                    level_bricks[row].push('inf');
                }
            }
        }
        colorMap = {
            'inf': sessionStorage.bricksColor
        };
        parameters = {
            'brick': 30,
            'paddle': Number(sessionStorage.paddleSize),
            'gap': Number(sessionStorage.gapsSize),
            'ball-speed': Number(sessionStorage.ballSpeed),
            'ball': Number(sessionStorage.ballRadius),
            'paddle-speed': Number(sessionStorage.paddleSpeed)
        };
        environmentColors = {
            'field': sessionStorage.field,
            'ball': sessionStorage.ballColor,
            'paddle': sessionStorage.paddleColor
        }
    }

    // параметры 
    let score = 0,
        wallSize = 10,
        brickGap = parameters['gap'],
        brickHeight = parameters['brick'],
        brickWidth = parameters['brick'],
        paddleWidth,
        paddleHeight,
        bricks = [],
        sec = 0,
        min = 0,
        t;
    
    (radioHorizontal.checked) ?
    (paddleHeight = parameters['paddle'], paddleWidth = 10) :
    (paddleWidth = parameters['paddle'], paddleHeight = 10);

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
        for (let row = 0; row < arr.length; row++) {
            for (let col = 0; col < arr[row].length; col++) {
                let colorCode = arr[row][col];
                if(arr[row][col] != 0){
                    maxScore++;
                    bricks.push({
                        x: option == 'horizontal' ?
                            wallSize + (brickWidth + brickGap) * row + field.offsetWidth * 0.05 : wallSize + (brickWidth + brickGap) * col,
                        y: option == 'horizontal' ?
                            wallSize + (brickHeight + brickGap) * col : wallSize + (brickHeight + brickGap) * row + field.offsetHeight * 0.05,
                        color: colorMap[colorCode],
                        width: brickWidth,
                        height: brickHeight
                    });
                }
            }
        }

    }
    (radioHorizontal.checked) ? bricksFill(level_bricks, 'horizontal') : bricksFill(level_bricks, 'vartical');
    console.log(maxScore);
    const paddle = {
        x: radioHorizontal.checked ? field.offsetWidth * 0.94 : field.offsetWidth / 2 - paddleWidth / 2,
        y: radioHorizontal.checked ? field.offsetHeight / 2 - paddleWidth / 2 : field.offsetHeight * 0.9,
        width: paddleWidth,
        height: paddleHeight,
        dx: 0, // направление по x
        dy: 0 // направление по y
    };
    const ball = {
        x: (radioHorizontal.checked) ? field.offsetWidth * 0.6 : field.offsetWidth * 0.4,
        y: (radioHorizontal.checked) ? field.offsetHeight * 0.4 : field.offsetHeight * 0.6,
        radius: parameters['ball'],
        speed: parameters['ball-speed'],
        dx: 0,
        dy: 0
    };

    // проверка касания объектов
    function collides(ball, rectangle) {
        // return (ball.radius >= Math.sqrt(Math.pow((rectangle.x + rectangle.width / 2 - ball.x), 2) + Math.pow((rectangle.y + rectangle.height / 2 - ball.y), 2)));
        return ball.x < rectangle.x + rectangle.width &&
            ball.x + ball.radius > rectangle.x &&
            ball.y < rectangle.y + rectangle.height &&
            ball.y + ball.radius > rectangle.y;
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
        if (ball.x - ball.radius < wallSize) {
            ball.x = wallSize + ball.radius;
            ball.dx *= -1;
        }
        if (ball.y - ball.radius < wallSize) {
            ball.y = wallSize + ball.radius;
            ball.dy *= -1;
        }
        if (ball.y + ball.radius > field.offsetHeight - wallSize) {
            if (radioHorizontal.checked) {
                ball.y = field.offsetHeight - wallSize - ball.radius;
                ball.dy *= -1
            } else if (radioVertical.checked) {
                ball.x = field.offsetWidth * 0.4;
                ball.y = field.offsetHeight * 0.6;
                ball.dx = 0;
                ball.dy = 0;
            }
        }
        if (ball.x + ball.radius > field.offsetWidth - wallSize) {
            if (radioVertical.checked) {
                ball.x = field.offsetWidth - wallSize - ball.radius;
                ball.dx *= -1
            } else if (radioHorizontal.checked) {
                ball.x = field.offsetWidth * 0.6;
                ball.y = field.offsetHeight * 0.4;
                ball.dx = 0;
                ball.dy = 0;
            }
        }

        // проверка касания платформы
        if (collides(ball, paddle)) {
            if (radioHorizontal.checked) {
                ball.x = paddle.x - ball.radius;
                ball.dx *= -1;
            } else if (radioVertical.checked) {
                ball.y = paddle.y - ball.radius;
                ball.dy *= -1;
            }
        }

        // проверка касания кирпича
        for (let i = 0; i < bricks.length; i++) {
            let brick = bricks[i];
            if (collides(ball, brick)) {
                bricks.splice(i, 1);
                if (ball.y + ball.radius - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
                    ball.dy *= -1;
                } else {
                    ball.dx *= -1;
                }
                score++;
                document.getElementById('score').innerHTML = score;
                scoreCheck();
                break;
            }
        }

        // настройка фона канваса
        context.beginPath();
        context.fillStyle = environmentColors['field'];
        context.roundRect(0, 0, field.offsetWidth, field.offsetHeight, [30]);
        context.fill();
        context.closePath();

        // отрисовка шарика,  если он в движении
        if (ball.dx || ball.dy) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, 360);
            context.fillStyle = environmentColors['ball']; // цвет мяча
            context.fill();
            context.closePath();
        }

        // отрисовка кирпичей
        bricks.forEach(function(brick) {
            context.beginPath();
            context.fillStyle = brick.color;
            context.roundRect(brick.x, brick.y, brick.width, brick.height, [3]);
            context.fill();
            context.closePath();
        });

        // отрисовка платформы
        context.beginPath();
        context.fillStyle = environmentColors['paddle'];
        context.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, [5]);
        context.fill();
        context.closePath();
    }
    // функция запуска мяча
    function threwBall(counter) {
        counter++;
        if (ball.dx === 0 && ball.dy === 0) {
            if (counter == 1) {
                timer();
                field.style.cursor = 'none';
            }
            let rand = 0;
            while(true){
                rand = Math.random();
                if(rand > 0.4 && rand < 0.75){
                    break;
                }
            }
            console.log(rand)
            if (radioHorizontal.checked) {
                ball.x = field.offsetWidth * 0.6;
                ball.y = field.offsetHeight * 0.4;
                ball.dx = ball.speed;
                ball.dy = ball.speed * rand;
            } else if (radioVertical.checked) {
                ball.x = field.offsetWidth * 0.4;
                ball.y = field.offsetHeight * 0.6;
                ball.dx = ball.speed * rand;
                ball.dy = ball.speed;
            }
        }
        return counter;
    }
    let сlickCounter = 0,
        touchPosition,
        pointerPosition;

    function scoreCheck(){
        if (score == maxScore){
            let heading = document.getElementById('modal-heading'),
                info = document.getElementById('match-information');

            pageYOffset = window.pageYOffset;
            modal.classList.add('is-open');
            isModalOpen = true;

            if (sessionStorage.mode == 'infinity') {
                info.innerHTML = `Total score: ${score}<br><br>Time: ${document.getElementById('time').innerHTML}`;
                restartButton.click();
            } else if(sessionStorage.mode == 'story'){
                heading.innerHTML = `Level completed!`;
                info.innerHTML = `Total score: ${score}<br><br>Time: ${document.getElementById('time').innerHTML}`;
            }
        }
    }
    
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
                paddle.dx = -1 * parameters['paddle-speed'];
            } else if (e.which === 68 || e.which === 39) {
                paddle.dx = parameters['paddle-speed'];
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
        document.getElementById('save').parentNode.append(saveAlert);
        setTimeout(function() {
            if (document.getElementById('save').parentNode.lastChild != document.getElementById('save')) {
                document.getElementById('save').parentNode.lastChild.remove();
            }
        }, 2000)
    }
    document.addEventListener('keyup', function(e) {
        if (e.which === 13) {
            windowSetting();
            document.getElementById('save').parentNode.append(saveAlert);
            setTimeout(function() {
                if (document.getElementById('save').parentNode.lastChild != document.getElementById('save')) {
                    document.getElementById('save').parentNode.lastChild.remove();
                }
            }, 2000)
        }
    });

    requestAnimationFrame(loop);
}