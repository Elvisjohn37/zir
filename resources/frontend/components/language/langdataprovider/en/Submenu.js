import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	statement: 'Statement',
	runningbet: 'Running Bet',
	transactionlog: 'Transaction Log',
	account: 'Account',
	balance: 'Balance',
	reports: 'Reports',
	transferfunds: 'Transfer Funds',
	limitadjust: 'Limit Adjust',
	selfexclusion: 'Self Exclusion',
	termsandcondition: 'Terms and Condition',
	credit: 'Credit',
	betting: 'Player Bet List',
	playerBetList: 'Player Bet List',
	transfer: 'Transfer',
	archivedReport: 'Archived Reports',
	financialLedger: 'Financial Ledger',
	gameLedger: 'Game Ledger',
	faq: 'faqs',
	banking: 'banking',
	privacyPolicy: 'Privacy Policy',
	responsibleGambling: 'Responsible Gambling',
	help: 'Help'
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
