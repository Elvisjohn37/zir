import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let arcFinLedReportData;

function getArcFinLedReport({ data, success, error }) {
	if (arcFinLedReportData.data.result) {
		arcFinLedReportData.data.data.content = arcFinLedReportData.data.data.content.map((item) => {
			let finalData = {};

			for (let key in item) {
				finalData[key] = item[key] + data.page + data.date;
			}

			return finalData;
		});
		isFunction(success) && success(arcFinLedReportData);
		return arcFinLedReportData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setArcFinLedReport(result, data) {
	arcFinLedReportData.data.result = result;
	arcFinLedReportData.data.data = data;
}

function getArcFinLedReportData() {
	return arcFinLedReportData;
}

function resetArcFinLedReport() {
	arcFinLedReportData = {
		data: {
			result: true,
			data: {
				content: [
					{
						AccountBalance: 1007.0,
						AccountBalancePrior: '2000.000000',
						Balance: null,
						ClientId: 1021750,
						ClientUserName: 'testtwusdaaba017',
						Credit: 7,
						Debit: 0,
						Detail: '',
						Event: 'SESSION',
						EventId: 1021750,
						EventTime: '2020-11-27 07:13:28.983000',
						Game: 'Everything about Net',
						ver: '1',
					},
					{
						AccountBalance: 1087.0,
						AccountBalancePrior: '2010.000000',
						Balance: null,
						ClientId: 1021750,
						ClientUserName: 'testtwusdaaba017',
						Credit: 0,
						Debit: 1,
						Detail: '',
						Event: 'SESSION',
						EventId: 10217501,
						EventTime: '2020-11-27 07:11:28.983000',
						Game: 'Dangdut Queen',
						ver: '1',
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
resetArcFinLedReport();

module.exports = { getArcFinLedReport, setArcFinLedReport, resetArcFinLedReport, getArcFinLedReportData };
