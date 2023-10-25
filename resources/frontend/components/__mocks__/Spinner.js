import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../Spinner'));

mockedModules.default = ({ ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="Spinner">
			<div>Loading Spinner</div>
		</div>
	);
};

module.exports = mockedModules;
