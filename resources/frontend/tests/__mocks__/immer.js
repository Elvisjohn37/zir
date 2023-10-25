let mockedModule = jest.createMockFromModule('immer');

// mock function
mockedModule.default = reducerFn => {
	return reducerFn;
};

module.exports = mockedModule;
