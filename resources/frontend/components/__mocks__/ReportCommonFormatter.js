import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../ReportCommonFormatter'));

mockedModules.DateTime = ({ ...props }) => {
	return <div data-testid="DateTime"></div>;
};

mockedModules.DateRange = ({ row, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="DateRange">
			{row.startDate} - {row.endDate}
		</div>
	);
};

mockedModules.GrossRake = ({ row, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="GrossRake">
			<div>{JSON.stringify(row)}</div>
		</div>
	);
};

module.exports = mockedModules;
