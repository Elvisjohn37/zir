import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/MenuItem');

mockedModules.default = ({ children, anchorEl, selected, onClick, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} onClick={onClick} data-testid="MenuItem" selected={selected}>
			{'selected: ' + selected.toString()}
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
