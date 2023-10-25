import React from 'react';
import { FormattedMessage } from 'react-intl';
import MoneyFormat from 'frontend/components/MoneyFormat';

export function Description({ agentUsername }) {
	return (
		<FormattedMessage
			id="creditLimitViaAgent"
			values={{
				agentUsername: agentUsername,
			}}
		/>
	);
}

export function CreditLimit({ row }) {
	return (
		<div>
			<MoneyFormat value={row.creditLimit} />
		</div>
	);
}

export function PlayerTotalBalance({ row }) {
	return (
		<div>
			<MoneyFormat value={row.playerTotalBalance} />
		</div>
	);
}

export function PlayableBalance({ row }) {
	return (
		<div>
			<MoneyFormat value={row.playableBalance} />
		</div>
	);
}
