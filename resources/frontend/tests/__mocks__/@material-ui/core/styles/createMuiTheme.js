let mockedModule = jest.createMockFromModule('@material-ui/core/styles/createMuiTheme');

mockedModule.default = () => 'THEME';

module.exports = mockedModule;
