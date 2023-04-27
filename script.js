import { executeGame } from './modules/game.js';

let saveAlert = document.createElement('div');
saveAlert.className = 'attention-box save-alert-box';
saveAlert.innerHTML = '<div class="save-alert-icon"></div><p class="small-text">Updated<p>';

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
            window.location.href = './public/mode.html';
        }
        appearanceButton.onclick = function() {
            window.location.href = './public/appearance.html';
        }
        settingsButton.onclick = function() {
            window.location.href = './public/settings.html';
        }
        detailsButton.onclick = function() {
            window.location.href = './public/details.html';
        }
        profileButton.onclick = function() {
            window.location.href = './public/profile.html';
        }
    } else if (location.pathname.includes('mode')) { // страница выбора режима
        let infinityButton = document.getElementById('infinity-button'),
            storyButton = document.getElementById('story-button');

        infinityButton.onclick = function() {
            sessionStorage.setItem('mode', 'infinity');
            window.location.href = './infinity-game.html';
        }
        storyButton.onclick = function() {
            sessionStorage.setItem('mode', 'story');
            window.location.href = './levels-map.html';
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
            saveAppearanceButton.parentNode.append(saveAlert);
            setTimeout(function() {
                saveAppearanceButton.parentNode.lastChild.remove();
            }, 2000)
            location.reload();
        }

        document.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                localStorage.setItem('ballColor', ballColorInput.value);
                localStorage.setItem('paddleColor', paddleColorInput.value);
                localStorage.setItem('bricksColor', bricksColorInput.value);
                localStorage.setItem('fieldColor', fieldColorInput.value);
                saveAppearanceButton.parentNode.append(saveAlert);
                setTimeout(function() {
                    saveAppearanceButton.parentNode.lastChild.remove();
                }, 2000)
                location.reload();
            }
        });
    } else if (location.pathname.includes('profile')) {
        let saveSettingsButton = document.getElementById('save-settings'),
            playerName = document.getElementById('player-name'),
            forgetMeButton = document.getElementById('forget-me');

        (localStorage.userName && localStorage.userName != undefined) ? playerName.value = localStorage.userName: playerName.value = '';

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
            saveSettingsButton.parentNode.append(saveAlert);
            setTimeout(function() {
                saveSettingsButton.parentNode.lastChild.remove();
            }, 2000)
        }

        document.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                localStorage.setItem('userName', playerName.value);
                saveSettingsButton.parentNode.append(saveAlert);
                setTimeout(function() {
                    saveSettingsButton.parentNode.lastChild.remove();
                }, 2000)
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
            saveSettingsButton.parentNode.append(saveAlert);
            setTimeout(function() {
                saveSettingsButton.parentNode.lastChild.remove();
            }, 2000)
        }

        document.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                localStorage.setItem('paddleSpeed', paddleSpeed.value);
                localStorage.setItem('ballSpeed', ballSpeed.value);
                localStorage.setItem('paddleSize', paddleSize.value);
                localStorage.setItem('ballRadius', ballRadius.value);
                saveSettingsButton.parentNode.append(saveAlert);
                setTimeout(function() {
                    saveSettingsButton.parentNode.lastChild.remove();
                }, 2000)
            }
        });
    } else if (location.pathname.includes('game')) { // страница игры
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // для телефонов
            if (document.body.clientWidth < 740) {
                radioHorizontal.disabled = true;
                radioVertical.checked = true;
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth * 1.9;
            }
            // для планшетов
            // выбор горизонтального по умолчанию
            if (!radioHorizontal.checked && !radioVertical.checked && !radioHorizontal.disabled) {
                radioHorizontal.checked = true;
            }
            // задание размеров
            if (radioVertical.checked && !radioHorizontal.disabled) {
                canvasWidth = gameContainer.offsetWidth * .7;
                canvasHeight = canvasWidth * 1.8;
            } else if (radioHorizontal.checked && !radioHorizontal.disabled) {
                canvasWidth = gameContainer.offsetWidth - 20;
                canvasHeight = canvasWidth / 1.3;
            }
            // выбор тачскрина по умолчанию для всех мобильных устройств
            document.getElementById('touchscreen').checked = true;
        } else { // для пк
            // выбор горизонтального по умолчанию
            if (!radioHorizontal.checked && !radioVertical.checked) {
                radioHorizontal.checked = true;
            }
            // задание рзмеров
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
            checkSessionStorageValueConst(bricksNumberColumn, resBricksNumberColumn, 12, 'bricksNumberColumn');
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

            sessionStorage.setItem('bricksNumberRow', bricksNumberRow.value);
            sessionStorage.setItem('bricksNumberColumn', bricksNumberColumn.value);
            sessionStorage.setItem('gapsSize', gapsSize.value);
            sessionStorage.setItem('paddleSpeed', paddleSpeed.value);
            sessionStorage.setItem('ballSpeed', ballSpeed.value);
            sessionStorage.setItem('paddleSize', paddleSize.value);
            sessionStorage.setItem('ballRadius', ballRadius.value);
            sessionStorage.setItem('ballColor', ballColor.value);
            sessionStorage.setItem('paddleColor', paddleColor.value);
            sessionStorage.setItem('bricksColor', bricksColor.value);
            sessionStorage.setItem('fieldColor', fieldColor.value);

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

            function setRangeSessionValue(range, label, key) {
                range.style.backgroundSize = (range.value - range.min) * 100 / (range.max - range.min) + '% 100%';
                range.addEventListener('input', function() {
                    sessionStorage.setItem(key, range.value);
                    label.innerHTML = range.value;
                    range.style.backgroundSize = (range.value - range.min) * 100 / (range.max - range.min) + '% 100%';
                })
            }
            executeGame();
        } else if(location.pathname.includes('game-level')){
            executeGame();
        }
    } else if(location.pathname.includes('levels-map')){
        let levels = document.getElementsByClassName('level-box');

        for (const level of levels){
            level.onclick = function(){
                sessionStorage.setItem('level', level.value)
                window.location.href = ('game-level.html');
            }
        };
    } 

}
window.addEventListener('resize', function(event) {
    windowSetting();
});
window.onload = function() {
    console.log(localStorage);
    console.log(sessionStorage);

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
        bottomAppearedElements = document.querySelectorAll('.bottom-appearance-animation'),
        lightBottomAppearedElements = document.querySelectorAll('.light-bottom-appearance-animation'),
        lightTopAppearedElements = document.querySelectorAll('.light-top-appearance-animation');

    for (let element of impulseAppearedElements) { observer.observe(element); }
    for (let element of topAppearedElements) { observer.observe(element); }
    for (let element of bottomAppearedElements) { observer.observe(element); }
    for (let element of lightBottomAppearedElements) { observer.observe(element); }
    for (let element of lightTopAppearedElements) { observer.observe(element); }

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
    
    windowSetting();
}