import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/InputBase');

mockedModules.default = ({ children, inputRef, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<>
			<input {...newProps} ref={inputRef} data-testid="InputBase" />
			{children}
			{childProps.map(() => childProps)}
		</>
	);
};

module.exports = mockedModules;
