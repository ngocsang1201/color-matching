import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js';
import {
	getColorItemList,
	getColorListElement,
	getInactiveColorElementList,
	getPlayAgainButton,
} from './selectors.js';
import {
	createTimer,
	getRandomColorPairs,
	hidePlayAgainButton,
	setTimerText,
	showPlayAgainButton,
} from './utils.js';

// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
	// seconds: GAME_TIME,
	seconds: 5,
	onChange: handleTimerChange,
	onFinish: handleTimerFinish,
});

function handleTimerChange(second) {
	setTimerText(`${second}s`);
}

function handleTimerFinish() {
	setTimerText('You are a loser!');
	showPlayAgainButton();
	gameStatus = GAME_STATUS.FINISHED;
}

// TODOs
// 1. Generate colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorItemClick(liElement) {
	const isBlocked = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
	const isClicked = liElement.classList.contains('active');
	if (!liElement || isBlocked || isClicked) return;

	liElement.classList.add('active');

	selections.push(liElement);
	if (selections.length < 2) return;

	const firstColor = selections[0].dataset.color;
	const secondColor = selections[1].dataset.color;

	if (firstColor === secondColor) {
		const isWin = getInactiveColorElementList().length === 0;

		if (isWin) {
			showPlayAgainButton();
			setTimerText('You win!');
			gameStatus = GAME_STATUS.FINISHED;
			timer.clear();
		}

		selections = [];
		return;
	}

	gameStatus = GAME_STATUS.BLOCKING;
	setTimeout(() => {
		selections[0].classList.remove('active');
		selections[1].classList.remove('active');
		selections = [];

		if (gameStatus !== GAME_STATUS.FINISHED) {
			gameStatus = GAME_STATUS.PLAYING;
		}
	}, 500);
}

function initColorList() {
	const colorList = getRandomColorPairs(PAIRS_COUNT);

	const liList = getColorItemList();

	liList.forEach((liElement, index) => {
		liElement.dataset.color = colorList[index];
		const overlayElement = liElement.querySelector('.overlay');
		if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
	});
}

function attachEventForColorList() {
	const colorListElement = getColorListElement();
	if (!colorListElement) return;

	colorListElement.addEventListener('click', (e) => {
		if (e.target.tagName !== 'LI') return;
		handleColorItemClick(e.target);
	});
}

function resetGame() {
	// Reset global variables
	selections = [];
	gameStatus = GAME_STATUS.PLAYING;

	// Reset DOM
	// - Remove active class from all li elements
	// - Hide play again button
	// - Reset timer text
	const colorElementList = getColorItemList();
	if (!colorElementList) return;

	for (const colorElement of colorElementList) {
		colorElement.classList.remove('active');
	}

	hidePlayAgainButton();
	setTimerText('');

	// re-render color list
	initColorList();

	// start new timer
	startTimer();
}

function startTimer() {
	timer.start();
}

function attachEventForPlayAgainButton() {
	const playAgainButton = getPlayAgainButton();
	if (!playAgainButton) return;
	playAgainButton.addEventListener('click', resetGame);
}

(() => {
	initColorList();
	attachEventForColorList();
	attachEventForPlayAgainButton();
	startTimer();
})();
