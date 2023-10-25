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
	termsandcondition: 'ข้อตกลงและเงื่อนไข',
	privacyPolicy: 'นโยบายว่าด้วยความเป็นส่วนตัว',
	responsibleGambling: 'นโยบายว่าด้วยการเล่นพนันอย่างรับผิดชอบ',
	faq: 'คำถามคำตอบ',
	banking: 'ธนาคาร',
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
