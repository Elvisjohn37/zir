import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('smooth-scroll-into-view-if-needed');

mockedModule.scrollIntoView = React.forwardRef((ref, { children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} ref={ref} data-testid="scrollIntoView">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
});

module.exports = mockedModule;
