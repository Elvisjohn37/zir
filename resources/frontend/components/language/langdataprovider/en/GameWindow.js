import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	maxPayoutPerBet: 'Max Payout Per Bet: ',
	returningToLobby: 'Returning to lobby',
	zeroBalance: 'Your Classic Games Balance is 0. Please Topup by Contacting Your Representative',
	ok: 'OK',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
