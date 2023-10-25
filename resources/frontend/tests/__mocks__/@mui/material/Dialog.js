import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('@mui/material/Dialog');

mockedModule.default = React.forwardRef(({ children, onClose, ...props }, ref) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} ref={ref} data-testid="Dialog" onClick={onClose}>
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
});

module.exports = mockedModule;
