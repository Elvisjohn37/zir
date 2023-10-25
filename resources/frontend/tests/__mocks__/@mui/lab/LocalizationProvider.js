import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/lab/LocalizationProvider');

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="LocalizationProvider">
			{children}
			{childProps.map((item, index) => (
				<div key={index}></div>
			))}
		</div>
	);
};

module.exports = mockedModules;
