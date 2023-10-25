import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let responseData;

function playerTransferList() {
	return responseData;
}

function getPlayerTransferList({ success, error, page }) {
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

function setPlayerTransferListData(result, data) {
	responseData.data.result = result;
	responseData.data.data = data;
}

function getPlayerTransferListData() {
	return responseData;
}

function resetPlayerTransferListData() {
    responseData = {
		data: {
			result: true,
			data: {
				content: [
					{	"rowNo": "1",
						"amount": "1000.000000",
						"amountFormat": "defaultAmount",
						"dateTime": "2021-07-15 14:32:23.753000",
						"descriptionFormat": "depositApproved",
						"outstandingBalanceFormat": "noOutstandingBalance",
						"playableBalance": "1000.000000"

					},
					{	"rowNo": "2",
						"amount": "1000.000000",
						"amountFormat": "defaultAmount",
						"dateTime": "2021-07-15 14:32:23.753000",
						"descriptionFormat": "depositApproved",
						"outstandingBalanceFormat": "noOutstandingBalance",
						"playableBalance": "1000.000000"

					},
					{	"rowNo": "3",
						"amount": "1000.000000",
						"amountFormat": "defaultAmount",
						"dateTime": "2021-07-15 14:32:23.753000",
						"descriptionFormat": "depositApproved",
						"outstandingBalanceFormat": "noOutstandingBalance",
						"playableBalance": "1000.000000"

					},
					{	"rowNo": "4",
						"amount": "1000.000000",
						"amountFormat": "defaultAmount",
						"dateTime": "2021-07-15 14:32:23.753000",
						"descriptionFormat": "depositApproved",
						"outstandingBalanceFormat": "noOutstandingBalance",
						"playableBalance": "1000.000000"

					},
					{	"rowNo": "5",
						"amount": "1000.000000",
						"amountFormat": "defaultAmount",
						"dateTime": "2021-07-15 14:32:23.753000",
						"descriptionFormat": "depositApproved",
						"outstandingBalanceFormat": "noOutstandingBalance",
						"playableBalance": "1000.000000"

					},
					{	"rowNo": "6",
						"amount": "1000.000000",
						"amountFormat": "defaultAmount",
						"dateTime": "2021-07-15 14:32:23.753000",
						"descriptionFormat": "depositApproved",
						"outstandingBalanceFormat": "noOutstandingBalance",
						"playableBalance": "1000.000000"

					}
				],
				totalRow: 6,
				rowsPerPage: 20,
			},
		},
	};
}

resetPlayerTransferListData();

module.exports = { 
    getPlayerTransferList, 
    setPlayerTransferListData, 
    resetPlayerTransferListData, 
    getPlayerTransferListData, 
    playerTransferList 
};
