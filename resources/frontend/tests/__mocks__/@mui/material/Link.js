import React from 'react';
import { transformProps, renderMock } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('@mui/material/Link');

mockedModule.default = React.forwardRef(({ children, component: Component, ...props }, ref) => {
	let { newProps, childProps } = transformProps(props);
	newProps['ref'] = ref;
	newProps['data-testid'] = 'Link';

	return renderMock(Component || 'a', newProps, children, childProps);
});

module.exports = mockedModule;
