import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/Menu');

mockedModules.default = ({ children, anchorEl, open, onClose, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} onClick={onClose} data-testid="Menu" selected={open}>
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
