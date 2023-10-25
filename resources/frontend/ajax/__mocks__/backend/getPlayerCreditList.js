import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let responseData;

function playerCreditList() {
	return responseData;
}

function getPlayerCreditList({ success, error, page }) {
	getResponseData({ success, error, page });
};

function getResponseData({ page, success, error }) {
    if (responseData.data.result) {
		responseData.data.data.content = responseData.data.data.content.map((item) => {
			let finalData = {};

			for (let key in item) {
				finalData[key] = item[key] + "" + page;
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

function setPlayerCreditListData(result, data) {
	responseData.data.result = result;
	responseData.data.data = data;
}

function getPlayerCreditListData() {
	return responseData;
}

function resetPlayerCreditListData() {
    responseData = {
		data: {
			result: true,
			data: {
				content: [
					{
						"dateTime": "2021-07-15 14:32:23.753000",
						"creditLimit": "1000.000000",
						"playerTotalBalance": "1000.000000",
						"playableBalance": "1000.000000"
					},
					{
						"dateTime": "2021-07-15 14:32:24.753000",
						"creditLimit": "1000.000000",
						"playerTotalBalance": "1000.000000",
						"playableBalance": "1000.000000"
					},
					{
						"dateTime": "2021-07-15 14:32:25.753000",
						"creditLimit": "1000.000000",
						"playerTotalBalance": "1000.000000",
						"playableBalance": "1000.000000"
					},
					{
						"dateTime": "2021-07-15 14:32:26.753000",
						"creditLimit": "1000.000000",
						"playerTotalBalance": "1000.000000",
						"playableBalance": "1000.000000"
					},
					{
						"dateTime": "2021-07-15 14:32:27.753000",
						"creditLimit": "1000.000000",
						"playerTotalBalance": "1000.000000",
						"playableBalance": "1000.000000"
					},
					{
						"dateTime": "2021-07-15 14:32:28.753000",
						"creditLimit": "1000.000000",
						"playerTotalBalance": "1000.000000",
						"playableBalance": "1000.000000"
					}
				],
				totalRow: 6,
				rowsPerPage: 20,
			},
		},
	};
}

resetPlayerCreditListData();

module.exports = { 
    getPlayerCreditList, 
    setPlayerCreditListData, 
    resetPlayerCreditListData, 
    getPlayerCreditListData, 
    playerCreditList
};
