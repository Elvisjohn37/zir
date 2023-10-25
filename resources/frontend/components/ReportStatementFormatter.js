import React from 'react';
import { FormattedMessage } from 'react-intl';
import MoneyFormat from 'frontend/components/MoneyFormat';
import { NavLink } from 'react-router-dom';

export function Product({ row }) {
	switch (row.productFormat) {
		case 'promotion':
			return (
				<div>
					<FormattedMessage
						id="promotion"
						values={{
							message: row.message,
						}}
					/>
				</div>
			);
		case 'defaultProductName':
			return <div>{row.productName}</div>;
	}
}

export function DateLink({ children, row }) {
	switch (row.type) {
		case 'Betting':
			return (
				<NavLink
					to={'/account/archived-report/statement/' + row.type.toLowerCase() + '/' + row.productID + '/' + row.date}
				>
					{children}
				</NavLink>
			);
		default:
			return (
				<NavLink to={'/account/archived-report/statement/' + row.type.toLowerCase() + '/' + row.date}>
					{children}
				</NavLink>
			);
	}
}

export function Turnover({ row }) {
	return (
		<div>
			<MoneyFormat value={row.turnover} />
		</div>
	);
}

export function Commission({ row }) {
	return (
		<div>
			<MoneyFormat value={row.commission} />
		</div>
	);
}

export function CashBalance({ row }) {
	return (
		<div>
			<MoneyFormat value={row.cashBalance} />
		</div>
	);
}

export function Credit({ row }) {
	return (
		<div>
			<MoneyFormat value={row.credit} />
		</div>
	);
}
