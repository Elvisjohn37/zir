import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../Image'));

mockedModules.default = ({ ...props }) => {
	let scaleRatio = props.scaleRatio ? { width: props.scaleRatio.width, height: props.scaleRatio.height } : {};
	let { newProps } = transformProps(props);

	return (
		<>
			<img {...newProps} {...scaleRatio} data-testid="Image" />
			{props.placeholder && props.placeholder}
		</>
	);
};

module.exports = mockedModules;
