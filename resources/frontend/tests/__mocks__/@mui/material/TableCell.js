import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/TableCell');

mockedModules.default = ({ children, colSpan, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} colSpan={colSpan} data-testid="TableCell">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
