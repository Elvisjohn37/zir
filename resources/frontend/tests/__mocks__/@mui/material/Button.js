import React from 'react';
import { transformProps, renderMock } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('@mui/material/Button');

mockedModule.default = React.forwardRef(({ children, component: Component, ...props }, ref) => {
	let { newProps, childProps } = transformProps(props);
	newProps['ref'] = ref;
	newProps['data-testid'] = 'Button';

	return renderMock(Component || 'button', newProps, children, childProps);
});

module.exports = mockedModule;
