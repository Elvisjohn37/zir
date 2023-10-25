import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../DateRange'));

mockedModules.DesktopDateRange = ({ children, ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<>
			{props.dateRange.isLoading ? (
				<div {...newProps} data-testid="DesktopDateRange">
					Skeleton Loader
				</div>
			) : (
				<div {...newProps} data-testid="DesktopDateRange">
					<span>activeDate: {props.activeDate}</span>
					<span>row: {JSON.stringify(props.row)}</span>
				</div>
			)}
		</>
	);
};

mockedModules.MobileDateRange = ({ children, ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<>
			{props.dateRange.isLoading ? (
				<div {...newProps} data-testid="MobileDateRange">
					Skeleton Loader
				</div>
			) : (
				<div {...newProps} data-testid="MobileDateRange">
					<span>activeDate: {props.activeDate}</span>
					<span>row: {JSON.stringify(props.row)}</span>
				</div>
			)}
		</>
	);
};

module.exports = mockedModules;
