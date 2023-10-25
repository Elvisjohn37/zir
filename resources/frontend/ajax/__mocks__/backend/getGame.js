import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let gameData;

function getGameData() {
	return gameData;
}

function getGame({ success, error }) {
	if (gameData.data.result) {
		isFunction(success) && success(gameData);
		return gameData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setGetGame(result, data) {
	gameData.data.result = result;
	gameData.data.data = data;
}

function resetGetGame() {
	gameData = {
		data: {
			result: true,
			data: {
				topLimit: '20',
				recentLimit: '20',
				recentGames: 'DVbr;e9;9g;2n;Dn;WE;bPeP;oOd5',
				list: [
					{
						gameID: 'ojzX1',
						gameName: 'Virtual Roulette',
						isPreviewEnabled: 0,
						timestampReleased: '2022-07-12 09:00:00.000000',
						gameProviderID: 3,
						gameTypeName: 'Table Games',
						gameTypeID: 3,
						isNew: 1,
						isAvailable: 1,
					},
					{
						gameID: 'WE',
						gameName: 'Everything about Net',
						isPreviewEnabled: 1,
						timestampReleased: '2021-05-11 11:36:27.996955',
						gameProviderID: 1,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: 'b6MoY',
						gameName: 'Virtual Baccarat',
						isPreviewEnabled: 0,
						timestampReleased: '2022-07-19 09:00:00.000000',
						gameProviderID: 3,
						gameTypeName: 'Card Games',
						gameTypeID: 2,
						isNew: 1,
						isAvailable: 1,
					},
					{
						gameID: 'K3QL',
						gameName: 'Fireworks Frenzy',
						isPreviewEnabled: 1,
						timestampReleased: '2021-09-07 15:12:47.774434',
						gameProviderID: 2,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: 'bPeP',
						gameName: 'White Wizard',
						isPreviewEnabled: 0,
						timestampReleased: '2021-09-07 15:12:47.774434',
						gameProviderID: 2,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: 'dmJ6N',
						gameName: 'Virtual SicBo',
						isPreviewEnabled: 0,
						timestampReleased: '2022-07-19 09:00:00.000000',
						gameProviderID: 3,
						gameTypeName: 'Table Games',
						gameTypeID: 3,
						isNew: 1,
						isAvailable: 1,
					},
					{
						gameID: '3M',
						gameName: 'Great Bear Bounty',
						isPreviewEnabled: 1,
						timestampReleased: '2021-05-11 11:36:27.996955',
						gameProviderID: 1,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: 'oOd5',
						gameName: 'Gets the Worm',
						isPreviewEnabled: 0,
						timestampReleased: '2021-09-07 15:12:47.774434',
						gameProviderID: 2,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: '1o1Z2',
						gameName: 'Baccarat Babes',
						isPreviewEnabled: 0,
						timestampReleased: '2022-07-26 09:00:00.000000',
						gameProviderID: 3,
						gameTypeName: 'Card Games',
						gameTypeID: 2,
						isNew: 1,
						isAvailable: 1,
					},
					{
						gameID: 'Pk9a',
						gameName: 'Enchanted Prince',
						isPreviewEnabled: 0,
						timestampReleased: '2021-09-07 15:12:47.774434',
						gameProviderID: 2,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: 'e9',
						gameName: 'God of Fortune',
						isPreviewEnabled: 1,
						timestampReleased: '2021-05-11 11:36:27.996955',
						gameProviderID: 1,
						gameTypeName: 'Super Slot',
						gameTypeID: 1,
						isNew: 0,
						isAvailable: 1,
					},
					{
						gameID: 'kpD2Q',
						gameName: 'Fish Prawn Crab',
						isPreviewEnabled: 0,
						timestampReleased: '2022-07-26 09:00:00.000000',
						gameProviderID: 3,
						gameTypeName: 'Table Games',
						gameTypeID: 3,
						isNew: 1,
						isAvailable: 1,
					},
				],
				gameTypeNames: ['Super Slot', 'Table Games', 'Card Games'],
			},
		},
	};
}
resetGetGame();

module.exports = { getGame, setGetGame, resetGetGame, getGameData };
