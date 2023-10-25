import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('@mui/material/Tabs'), 'Tabs');

mockedModules.default = ({ children, onChange, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="Tabs" onClick={onChange}>
			{children}
		</div>
	);
};

module.exports = mockedModules;
