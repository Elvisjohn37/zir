import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('../ErrorBoundary');

mockedModule.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="ErrorBoundary">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModule;
