import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('@mui/material/InputAdornment'), 'InputAdornment');

mockedModules.default = ({ children, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="InputAdornment">
			{children}
		</div>
	);
};

module.exports = mockedModules;
