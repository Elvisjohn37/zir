import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModule = jest.createMockFromModule('react-indiana-drag-scroll');

mockedModule.ScrollContainer = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="ScrollContainer">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

export default mockedModule.ScrollContainer;
