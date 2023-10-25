import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../ReportTransferFormatter'));

mockedModules.Description = ({ ...props }) => {
	let { newProps } = transformProps(props);

	switch (props.row.descriptionFormat) {
		case 'transferAdjustment':
			return (
				<div {...newProps} data-testid="Description">
					{props.row.descriptionFormat}
				</div>
			);
		default:
			return (
				<div {...newProps} data-testid="Description">
					<div>{props.row.descriptionFormat}</div>
					<div>{props.agentUsername}</div>
				</div>
			);
	}
};

mockedModules.Amount = ({ ...props }) => {
	let { newProps } = transformProps(props);
	switch (props.row.amountFormat) {
		case 'withdrawalAmount':
			return (
				<div {...newProps} data-testid="Amount">
					-{props.row.amount}
				</div>
			);
		case 'defaultAmount':
			return (
				<div {...newProps} data-testid="Amount">
					{props.row.amount}
				</div>
			);
		default:
			return (
				<div {...newProps} data-testid="Amount">
					No Amount Found
				</div>
			);
	}
};

mockedModules.OutstandingBalance = ({ ...props }) => {
	let { newProps } = transformProps(props);

	switch (props.row.outstandingBalanceFormat) {
		case 'noOutstandingBalance':
			return (
				<div {...newProps} data-testid="OutstandingBalance">
					noOutstandingBalance
				</div>
			);
		case 'defaultOutstandingBalance':
			return (
				<div {...newProps} data-testid="OutstandingBalance">
					defaultOutstandingBalance
				</div>
			);

		default:
			return (
				<div {...newProps} data-testid="OutstandingBalance">
					No Outstanding Balance Found
				</div>
			);
	}
};

mockedModules.PlayableBalance = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="PlayableBalance">
			{props.row.playableBalance}
		</div>
	);
};

module.exports = mockedModules;
