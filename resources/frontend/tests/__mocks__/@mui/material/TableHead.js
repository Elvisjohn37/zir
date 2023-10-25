import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/TableHead');

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="TableHead">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
