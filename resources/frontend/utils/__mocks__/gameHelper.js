let mockedModule = jest.createMockFromModule('../gameHelper');

let gameParamsData;

mockedModule.gameParams = () => gameParamsData;

mockedModule.setGameParams = (newGameParamsData) => {
	gameParamsData = newGameParamsData;
};

mockedModule.resetGameParams = () => {
	gameParamsData = {
		gameType: null,
		page: null,
	};
};

mockedModule.resetGameParams();

mockedModule.resetWindowResponse = () => {
	gameParamsData = {};
};

mockedModule.resetWindowResponse();

//____________________________________________

mockedModule.gameFilter = (games, type) => {
	return games.list.filter((game) => {
		return type == 'top' || type == 'recent' || game.gameTypeName == type;
	});
};

//____________________________________________

mockedModule.gameTypeUrl = (page, type) => {
	return page + '/' + type;
};

module.exports = mockedModule;
