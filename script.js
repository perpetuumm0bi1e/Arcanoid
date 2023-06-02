import { windowSetting } from "./modules/window-settings.js";

let saveAlert = document.createElement("div");
saveAlert.className = "attention-box save-alert-box";
saveAlert.innerHTML = '<div class="save-alert-icon"></div><p class="small-text">Updated<p>';

window.addEventListener("resize", function (event) {
	windowSetting();
});
window.onload = function () {
	console.log(localStorage);
	console.log(sessionStorage);

	setValueToLocalIfNotExists("paddleSize", "120");
	setValueToLocalIfNotExists("paddleSpeed", "10");
	setValueToLocalIfNotExists("ballSpeed", "7");
	setValueToLocalIfNotExists("ballRadius", "10");
	setValueToLocalIfNotExists("fieldColor", "#FEFEFE");
	setValueToLocalIfNotExists("bricksColor", "#5955B3");
	setValueToLocalIfNotExists("paddleColor", "#282828");
	setValueToLocalIfNotExists("ballColor", "#DA2E2E");

	function setValueToLocalIfNotExists(key, value) {
		if (!localStorage[key]) {
			localStorage.setItem(key, value);
		}
	}

	function onEntry(element) {
		element.forEach((change) => {
			if (change.isIntersecting) {
				change.target.classList.add("appeared");
			}
		});
	}

	let options = { threshold: [0.5] };
	let observer = new IntersectionObserver(onEntry, options);

	let topAppearedElements = document.querySelectorAll(".top-appearance-animation"),
		impulseAppearedElements = document.querySelectorAll(".impulse-appearance-animation"),
		bottomAppearedElements = document.querySelectorAll(".bottom-appearance-animation"),
		lightBottomAppearedElements = document.querySelectorAll(".light-bottom-appearance-animation"),
		lightTopAppearedElements = document.querySelectorAll(".light-top-appearance-animation");

	for (let element of impulseAppearedElements) {
		observer.observe(element);
	}

	for (let element of topAppearedElements) {
		observer.observe(element);
	}

	for (let element of bottomAppearedElements) {
		observer.observe(element);
	}

	for (let element of lightBottomAppearedElements) {
		observer.observe(element);
	}

	for (let element of lightTopAppearedElements) {
		observer.observe(element);
	}

	if (location.pathname.includes("index") || location.pathname.split("").pop() == "/") {
		// главная страница
		let greetingBox = document.getElementById("greeting-box");
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

			let userNameInput = document.getElementById("player-name"),
				setUpUserName = document.getElementById("set-up-name");

			setUpUserName.onclick = function () {
				localStorage.setItem("userName", userNameInput.value);
				localStorage.setItem("userScore", 0);
				location.reload();
			};
			document.addEventListener("keyup", function (e) {
				if (e.which === 13) {
					localStorage.setItem("userName", userNameInput.value);
					localStorage.setItem("userScore", 0);
					location.reload();
				}
			});
		}
		// приветствия
		if (localStorage.userName && localStorage.userName != undefined) {
			var now = new Date(),
				greetings = "";

			if (now.getHours() >= 6 && now.getHours() < 12) {
				let intros = [
					`Morning, ${localStorage.userName}! What a good day, isn't it?`,
					`Sup, ${localStorage.userName}! Wanna start day with game?`,
					`Yo, ${localStorage.userName}! Wanna play bright and early?`,
					`Ahoy, ${localStorage.userName}! How pleasant to see ya this morning...`,
					`Hi there, ${localStorage.userName}! Top of the morning to you <3`,
				];

				greetings = intros[Math.floor(Math.random() * intros.length)];
			} else if (now.getHours() >= 12 && now.getHours() < 18) {
				let intros = [
					`Hey, ${localStorage.userName}! What a good day, isn't it?`,
					`Hi there, ${localStorage.userName}! Let's play?`,
					`Wats's up, ${localStorage.userName}! Wanna break some blocks?`,
					`Wassup, ${localStorage.userName}! Nice to see ya again :)`,
					`Oh, ${localStorage.userName}, there's stacks to do and there's stacks to see, 
                    there's stacks to touch and there's stacks to be, so many ways to spend your time, but you decided to do it with me... 
                    So pathetically, but i'm still just a blocks breaker...`,
				];

				greetings = intros[Math.floor(Math.random() * intros.length)];
			} else if (now.getHours() >= 18 && now.getHours() < 24) {
				let intros = [
					`Sup, ${localStorage.userName}! Decided to spend the evening crashing bricks?`,
					`Hi there, ${localStorage.userName}! Tnx for choosing to spend this evening with me...`,
					`Wats's up, ${localStorage.userName}! So what are you doing up in the middle of the night?`,
					`Evening, ${localStorage.userName}! Nice to see ya again :)`,
				];

				greetings = intros[Math.floor(Math.random() * intros.length)];
			} else if (now.getHours() < 6) {
				let intros = [
					`Yo, ${localStorage.userName}! Decided to dedicate the night to brickbreaker?`,
					`Hi there, ${localStorage.userName}! People usually sleep at night... Well okay...`,
					`Wats's up, ${localStorage.userName}! Wanna to brighten up your evening with a game?`,
					`Sup, ${localStorage.userName}! Why are you awake, may I ask?`,
				];

				greetings = intros[Math.floor(Math.random() * intros.length)];
			}

			greetingBox.classList.remove("box");
			greetingBox.innerHTML = `<p class="medium-text description-label"> ${greetings} </p>`;
		}
	}

	windowSetting();
};
