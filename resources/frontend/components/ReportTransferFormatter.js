import React from 'react';
import { FormattedMessage } from 'react-intl';
import MoneyFormat from 'frontend/components/MoneyFormat';

export function Description({ row, agentUsername }) {
	switch (row.descriptionFormat) {
		case 'transferAdjustment':
			return <FormattedMessage id={row.descriptionFormat} />;
		default:
			return (
				<FormattedMessage
					id={row.descriptionFormat}
					values={{
						agentUsername: agentUsername,
					}}
				/>
			);
	}
}

export function Amount({ row }) {
	switch (row.amountFormat) {
		case 'withdrawalAmount':
			return (
				<div>
					-<MoneyFormat value={row.amount} />
				</div>
			);
		case 'defaultAmount':
			return (
				<div>
					<MoneyFormat value={row.amount} />
				</div>
			);
	}
}

export function OutstandingBalance({ row }) {
	switch (row.outstandingBalanceFormat) {
		case 'noOutstandingBalance':
			return '';
		case 'defaultOutstandingBalance':
			return '';
	}
}

export function PlayableBalance({ row }) {
	return (
		<div>
			<MoneyFormat value={row.playableBalance} />
		</div>
	);
}
