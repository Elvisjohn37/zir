import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../Layout'));

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="Layout">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

let layoutState;
mockedModules.layoutDispatch = jest.fn();

// main component
mockedModules.LayoutConsumer = ({ children }) => {
	return children({ layoutState, layoutDispatch: mockedModules.layoutDispatch });
};

// setter
mockedModules.setLayoutState = (state) => {
	Object.assign(layoutState, state);
};

// module resetter
mockedModules.resetLayoutState = () => {
	layoutState = {
		config: { isMobileSite: false },
		isLoading: true,
		isLogin: false,
		isError: false,
		user: {
			parent: 'testParent',
		},
	};
};
mockedModules.resetLayoutState();

// getter
mockedModules.getLayoutState = () => {
	return layoutState;
};

module.exports = mockedModules;
