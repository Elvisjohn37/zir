import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../Language'));

mockedModules.LangDataProvider = ({ children, ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="LangDataProvider">
			<div>{props.category}</div>
			{children}
		</div>
	);
};

module.exports = mockedModules;
