import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../ReportTransactionLogFormatter'));

mockedModules.TypeProduct = ({ ...props }) => {
	let { newProps } = transformProps(props);

	switch (props.row.typeProductFormat) {
		case 'typeProductName':
			return (
				<div {...newProps} data-testid="TypeProduct">
					<div>{props.row.transactionType}</div>
					<div>{props.row.productName}</div>
				</div>
			);
		case 'defaultTypeProduct':
			return (
				<div {...newProps} data-testid="TypeProduct">
					{props.row.transactionType}
				</div>
			);
	}
};

mockedModules.Amount = ({ ...props }) => {
	let { newProps } = transformProps(props);

	switch (props.row.amountFormat) {
		case 'noAmount':
			return (
				<div {...newProps} data-testid="Amount">
					--
				</div>
			);
		case 'defaultAmount':
			return (
				<div {...newProps} data-testid="Amount">
					{props.row.amount}
				</div>
			);
	}
};

mockedModules.CashBalanceGame = ({ ...props }) => {
	let { newProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="CashBalanceGame">
			<div>{props.row.cashBalance}</div>
			<div>{props.row.availableCredit}</div>
			<div>{props.row.playableBalance}</div>
		</div>
	);
};

module.exports = mockedModules;
