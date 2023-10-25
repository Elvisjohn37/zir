let mockedModule = jest.createMockFromModule('lodash');

mockedModule.range = (number) => {
	return [...Array(number).keys()];
};

mockedModule.includes = (array, string) => {
	return array.indexOf(string) != -1;
};

mockedModule.lowerCase = (string) => {
	return string.toLowerCase();
};

mockedModule.camelCase = (str) => {
	let splitString = str.split(' ');
	return splitString
		.map((item, index) => {
			if (index > 0) return item.charAt(0).toUpperCase() + item.slice(1);
			return item.charAt(0).toLowerCase() + item.slice(1);
		})
		.join('');
};

mockedModule.kebabCase = (string) => {
	return string
		.toLowerCase()
		.replace(/[^a-zA-Z0-9 ]/g, '')
		.replaceAll(' ', '-');
};

module.exports = mockedModule;
