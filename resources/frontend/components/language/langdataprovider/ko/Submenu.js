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
	termsandcondition: '계약조건',
	privacyPolicy: '개인 정보 정책',
	responsibleGambling: '책임 도박 서비스',
	faq: '질문과 대답',
	banking: '뱅킹',
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
