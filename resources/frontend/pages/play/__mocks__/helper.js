let postMessageHandler = () => jest.fn();

let setPostMessageHandler = () => jest.fn();

let resetPostMessageHandler = () => jest.fn();

resetPostMessageHandler();

// _________________________________________

let windowResponseData,
	isMobile = false;

let windowResponse = () => windowResponseData;

let resetWindowResponse = () => {
	windowResponseData = {
		result: true,
		data: {
			url: 'https://eyecon.classicku.com/launch/lek?uid=ANqWb0TXAFr1%252BZT7aQmY%252F1M%253D&guid=124275588462ff2e5f3973e3.1098258&gameid=71656&brand=LEK&cur=ZWD&lang=en&homeURL=https%3A%2F%2Fgames.classicku.com%2Fclosegame%3FgameID%3DDVbr%26clientID%3DML641',
			title: 'Beat The Bobbies',
			maxPayout: '700000000.000000',
			isMobile: false,
			viewport: 'desktop',
			productID: 'zy',
			balanceInfo: { playableBalance: '1457.800000', currencyCode: 'ZWD' },
		},
	};
};

let setWindowResponse = (data) => {
	windowResponseData = {
		...windowResponseData,
		data: {
			...windowResponseData.data,
			...data,
		},
	};
};

let setErrorResponse = () => {
	windowResponseData = {
		...windowResponseData,
		result: false,
	};
};

resetWindowResponse();

// _________________________________________

module.exports = { postMessageHandler, windowResponse, setWindowResponse, resetWindowResponse, setErrorResponse };
