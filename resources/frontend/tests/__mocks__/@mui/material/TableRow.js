import { componentModuleMock } from 'frontend/tests/helpers';
module.exports = componentModuleMock(jest.createMockFromModule('@mui/material/TableRow'), 'TableRow');

import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/TableRow');

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="TableRow">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
