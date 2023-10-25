let mockedModule = jest.createMockFromModule('gif-me-duration');

// mock function
mockedModule.default = gifArr =>  [{ duration: 1000, gif: gifArr[0] }];

module.exports = mockedModule.default;