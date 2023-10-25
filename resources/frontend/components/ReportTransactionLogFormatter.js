import React from 'react';
import MoneyFormat from 'frontend/components/MoneyFormat';

export function TypeProduct({ row }) {
	switch (row.typeProductFormat) {
		case 'typeProductName':
			return (
				<>
					<div>{row.transactionType}</div>
					<div>{row.productName}</div>
				</>
			);
		case 'defaultTypeProduct':
			return <div>{row.transactionType}</div>;
	}
}

export function Amount({ row }) {
	switch (row.amountFormat) {
		case 'noAmount':
			return '--';
		case 'defaultAmount':
			return (
				<div>
					<MoneyFormat value={row.amount} />
				</div>
			);
	}
}

export function CashBalanceGame({ row }) {
	return (
		<>
			<div>
				<MoneyFormat value={row.cashBalance} />
			</div>
			<div>
				<MoneyFormat value={row.availableCredit} />
			</div>
			<div>
				<MoneyFormat value={row.playableBalance} />
			</div>
		</>
	);
}
