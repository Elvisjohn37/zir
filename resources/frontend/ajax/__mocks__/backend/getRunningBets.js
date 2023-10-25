import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let runningBetsData;
let isBlockSuccess = false;

function getRunningBets({ page, success, error }) {
	if (runningBetsData.data.result) {
		runningBetsData.data.data.content = runningBetsData.data.data.content.map((item) => {
			let finalData = {};

			for (let key in item) {
				finalData[key] = item[key] + page;
			}

			return finalData;
		});
		if (isFunction(success)) {
			!isBlockSuccess && success(runningBetsData);
		}
		return runningBetsData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setRunningBetsData(result, data) {
	runningBetsData.data.result = result;
	runningBetsData.data.data = data;
}

function blockSuccess() {
	isBlockSuccess = true;
}

function getRunningBetsData() {
	return runningBetsData;
}

function resetRunningBetsData() {
	isBlockSuccess = false;
	runningBetsData = {
		data: {
			result: true,
			data: {
				content: [
					{
						event: 'R',
						betLinkFormat: 'noBetLink',
						reasonFormat: 'noReason',
						gameID: '00640',
						roundIDFormat: 'roundDetID',
						roundDetID: 1,
						tableNameFormat: 'gameName',
						gameName: 'Everything about Net (Mobile)',
						stake: '100.000000',
						turnover: '100.000000',
						dateTime: '2021-08-27 08:00:00.000000',
					},
					{
						event: 'R',
						betLinkFormat: 'noBetLink',
						reasonFormat: 'noReason',
						gameID: '01640',
						roundIDFormat: 'roundDetID',
						roundDetID: 2,
						tableNameFormat: 'gameName',
						gameName: 'Everything about Net (Desktop)',
						stake: '101.000000',
						turnover: '102.000000',
						dateTime: '2021-08-27 09:01:00.000000',
					},
					{
						event: 'R',
						betLinkFormat: 'noBetLink',
						reasonFormat: 'noReason',
						gameID: '01641',
						roundIDFormat: 'roundDetID',
						roundDetID: 2,
						tableNameFormat: 'gameName',
						gameName: 'Everything about Net (Desktop)',
						stake: '121.000000',
						turnover: '112.000000',
						dateTime: '2021-08-27 10:01:00.000000',
					},
				],
				totalRunningBets: '100.000000',
				totalRow: 1,
				rowsPerPage: 20,
			},
		},
	};
}
resetRunningBetsData();

module.exports = { getRunningBets, setRunningBetsData, resetRunningBetsData, getRunningBetsData, blockSuccess };
