export function getCookie(name) {
	let value = '; ' + document.cookie;
	let parts = value.split('; ' + name + '=');
	if (parts.length >= 2) return parts.pop().split(';').shift();
}

export function putCookie(name, value, days) {
	let expires = '';

	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}

	document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

export function getGreatestCommonDinominator(number1, number2) {
	if (number2 == 0) {
		return number1;
	} else {
		return getGreatestCommonDinominator(number2, number1 % number2);
	}
}

export function lowestRatio(number1, number2) {
	let gcd = getGreatestCommonDinominator(number1, number2);
	return { num1: number1 / gcd, num2: number2 / gcd };
}

export function createTransparentImage(width, height) {
	let lowestRatioNumber = lowestRatio(width, height);
	let canvas = document.createElement('canvas');
	canvas.width = lowestRatioNumber.num1;
	canvas.height = lowestRatioNumber.num2;
	return canvas.toDataURL('image/jpeg');
}

export function isObject(value) {
	return typeof value === 'object' && value !== null;
}
export function isString(value) {
	return typeof value === 'string';
}

export function isEmpty(value) {
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
}

export function getDateTime(param = null, isMilitaryTime, callback) {
	let date = new Date();
	if (param) date = new Date(param);
	callback && callback(date);
	let monthDayYear =
		('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
	let time = null;
	if (isMilitaryTime) {
		time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
	} else if (date.getHours() >= 12) {
		if (date.getHours() == 12) {
			time = '12:' + ('0' + date.getMinutes()).slice(-2) + ' PM';
		}
		time = ('0' + (date.getHours() - 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' PM';
	} else {
		time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' AM';
		if (date.getHours() == 0) {
			time = '12:' + ('0' + date.getMinutes()).slice(-2) + ' AM';
		}
	}
	return monthDayYear + ' ' + time;
}

export function greenwichMeanTime() {
	let date = new Date('2020-01-01T12:00');
	let arrayDateString = date.toUTCString().split(' ');
	return arrayDateString[arrayDateString.length - 1];
}

export function randomNumber(digits) {
	return Math.floor(Math.random() * Math.pow(10, digits) + Math.pow(10, digits))
		.toString()
		.slice(-digits);
}

export function secondToMs(second) {
	return parseFloat(second) * 1000;
}

export function loadImage(src, success, error) {
	var imgPreload = new Image();
	var callbackCalled = false;

	imgPreload.addEventListener('load', function () {
		if (!callbackCalled) {
			success(src, imgPreload);
		}
	});

	imgPreload.addEventListener('error', function () {
		error(src, imgPreload);
	});

	imgPreload.src = src;
	if (imgPreload.complete || imgPreload.readyState === 4) {
		callbackCalled = true;
		success(src, imgPreload);
	}
}

export function toCamelcase(str) {
	let splitString = str.split(' ');
	return splitString
		.map((item, index) => {
			if (index > 0) return item.charAt(0).toUpperCase() + item.slice(1);
			return item.charAt(0).toLowerCase() + item.slice(1);
		})
		.join('');
}

export function isMobileDevice() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return true;
	return false;
}

export function getArrayUniqueObj(arr) {
	let objFirstKeys = [];
	let uniqueValues = new Set();
	arr.forEach((item, index) => {
		if (!objFirstKeys.includes(JSON.stringify(item))) {
			objFirstKeys[index] = JSON.stringify(item);
			uniqueValues.add(item);
		}
	});
	return Array.from(uniqueValues);
}

export function isPopup() {
	return window.parent != window;
}

export function getMaxNumber(numbers) {
	return Math.max(...numbers);
}

export function isValidMin(dateTime, mins) {
	let dateStart = new Date(dateTime);
	let dateNow = new Date();

	let diffInMS = dateNow - dateStart;
	let toMin = Math.floor(diffInMS / 1000 / 60);
	return toMin < mins;
}

export function noSpaceLowerCase(string) {
	return string.replaceAll(' ', '').toLowerCase();
}

export function toDateTimeString(date) {
	return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export function reportDateMinMax(dateRange) {
	return {
		maxDate: dateRange.find((item) => item.number === 1).endDate,
		minDate: dateRange.find((item) => item.number === 3).startDate,
	};
}

export function windowResponse() {
	return window.response;
}

let eventDelaytimers = {};
export function eventDelay(callback, id, latencyMs) {
	id = id || 'default';
	latencyMs = latencyMs || 300;

	if (eventDelaytimers[id]) {
		clearTimeout(eventDelaytimers[id]);
	}

	eventDelaytimers[id] = setTimeout(callback, latencyMs);
}

export function scrollToTop(element) {
	return element.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

export function defaultScrollTopVisibility() {
	return 200;
}

export function gameFileName(gameName) {
	return gameName
		.replaceAll('(Mobile)', '')
		.replaceAll(/\s/g, '')
		.replaceAll(/[^a-zA-Z0-9]/g, '')
		.toLowerCase();
}
