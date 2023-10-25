let mockedModule = jest.createMockFromModule('../helper');

let getIsEmptyResult;
mockedModule.isEmpty = (value) => {
	if (getIsEmptyResult == 'dynamic') {
		// undefined and null
		if (typeof value == 'undefined' || value == null) {
			return true;
		}

		// string
		if (typeof value == 'string') {
			return value == '';
		}
		// array
		if (Array.isArray(value)) {
			return value.length <= 0;
		}

		// object
		if (typeof value === 'object') {
			for (var prop in value) {
				if (Object.prototype.hasOwnProperty.call(value, prop)) {
					return false;
				}
			}
			return true;
		}

		return false;
	} else {
		return getIsEmptyResult;
	}
};
mockedModule.setIsEmpty = (data) => {
	getIsEmptyResult = data;
};
mockedModule.resetIsEmpty = () => {
	getIsEmptyResult = 'dynamic';
};
mockedModule.resetIsEmpty();

let getCookieReturn;
mockedModule.getCookie = () => {
	return getCookieReturn;
};
mockedModule.setGetCookie = (value) => {
	getCookieReturn = value;
};
mockedModule.resetGetCookie = () => {
	getCookieReturn = 'sampleGetCookieValue';
};
mockedModule.resetGetCookie();

mockedModule.toDateTimeString = (date) => date;

mockedModule.reportDateMinMax = (dateRange) => dateRange;

mockedModule.getDateTime = (date) => date;

//____________________________________________

let arrayUniqueObj;
mockedModule.getArrayUniqueObj = (arr) => {
	if (arrayUniqueObj == 'dynamic') {
		let objFirstKeys = [];
		let uniqueValues = new Set();
		arr.forEach((item, index) => {
			if (!objFirstKeys.includes(JSON.stringify(item))) {
				objFirstKeys[index] = JSON.stringify(item);
				uniqueValues.add(item);
			}
		});
		return Array.from(uniqueValues);
	} else {
		return arrayUniqueObj;
	}
};

mockedModule.setArrayUniqueObj = (arr) => arr;

mockedModule.resetArrayUniqueObj = () => {
	arrayUniqueObj = 'dynamic';
};

mockedModule.resetArrayUniqueObj();

//____________________________________________

let camelcase;

mockedModule.setCamelcase = (str) => str;

mockedModule.toCamelcase = (str) => {
	if (camelcase == 'dynamic') {
		let splitString = str.split(' ');
		return splitString
			.map((item, index) => {
				if (index > 0) return item.charAt(0).toUpperCase() + item.slice(1);
				return item.charAt(0).toLowerCase() + item.slice(1);
			})
			.join('');
	} else {
		return camelcase;
	}
};

mockedModule.resetCamelcase = () => {
	camelcase = 'dynamic';
};
mockedModule.resetCamelcase();

//____________________________________________

let isMobile = false;

mockedModule.isMobileDevice = () => isMobile;

mockedModule.setMobileDevice = (device) => {
	isMobile = device;
};

mockedModule.resetMobileDevice = () => {
	isMobile = false;
};

mockedModule.resetMobileDevice();

//____________________________________________

let windowResponseData;

mockedModule.windowResponse = () => windowResponseData;

mockedModule.setWindowResponse = (response) => {
	windowResponseData = response;
};

mockedModule.resetWindowResponse = () => {
	windowResponseData = { result: true };
};

mockedModule.resetWindowResponse();

//____________________________________________

mockedModule.eventDelay = (callback) => {
	callback();
};

//____________________________________________

mockedModule.defaultScrollTopVisibility = () => {
	return 200;
};

//____________________________________________

export function scrollToTop(element) {
	return 'scroll element';
}

module.exports = mockedModule;
