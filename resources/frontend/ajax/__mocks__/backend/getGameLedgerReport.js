import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let responseData;

function arcGamLedReportData() {
	return responseData;
}

function getGameLedgerReport({ data, success, error }) {
	if (responseData.data.result) {
		responseData.data.data.content = responseData.data.data.content.map((item) => {
			let finalData = {};

			for (let key in item) {
				finalData[key] = item[key] + data.page;
			}

			return finalData;
		});
		isFunction(success) && success(responseData);
		return responseData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setArcGamLedReport(result, data) {
	responseData.data.result = result;
	responseData.data.data = data;
}

function getGameLedgerReportData() {
	return responseData;
}

function resetArcGamLedReport() {
	responseData = {
		data: {
			result: true,
			data: {
				content: [
					{
						accountbalance: "9999.500000",
						balance: "9999.500000",
						credit: null,
						debit: "0.180000",
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 0     ",
						event: "LOST",
						eventTime: "2020-11-13 02:14:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkX5a64hlzROZPnhCk%2B9Q9VAyVzWO88Q8dWtcRUPsN0OXxeMNe0995fOA%3D%3D"
					},
					{
						accountbalance: "10000.020000",
						balance: "10000.020000",
						credit: "0.020000",
						debit: null,
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 2     Line3=0.1 Line4=0.1",
						event: "WIN",
						eventTime: "2020-11-13 02:15:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkU5q64hlzROZNLmW0hbTtg3rNdieTxoL5MtE0SMZuJ6gPKJpA0mSKlLA%3D%3D"
					},
					{
						accountbalance: "10000.020000",
						balance: "10000.020000",
						credit: "0.020000",
						debit: null,
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 2     Line3=0.1 Line4=0.1",
						event: "WIN",
						eventTime: "2020-11-13 02:16:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkU5q64hlzROZNLmW0hbTtg3rNdieTxoL5MtE0SMZuJ6gPKJpA0mSKlLA%3D%3D"
					},
					{
						accountbalance: "10000.020000",
						balance: "10000.020000",
						credit: "0.020000",
						debit: null,
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 2     Line3=0.1 Line4=0.1",
						event: "WIN",
						eventTime: "2020-11-13 02:17:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkU5q64hlzROZNLmW0hbTtg3rNdieTxoL5MtE0SMZuJ6gPKJpA0mSKlLA%3D%3D"
					},
					{
						accountbalance: "10000.020000",
						balance: "10000.020000",
						credit: "0.020000",
						debit: null,
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 2     Line3=0.1 Line4=0.1",
						event: "WIN",
						eventTime: "2020-11-13 02:18:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkU5q64hlzROZNLmW0hbTtg3rNdieTxoL5MtE0SMZuJ6gPKJpA0mSKlLA%3D%3D"
					},
					{
						accountbalance: "10000.020000",
						balance: "10000.020000",
						credit: "0.020000",
						debit: null,
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 2     Line3=0.1 Line4=0.1",
						event: "WIN",
						eventTime: "2020-11-13 02:19:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkU5q64hlzROZNLmW0hbTtg3rNdieTxoL5MtE0SMZuJ6gPKJpA0mSKlLA%3D%3D"
					},
					{
						accountbalance: "10000.020000",
						balance: "10000.020000",
						credit: "0.020000",
						debit: null,
						detail: " AmountBet: 0.18 NumBetLines: 9 WinLines: 2     Line3=0.1 Line4=0.1",
						event: "WIN",
						eventTime: "2020-11-13 02:20:09.983000",
						game: "Everything about Net",
						ver: "1",
						weblink: "https://cas-iom.sbotry.com/en/i/games/slots/report?payload=AHyDdVELfRkU5q64hlzROZNLmW0hbTtg3rNdieTxoL5MtE0SMZuJ6gPKJpA0mSKlLA%3D%3D"
					},
				],
				rowsPerPage: 20,
				totalRow: 1,
				dateRange: [
					{ number: 3, startDate: '2021-07-01', endDate: '2021-07-31' },
					{ number: 2, startDate: '2021-08-01', endDate: '2021-08-31' },
					{ number: 1, startDate: '2021-09-01', endDate: '2021-09-20' },
				],
			},
		},
	};
}
resetArcGamLedReport();

module.exports = { 
	getGameLedgerReport, 
	setArcGamLedReport, 
	resetArcGamLedReport, 
	getGameLedgerReportData,
	arcGamLedReportData
};
