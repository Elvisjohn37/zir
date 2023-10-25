import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let transactionLogData;

function getTransactionLog({ date, page, showConfig, success, error }) {
	if (transactionLogData.data.result) {
		transactionLogData.data.data.content = transactionLogData.data.data.content.map((item) => {
			let finalData = {};

			for (let key in item) {
				if (key !== 'transactionType') {
					finalData[key] = item[key];
				} else {
					finalData[key] = item[key];
				}
			}

			return finalData;
		});
		isFunction(success) && success(transactionLogData);
		return transactionLogData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setTransactionLog(result, data) {
	transactionLogData.data.result = result;
	transactionLogData.data.data = data;
}

function getTransactionLogData() {
	return transactionLogData;
}

function resetTransactionLog() {
	transactionLogData = {
		data: {
			result: true,
			data: {
				content: [
					{
						rowNo: 1,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'typeProductName',
						productName: 'Games',
						transactionType: 'Betting',
						betLinkFormat: 'noBetLink',
						reasonFormat: 'noReason',
						gameID: '00655',
						roundIDFormat: 'roundDetID',
						roundDetID: 2,
						tableNameFormat: 'gameName',
						gameName: 'Dragon Tiger',
						event: 'V',
						amountFormat: 'noAmount',
						stake: '-100.000000',
						turnover: '-100.000000',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '-100.000000',
						commission: '0.000000',
						cashBalance: '30000.000000',
						availableCredit: '0.000000',
						playableBalance: '30000.000000',
					},
					{
						rowNo: 2,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'typeProductName',
						productName: 'Games',
						transactionType: 'Betting',
						betLinkFormat: 'hasBetLink',
						transactionDetID: 'n8',
						reasonFormat: 'noReason',
						gameID: '00655',
						roundIDFormat: 'roundDetID',
						roundDetID: 3,
						tableNameFormat: 'gameName',
						gameName: 'Dragon Tiger',
						event: 'L',
						amountFormat: 'noAmount',
						stake: '100.000000',
						turnover: '100.000000',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '-100.000000',
						commission: '0.000000',
						cashBalance: '29900.000000',
						availableCredit: '0.000000',
						playableBalance: '29900.000000',
					},
					{
						rowNo: 3,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'typeProductName',
						productName: 'Games',
						transactionType: 'Betting',
						betLinkFormat: 'hasBetLink',
						transactionDetID: 'zy',
						reasonFormat: 'noReason',
						gameID: '00640',
						roundIDFormat: 'roundDetID',
						roundDetID: 1,
						tableNameFormat: 'gameName',
						gameName: 'Everything about Net (Mobile)',
						event: 'W',
						amountFormat: 'noAmount',
						stake: '100.000000',
						turnover: '100.000000',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '100.000000',
						commission: '0.000000',
						cashBalance: '30100.000000',
						availableCredit: '0.000000',
						playableBalance: '30100.000000',
					},
					{
						rowNo: 4,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'typeProductName',
						productName: 'Games',
						transactionType: 'Betting',
						betLinkFormat: 'hasBetLink',
						transactionDetID: 'Xjn',
						reasonFormat: 'noReason',
						gameID: '00640',
						roundIDFormat: 'roundDetID',
						roundDetID: 1,
						tableNameFormat: 'gameName',
						gameName: 'Everything about Net (Mobile)',
						event: 'W',
						amountFormat: 'noAmount',
						stake: '0.600000',
						turnover: '0.600000',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '0.100000',
						commission: '0.003000',
						cashBalance: '1003.385000',
						availableCredit: '0.000000',
						playableBalance: '1003.385000',
					},
					{
						rowNo: 5,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'typeProductName',
						productName: 'Games',
						transactionType: 'Betting',
						betLinkFormat: 'hasBetLink',
						transactionDetID: '8Yx',
						reasonFormat: 'noReason',
						gameID: '00640',
						roundIDFormat: 'roundDetID',
						roundDetID: 1,
						tableNameFormat: 'gameName',
						gameName: 'Everything about Net (Mobile)',
						event: 'L',
						amountFormat: 'noAmount',
						stake: '0.600000',
						turnover: '0.600000',
						grossRake: '0.000000',
						memWLCommisionFormatter: 'withMemWLCommission',
						netwin: '-0.600000',
						commission: '0.003000',
						cashBalance: '1002.788000',
						availableCredit: '0.000000',
						playableBalance: '1002.788000',
					},
					{
						rowNo: 6,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'defaultTypeProduct',
						transactionType: 'Transfer',
						descriptionFormat: 'depositApproved',
						amountFormat: 'defaultAmount',
						amount: '100.000000',
						cashBalance: '200.000000',
						availableCredit: '200.000000',
						playableBalance: '200.000000',
					},
					{
						rowNo: 7,
						dateTime: '2021-08-27 08:00:00.000000',
						typeProductFormat: 'defaultTypeProduct',
						transactionType: 'Credit',
						descriptionFormat: 'depositApproved',
						amountFormat: 'defaultAmount',
						amount: '100.000000',
						cashBalance: '200.000000',
						availableCredit: '200.000000',
						playableBalance: '200.000000',
					},
				],
				totalRow: 7,
				rowsPerPage: 20,
				dateRange: [
					{ number: 3, startDate: '2021-07-01', endDate: '2021-07-31' },
					{ number: 2, startDate: '2021-08-01', endDate: '2021-08-31' },
					{ number: 1, startDate: '2021-09-01', endDate: '2021-09-20' },
				],
			},
		},
	};
}
resetTransactionLog();

module.exports = { getTransactionLog, setTransactionLog, resetTransactionLog, getTransactionLogData };
