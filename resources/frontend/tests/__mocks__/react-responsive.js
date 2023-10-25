let mockedModule = jest.createMockFromModule('react-responsive');
let isMatch;

// mock function
mockedModule.default = function MediaQuery({children}) {
    return children(isMatch);
};

// setter
mockedModule.setMediaQuery = (isMatchNewValue) => {
    isMatch = isMatchNewValue;
}

// module resetter
mockedModule.resetMediaQuery = (isMatchNewValue) => {
    isMatch = true;
}
mockedModule.resetMediaQuery();

module.exports = mockedModule;