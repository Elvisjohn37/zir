import * as gameRulesHelper from 'frontend/tests/gameRulesHelper';
let mockedModule = jest.createMockFromModule('../GameRules.js');

mockedModule.gameRulesDispatch = () => {};

// main component
mockedModule.GameRulesConsumer = ({ children }) => {
	return children({
		gameRulesState: gameRulesHelper.getGameRulesState(),
		gameRulesDispatch: mockedModule.gameRulesDispatch,
	});
};
mockedModule = { ...mockedModule, ...gameRulesHelper };

module.exports = mockedModule;
