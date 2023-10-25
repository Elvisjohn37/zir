import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../ReportCommonFormatter'));

mockedModules.Description = ({ ...props }) => {
	let { newProps } = transformProps(props);

	return <div {...newProps} data-testid="Description"></div>;
};

mockedModules.CreditLimit = ({ row, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="CreditLimit">
			{row.creditLimit}
		</div>
	);
};

mockedModules.PlayerTotalBalance = ({ row, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="PlayerTotalBalance">
			{row.playerTotalBalance}
		</div>
	);
};

mockedModules.PlayableBalance = ({ row, ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="PlayableBalance">
			{row.playableBalance}
		</div>
	);
};

module.exports = mockedModules;
