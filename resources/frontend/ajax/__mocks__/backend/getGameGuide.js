import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let responseData;

function gameGuide() {
	return responseData;
}

function getGameGuide({ success, error, lang, isErrorHandled }) {
	getResponseData({ success, error, lang, isErrorHandled });
};

function getResponseData({ lang, success, error, isErrorHandled }) {
    if (responseData.data.result) {
		responseData.data.data.content = responseData.data.data.gameGuideList.map((item) => {
			let finalData = {};

			for (let key in item) {
				finalData[key] = item[key];
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

function setGameGuideData(result, data) {
	responseData.data.result = result;
	responseData.data.data = data;
}

function getGameGuideData() {
	return responseData;
}

function resetGameGuideData() {
    responseData = {
		data: {
			result: true,
			data: {
				config: {
					liveDealerGameLink: "http://info.sbobet.com/article/AA-00363/41/#"
				},
				gameGuideList: [],
				isError: false,
				isLoading: false
			},
		},
	};
}

resetGameGuideData();

module.exports = { 
    getGameGuide, 
    setGameGuideData, 
    resetGameGuideData, 
    getGameGuideData, 
    gameGuide 
};
