import { getRandomColorPairs } from './colorHelper.js';
import { GAME_STATE, PAIRS_COUNT } from './constants.js';
import {
	getColorItemList,
	getColorListElement,
	getInactiveColorElementList,
	getPlayAgainButton,
	getTimerElement,
} from './selectors.js';

// Global variables
let selections = [];
let gameStatus = GAME_STATE.PLAYING;

// TODOs
// 1. Generate colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

// function showReplayButton() {
// 	const replayButton = getPlayAgainButton();
// 	if (replayButton) replayButton.style.display = 'block';
// }

function handleColorItemClick(liElement) {
	const isBlocked = [GAME_STATE.BLOCKING, GAME_STATE.FINISHED].includes(gameStatus);
	if (!liElement || isBlocked) return;

	liElement.classList.add('active');

	selections.push(liElement);
	if (selections.length < 2) return;

	const firstColor = selections[0].dataset.color;
	const secondColor = selections[1].dataset.color;

	if (firstColor === secondColor) {
		const isWin = getInactiveColorElementList().length === 0;

		if (isWin) {
			// showReplayButton();
			// getTimerElement().textContent = 'You win!';
			// gameStatus = GAME_STATE.FINISHED;
		}

		selections = [];
		return;
	}

	gameStatus = GAME_STATE.BLOCKING;
	setTimeout(() => {
		selections[0].classList.remove('active');
		selections[1].classList.remove('active');
		selections = [];

		gameStatus = GAME_STATE.PLAYING;
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
		handleColorItemClick(e.target);
	});
}

(() => {
	initColorList();
	attachEventForColorList();
})();
