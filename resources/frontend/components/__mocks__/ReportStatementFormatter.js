import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../ReportStatementFormatter'));

mockedModules.Product = ({ row, ...props }) => {
	let { newProps } = transformProps(props);

	switch (row.productFormat) {
		case 'promotion':
			return (
				<div {...newProps} data-testid="Product">
					Product Name: Promotion
				</div>
			);
		case 'defaultProductName':
			return (
				<div {...newProps} data-testid="Product">
					Product Name: Default
				</div>
			);
	}
};

export function DateLink({ children, row, ...props }) {
	let { newProps } = transformProps(props);
	switch (row.type) {
		case 'Betting':
			return (
				<div {...newProps} data-testid="DateLink">
					betting URL
				</div>
			);
		default:
			return (
				<div {...newProps} data-testid="DateLink">
					Default URL
				</div>
			);
	}
}

export function Turnover({ row, ...props }) {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="Turnover">
			{props.row.turnover}
		</div>
	);
}

export function Commission({ row, ...props }) {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="Commission">
			{props.row.commission}
		</div>
	);
}

export function CashBalance({ row, ...props }) {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="CashBalance">
			{props.row.cashBalance}
		</div>
	);
}

export function Credit({ row, ...props }) {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="Credit">
			{props.row.credit}
		</div>
	);
}

module.exports = mockedModules;
