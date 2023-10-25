let mockedModule = jest.createMockFromModule('../gifDurations');

mockedModule.duration = 5000;

mockedModule.default = (urls) => {
	return [{ url: urls[0], duration: 5000 }];
};

module.exports = mockedModule;
