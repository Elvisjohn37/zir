import { componentModuleMock } from 'frontend/tests/helpers';
let mockedModule = componentModuleMock(jest.createMockFromModule('react-router-dom'), '', {
	elementToUse: { NavLink: 'a', Link: 'a' },
});
let location;

mockedModule.setUseLocation = (value) => {
	Object.assign(location, value);
};

// module resetter
mockedModule.resetUseLocation = () => {
	location = { pathname: 'www.zirconloc.com/path', hash: '', search: '', state: '' };
};
mockedModule.resetUseLocation();

mockedModule.useLocation = () => {
	return location;
};

mockedModule.Redirect = jest.fn();

mockedModule.Route = jest.fn();

mockedModule.Switch = jest.fn();

//______________________________________

let param;

mockedModule.setUseParams = (newParam) => {
	return (param = newParam);
};

mockedModule.useParams = () => {
	return param;
};

mockedModule.resetUseParams = () => {
	param = {};
};

mockedModule.resetUseParams();

//______________________________________

let useHistoryData;

mockedModule.useHistory = () => {
	return useHistoryData;
};

mockedModule.setUseHistory = (newHistory) => {
	useHistoryData = newHistory;
};

mockedModule.resetUseHistory = () => {
	useHistoryData = {
		push: () => {},
	};
};

mockedModule.resetUseHistory();

//______________________________________

module.exports = mockedModule;
