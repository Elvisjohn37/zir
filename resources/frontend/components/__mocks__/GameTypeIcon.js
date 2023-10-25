import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../GameTypeIcon'));

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="GameTypeIcon" className={props.indexKey == props.activeIndex ? 'active' : ''}>
			<img src={props.icon} />
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

module.exports = mockedModules;
