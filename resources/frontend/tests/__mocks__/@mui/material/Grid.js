import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/material/Grid');
import { isEmpty } from 'frontend/utils/helper';

mockedModules.default = ({ children, ...props }) => {
	if (!isEmpty(props.spacing)) {
		props = { ...props, spacing: isNaN(props.spacing) ? '0' : props.spacing };
	}
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="Grid">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
