import { getRandomColorPairs } from './colorHelper.js';
import { GAME_STATE, PAIRS_COUNT } from './constants.js';
import { getColorItemList, getColorListElement } from './selectors.js';

// Global variables
let selections = [];
let gameState = GAME_STATE.PLAYING;

// TODOs
// 1. Generate colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColorList() {
	const colorList = getRandomColorPairs(PAIRS_COUNT);

	const liList = getColorItemList();

	liList.forEach((liElement, index) => {
		const overlayElement = liElement.querySelector('.overlay');
		if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
	});
}

function handleColorItemClick(liElement) {
	if (!liElement) return;

	liElement.classList.add('active');
}

function attachColorListClick() {
	const colorListElement = getColorListElement();
	if (!colorListElement) return;

	colorListElement.addEventListener('click', (e) => {
		handleColorItemClick(e.target);
	});
}

(() => {
	initColorList();
	attachColorListClick();
})();
