import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let statementReportData;

function getStatementReport(rangeNo, showConfig, success, error) {
	if (statementReportData.data.result) {
		isFunction(success) && success(statementReportData);
		return statementReportData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setStatementReportData(result, data) {
	statementReportData.data.result = result;
	statementReportData.data.data = data;
}

function getStatementReportData() {
	return statementReportData;
}

function resetStatementReportData() {
	statementReportData = {
		data: {
			result: true,
			data: {
				content: [
					{
						rowNo: 1,
						type: 'Betting',
						date: '2021-08-26',
						productFormat: 'defaultProductName',
						productID: 'zy',
						productName: 'Games',
						turnover: '101.200000',
						grossRake: '0.000000',
						commission: '0.006000',
						cashBalance: '-100.500000',
						credit: '0.000000',
					},
					{
						rowNo: 2,
						type: 'Transfer',
						date: '2021-08-26',
						productFormat: 'defaultProductName',
						productID: '8q',
						productName: '',
						turnover: '0.000000',
						grossRake: '0.000000',
						commission: '0.000000',
						cashBalance: '0.000000',
						credit: '0.000000',
					},
				],
				footer: { grossRake: 0, turnover: 101.2, commission: 0.006, cashBalance: -100.5, credit: 0 },
				dateRange: [
					{ number: 3, startDate: '2021-07-01', endDate: '2021-07-31' },
					{ number: 2, startDate: '2021-08-01', endDate: '2021-08-31' },
					{ number: 1, startDate: '2021-09-01', endDate: '2021-09-01' },
				],
			},
		},
	};
}
resetStatementReportData();

module.exports = { getStatementReport, setStatementReportData, resetStatementReportData, getStatementReportData };
