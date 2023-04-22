

function executeGame(){
    let field = document.getElementById('game'),
        context = field.getContext('2d'),
        choice = document.getElementById('choice'),
        radio_keyboard = document.querySelector('#keyboard'),
        radio_mouse = document.querySelector('#mouse'),
        radio_touchscreen = document.querySelector('#touchscreen'),
        restartButton = document.getElementById('restart');

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
        'R': '#5955B3',
        'O': '#5955B3',
        'G': '#5955B3',
        'Y': '#5955B3'
    };

    // параметры 
    let score = 0,
        wallSize = 10,
        brickGap = 5,
        brickHeight = (field.offsetHeight - 2 * wallSize - brickGap * (level1[1].length - 1)) / level1[1].length,
        brickWidth = brickHeight / 2,
        paddleWidth = (field.offsetHeight - 2 * wallSize) / 5,
        paddleHeight = paddleWidth * 0.1,
        bricks = [],
        sec = 0,
        min = 0,
        hrs = 0,
        t;

    function tick(){
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
    const paddle = {
        x: field.offsetWidth * 0.9,
        y: field.offsetHeight / 2 - paddleWidth / 2,
        width: paddleHeight,
        height: paddleWidth,
        dx: 0, // направление по x
        dy: 0 // направление по y
    };
    
    const ball = {
        x: field.offsetWidth * 0.6,
        y: field.offsetHeight * 0.4,
        width: 11,
        height: 11,
        speed: 5,
        dx: 0,
        dy: 0
    };

    // проверка на касание объектов
    function collides(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y;
    }

    // главный цикл игры
    function loop() {
        //очистка поля и новая отрисовка
        requestAnimationFrame(loop);
        context.clearRect(0, 0, field.offsetWidth, field.offsetHeight); 

        paddle.y += paddle.dy; // движение платформы с заданной скоростью

        // контроль за нахождением в границах поля
        if (paddle.y < wallSize) {
            paddle.y = wallSize
        } else if (paddle.y > field.offsetHeight - wallSize - paddle.height) {
            paddle.y = field.offsetHeight - wallSize - paddle.height;
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
        } else if (ball.y + ball.height > field.offsetHeight - wallSize) {
            ball.y = field.offsetHeight - wallSize - ball.height;
            ball.dy *= -1;
        }
        if (ball.x + ball.width > field.offsetWidth - wallSize) {
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
            let brick = bricks[i];
            if (collides(ball, brick)) {
                bricks.splice(i, 1);
                score++;
                document.getElementById('score').innerHTML = score;
                if (ball.y + ball.height - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
                    ball.dy *= -1;
                } else if (ball.x + ball.width - ball.speed <= brick.x || ball.x >= brick.x + brick.width - ball.speed) {
                    ball.dx *= -1;
                }
                break;
            }
        }
        // отрисовка стен
        context.fillStyle = '#FEFEFE'; 
        context.fillRect(0, 0, field.offsetWidth, wallSize);
        context.fillRect(0, 0, wallSize, field.offsetHeight);
        context.fillRect(field.offsetWidth - wallSize, 0, wallSize, field.offsetHeight);
        context.fillRect(0, field.offsetHeight - wallSize, field.offsetWidth, wallSize);

        // отрисовка шарика,  если он в движении
        if (ball.dx || ball.dy) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.height, 0, 360);
            context.fillStyle = '#DA2E2E'; // цвет мяча
            context.fill();
        }

        // отрисовка кирпичей
        bricks.forEach(function(brick) {
            context.fillStyle = brick.color;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        // отрисовка кирпичей
        context.fillStyle = '#282828'; 
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
            ball.dx = ball.speed;
            ball.dy = ball.speed;
        }
    })
      
    // ведение по тачскрину
    field.addEventListener('touchmove', e => {
        touchPosition = { 
            x: e.changedTouches[0].clientX - field.getBoundingClientRect().left, 
            y: e.changedTouches[0].clientY - field.getBoundingClientRect().top 
        };
        if (radio_touchscreen.checked) {
            paddle.y = touchPosition.y - paddleWidth / 2;
        }
    })
      
    // нажатие клавиши
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

    // отжатие клавиши
    document.addEventListener('keyup', function(e) {
        if (radio_keyboard.checked && (e.which === 87 || e.which === 83 || e.which === 38 || e.which === 40)) {
            paddle.dy = 0;
        }
    });

    // клик по полю для запуска мяча
    field.addEventListener('click', function(e) {
        mouseClickCounter++;

        if (radio_mouse.checked && ball.dx === 0 && ball.dy === 0) {
            if(mouseClickCounter == 1){
                timer();
            }
            ball.x = field.offsetWidth * 0.6;
            ball.y = field.offsetHeight * 0.4;
            ball.dx = ball.speed;
            ball.dy = ball.speed;
            field.style.cursor = 'none';
        }
    });

    // отслеживание движения курсора
    document.addEventListener('mousemove', e => {
        pointerPosition = { 
            x: e.pageX- field.getBoundingClientRect().left, 
            y: e.pageY - field.getBoundingClientRect().top 
        };
        if (radio_mouse.checked) {
            paddle.y = pointerPosition.y - paddleWidth / 2;
        }
    });

    // Перезапуск
    restartButton.addEventListener('click', function(e) {
        clearTimeout(t);
        document.getElementById('time').innerHTML = "00:00";
        executeGame();
    });

    requestAnimationFrame(loop);

    choice.addEventListener("change", () => {
        switch(choice.id){
            case keyboard:
                radio_mouse.checked = false;
                radio_touchscreen.checked = false;
                break;
            case mouse:
                radio_keyboard.checked = false;
                radio_touchscreen.checked = false;
                break;
            case radio_touchscreen:
                radio_mouse.checked = false;
                radio_keyboard.checked = false;
            break;
        }
    });
} 
function windowSetting(){
    if (location.pathname.includes('index') || location.pathname == '/') {
        let playButton = document.getElementById('box-3'),
            designButton = document.getElementById('box-2'),
            settingsButton = document.getElementById('box-4');
            
        if(document.body.clientWidth < 920 && document.body.clientWidth > 678){
            designButton.style.order = '1';
            playButton.style.order = '3';
            settingsButton.style.order = '2';
        } else if(document.body.clientWidth < 678){
            designButton.style.order = '2';
            playButton.style.order = '1';
            settingsButton.style.order = '3';
        } else {
            designButton.style.order = '1';
            playButton.style.order = '2';
            settingsButton.style.order = '3';
        }
    } else if (location.pathname.includes('game')) {
        let gameContainer = document.getElementById('game-container'),
            canvasContainer = document.getElementById('canvas-container'),
            canvasWidth = gameContainer.offsetWidth - 20,
            canvasHeight = canvasWidth / 1.61;
        
        canvasContainer.innerHTML = `<canvas id='game' width='${canvasWidth}' height='${canvasHeight}'></canvas>`;
        executeGame();
    }
}
window.addEventListener('resize', function(event){
    windowSetting();
 });

window.onload = function(){
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

    if (location.pathname.includes('index') || location.pathname == '/') {
        let playButton = document.getElementById('box-3');

        playButton.onclick = function() {
            window.location.href = './game.html';
        }

    } else if (location.pathname.includes('game')) {
        executeGame();
    }
}