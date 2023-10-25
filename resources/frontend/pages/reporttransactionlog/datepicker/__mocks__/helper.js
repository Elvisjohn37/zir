let mockedModule = jest.createMockFromModule('../helper');

let isArrowDisabledData;
mockedModule.isArrowDisabled = (arrow, currentHours) => {
	return isArrowDisabledData;
};
mockedModule.setIsArrowDisabled = (result) => {
	isArrowDisabledData = result;
};
mockedModule.resetIsArrowDisabled = (result) => {
	isArrowDisabledData = false;
};
mockedModule.resetIsArrowDisabled();

mockedModule.navigateTime = jest.fn();

module.exports = mockedModule;
