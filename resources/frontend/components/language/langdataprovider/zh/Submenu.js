import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	statement: 'Statement',
	runningbet: 'Running Bet',
	transactionlog: 'Transaction Log',
	account: '계정',
	balance: '잔고',
	reports: '보고서',
	transferfunds: 'Transfer Funds',
	limitadjust: 'Limit Adjust',
	selfexclusion: 'Self Exclusion',
	termsandcondition: '期限和条件',
	privacyPolicy: '隐私权政策',
	responsibleGambling: '赌博责任的方针',
	faq: '常见问题',
	banking: '银行',
	credit: 'Credits',
	transfer: 'Transfer',
	archivedReport: 'Archived Reports',
	financialLedger: 'Financial Ledger',
	gameLedger: 'Game Ledger',
	help: 'Help'
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
