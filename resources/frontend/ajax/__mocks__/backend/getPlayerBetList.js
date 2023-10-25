import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let playerBetListData;

function getPlayerBetList({ success, error, page }) {
	getResponseData({ success, error, page });
}

function getPlayerPromoList({ success, error, page }) {
	getResponseData({ success, error, page });
}

function getResponseData({ page, success, error }) {
	if (playerBetListData.data.result) {
		playerBetListData.data.data.content = playerBetListData.data.data.content.map((item) => {
			let finalData = {};

			for (let key in item) {
				finalData[key] = item[key] + (page - 1) * 20;
			}

			return finalData;
		});
		isFunction(success) && success(playerBetListData);
		return playerBetListData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setPlayerBetListData(result, data) {
	playerBetListData.data.result = result;
	playerBetListData.data.data = data;
}

function getPlayerBetListData() {
	return playerBetListData;
}

function resetPlayerBetListData() {
	playerBetListData = {
		data: {
			result: true,
			data: {
				content: [
					{
						rowNo: 1,
						betLinkFormat: 'hasBetLink',
						commission: '0.000000',
						dateTime: '2021-09-08 11:19:51.000000',
						event: 'W',
						gameID: '00014',
						gameName: 'Djap Go',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '10000.000000',
						reasonFormat: 'noReason',
						roundDetID: 2,
						roundIDFormat: 'roundDetID',
						stake: '4.000000',
						tableNameFormat: 'gameName',
						transactionDetID: 'zW9',
						turnover: '4.000000',
					},
					{
						rowNo: 2,
						betLinkFormat: 'hasBetLink',
						commission: '0.000000',
						dateTime: '2021-09-08 11:19:51.000000',
						event: 'L',
						gameID: '00014',
						gameName: 'Djap Go',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '10000.000000',
						reasonFormat: 'noReason',
						roundDetID: 2,
						roundIDFormat: 'roundDetID',
						stake: '4.000000',
						tableNameFormat: 'gameName',
						transactionDetID: 'zW9',
						turnover: '4.000000',
					},
					{
						rowNo: 3,
						betLinkFormat: 'hasBetLink',
						commission: '0.000000',
						dateTime: '2021-09-08 11:19:51.000000',
						event: 'L',
						gameID: '00014',
						gameName: 'Djap Go',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '10000.000000',
						reasonFormat: 'noReason',
						roundDetID: 2,
						roundIDFormat: 'roundDetID',
						stake: '4.000000',
						tableNameFormat: 'gameName',
						transactionDetID: 'zW9',
						turnover: '4.000000',
					},
				],
				totalRow: 3,
				rowsPerPage: 20,
			},
		},
	};
}

resetPlayerBetListData();

module.exports = {
	getPlayerPromoList,
	getPlayerBetList,
	setPlayerBetListData,
	resetPlayerBetListData,
	getPlayerBetListData,
	playerBetListData,
};
