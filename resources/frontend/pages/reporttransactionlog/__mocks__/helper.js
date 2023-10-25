let mockedModule = jest.createMockFromModule('../helper.js');

let statementData;
let getStatementResult;
let isProceedHook = true;
mockedModule.getStatementReport = (
	isMounted,
	setDateRange,
	statementRange,
	setStatementData,
	setStatementDataLoading,
	setStatementDataError
) => {
	if (!isProceedHook) {
		return {};
	}
	setStatementDataLoading(false);
	if (getStatementResult) {
		statementData.data.data.content = statementData.data.data.content.map((item) => {
			for (let key in item) {
				if (key == 'date') {
					switch (statementRange) {
						case 1:
							item[key] = '2021-09-01';
							break;
						case 2:
							item[key] = '2021-08-01';
							break;
						case 3:
							item[key] = '2021-07-01';
							break;
					}
				}
			}

			return item;
		});

		setStatementData({
			content: statementData.data.data.content,
			footer: statementData.data.data.footer,
		});

		if (!isMounted) {
			setDateRange({
				isLoading: false,
				range: statementData.data.data.dateRange,
			});
		} else {
			delete statementData.dateRange;
		}
	} else {
		setStatementDataError(true);
	}
};
mockedModule.setIsProceedHook = (isProceed) => {
	isProceedHook = isProceed;
};

mockedModule.setGetStatementReport = (result, data) => {
	getStatementResult = result;
	statementData.data.data = data;
	statementData.data.result = getStatementResult;
};
mockedModule.getStatementReportData = () => {
	return statementData;
};
mockedModule.resetGetStatementReport = () => {
	isProceedHook = true;
	getStatementResult = true;
	statementData = {
		data: {
			result: getStatementResult,
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
};
mockedModule.resetGetStatementReport();

module.exports = mockedModule;
