import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let balanceData;

function getBalance(success, error) {
	if (balanceData.data.result) {
		isFunction(success) && success(balanceData);
		return balanceData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setGetBalance(result, data) {
	balanceData.data.result = result;
	balanceData.data.data = data;
}

function resetGetBalance() {
	balanceData = {
		data: {
			result: true,
			data: { availableBalance: 10000, currency: 'USD' }
		}
	};
}
resetGetBalance();

module.exports = { getBalance, setGetBalance, resetGetBalance };
