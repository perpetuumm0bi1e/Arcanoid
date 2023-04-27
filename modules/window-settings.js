import { executeGame } from './game.js';
import { levels } from './levels.js';

export function windowSetting() {
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
        } else if (location.pathname.includes('game-level')) {
            executeGame();
        }
    } else if (location.pathname.includes('levels-map')) {
        let i = 1;
        for (let key in levels) {
            let levelBox = document.createElement('button');
            levelBox.className = 'box level-box button-box-red';
            levelBox.value = i;
            levelBox.innerHTML = `<p class="gray-heading">Level<br />${i}</p>
            <p class="small-text level-name"><em>&laquo;${levels[key].name}&raquo;</em></p>`;
            document.getElementById('level-boxes-container').append(levelBox);
            i++;
        }
        let levelBoxes = document.getElementsByClassName('level-box');
        for (const level of levelBoxes) {
            level.onclick = function() {
                sessionStorage.setItem('level', level.value)
                window.location.href = ('game-level.html');
            }
        };
    }

}