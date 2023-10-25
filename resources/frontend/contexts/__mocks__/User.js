import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../User'));

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="User">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

let userState;
mockedModules.userDispatch = () => {};

// main component
mockedModules.UserConsumer = ({ children }) => {
	return children({ userState, userDispatch: mockedModules.userDispatch });
};

// setter
mockedModules.setUserState = (state) => {
	Object.assign(userState, state);
};

// module resetter
mockedModules.resetUserState = () => {
	userState = {
		isLoading: true,
		isLogin: false,
		isError: false,
		user: {
			parent: 'testParent',
		},
	};
};
mockedModules.resetUserState();

// getter
mockedModules.getUserState = () => {
	return userState;
};

module.exports = mockedModules;
