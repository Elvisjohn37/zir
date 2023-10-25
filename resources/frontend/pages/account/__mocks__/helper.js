let mockedModule = jest.createMockFromModule('../helper.js');

mockedModule.openAccountWindow = jest.fn();

module.exports = mockedModule;
