function shuffle(arr) {
	if (!Array.isArray(arr) || arr.length < 2) return arr;

	for (let i = arr.length - 1; i > 1; i--) {
		const j = Math.trunc(Math.random() * i);
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

export function getRandomColorPairs(count) {
	const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];
	const colorList = [];

	for (let i = 0; i < count; i++) {
		// randomColor function is provided by https://github.com/davidmerfield/randomColor
		const color = randomColor({
			luminosity: 'dark',
			hue: hueList[i % hueList.length],
		});

		colorList.push(color);
	}

	const fullColorList = [...colorList, ...colorList];
	shuffle(fullColorList);

	return fullColorList;
}
