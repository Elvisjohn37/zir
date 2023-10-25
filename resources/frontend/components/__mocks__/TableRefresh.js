import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../TableRefresh'));

mockedModules.DesktopTableRefresh = ({ ...props }) => {
	if (props.values) {
		props = { ...props, values: props.values.toString() };
	}
	let { newProps } = transformProps(props);

	return <div {...newProps} data-testid="DesktopTableRefresh"></div>;
};

mockedModules.MobileTableRefresh = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return <div {...newProps} data-testid="MobileTableRefresh" onClick={() => props.onClick()}></div>;
};

module.exports = mockedModules;
