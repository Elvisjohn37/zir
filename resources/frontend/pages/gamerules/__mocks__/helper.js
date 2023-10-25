let mockedModule = jest.createMockFromModule('../helper');

mockedModule.extractProductGameType = (gameRulesList) => {
	let extractedItems = [];
	let indexMap = {};
	let nextIndex = 0;

	gameRulesList.forEach((item) => {
		if (item.productName in indexMap) {
			if (!extractedItems[indexMap[item.productName]].gameTypes.includes(item.gameTypeName)) {
				extractedItems[indexMap[item.productName]].gameTypes.push(item.gameTypeName);
			}
		} else {
			indexMap[item.productName] = nextIndex;
			nextIndex++;

			extractedItems.push({
				productName: item.productName,
				gameTypes: [item.gameTypeName],
			});
		}
	});

	return extractedItems;
};

module.exports = mockedModule;
