let mockedModule = jest.createMockFromModule('@material-ui/core/styles');

mockedModule.MuiThemeProvider = jest.fn();

module.exports = mockedModule;
