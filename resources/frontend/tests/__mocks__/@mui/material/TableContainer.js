import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/TableContainer');

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="TableContainer">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
