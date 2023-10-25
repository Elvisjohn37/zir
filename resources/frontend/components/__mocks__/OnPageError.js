import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../OnPageError'));

mockedModules.ErrorLight = ({ children, ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="ErrorLight">
			{props.buttons && props.buttons}
		</div>
	);
};

module.exports = mockedModules;
