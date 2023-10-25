import React, { useImperativeHandle } from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('../SeamlessIframe');

mockedModule.default = React.forwardRef(({ children, ...props }, ref) => {
	let { newProps, childProps } = transformProps(props);

	useImperativeHandle(ref, () => ({
		resize: () => {},
	}));

	return (
		<iframe {...newProps} data-testid="SeamlessIframe">
			{children}
			{childProps.map(() => childProps)}
		</iframe>
	);
});

module.exports = mockedModule;
