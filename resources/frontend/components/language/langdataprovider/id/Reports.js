import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	report: 'Report',
	statement: 'Statement',
	selectATemplateFile: 'Select a template file',
	startDate: 'Start date',
	endDate: 'End date',
	submit: 'Submit',
	reportPageInfo:
		'If you require more information regarding your poker game history, please contact your agent or the casino at support@sbobet.com and be sure to quote your user name and the time of play.',
	beginDate: 'Begin Date',
	user: 'User',
	totalPlayed: 'Total Played',
	totalRakePaid: 'Total Rake Paid',
	rollingCommission: 'Rolling Commission',
	rakeCommision: 'Rake Commision',
	casinoWinLoss: 'Casino Win/Loss',
	pokerWinLoss: 'Poker Win/Loss',
	netWinLoss: 'Net Win/Loss',
	timeIndicated: 'Time indicated in this report is ',
	finLedReport: 'Financial Ledger Report',
	plaComSumReport: 'Player commission summary report',
	gamLedReport: 'Game Ledger Report',
	gamLedByGamReport: 'Game Ledger (by game) Report',
	endTimeIs1Hour: 'End date is 1 hour after the start date',
	date: 'Date',
	transacGame: 'Transaction/Game',
	traEveID: 'Transaction Event ID',
	debit: 'Debit',
	credit: 'Credit',
	curBalance: 'Current Balance',
	gamDetLegend: 'Game Detail Legend',
	gamDetLegContent:
		'Slots \n AmountBet: The total amount wagered.BetLines: The number of lines being played FreeGames: The number of free games remaining ScatterWin and WinOnLineX: Y is equal to Z, where X is the line number the win occured on Y is the amount won on that line Z is the listing of symbols that caused the win',
	gamLedNote: 'Game Detail Legend can be found at the end of the report',
	gamTotals: 'Game Totals',
	newSession: 'New Session',
	repTotals: 'Report Totals',
	plaBalance: 'Playable Balance',
	type: 'Type',
	turnover: 'Turnover',
	grossRake: 'Gross Rake',
	commission: 'Commission',
	cashBalance: 'Cash Balance',
	product: 'Product',
	runningBet: 'Running Bet',
	transactionLog: 'Transaction Log',
	playerBetList: 'Player Bet List',
	transfer: 'Transfer',
	promotion: 'Promotion',
	betDetailRefresh: 'Showing the bet details of {product}',
	time: 'Time',
	gameDetails: 'Game Details',
	gameResult: 'Game Result',
	description: 'Description',
	stakeTurnover: 'Stake Turnover',
	memWLCommission: 'Members W/L Commission',
	creditDetailRefresh: 'Showing the credit details from {date}',
	creditLimit: 'Credit Limit',
	playerTotalBalance: 'Player Total Balance',
	amount: 'Amount',
	outstandingBalance: 'Outstanding Balance',
	playableBalance: 'Playable Balance',
	transferDetailRefresh: 'Showing the transfer details from {date}',
	betDetails: 'Bet Details',
	denied: 'Denied',
	running: 'Running',
	lose: 'Lose',
	won: 'Won',
	voided: 'Voided',
	'--': '--',
	rejected: 'Rejected',
	draw: 'Draw',
	aborted: 'Aborted',
	betAmount: 'Bet Amount: {amount}',
	sideBetAmount: 'Side Bet Amount: {amount}',
	stakePerPoint: 'Stake Per Point: {amount}',
	numberOfBets: 'No. Of Bets: {amount}',
	winningLines: 'Winning Lines: {amount}',
	gamble: 'Gamble',
	netwinAdjustment: 'Netwin Adjustment',
	reason: 'Reason: {message}',
	depositApproved: 'Player deposit request approved by Agent {agentUsername}',
	totalRunningBets: 'Total Running Bets: {amount}',
	withdrawalApproved: 'Player withdrawal request approved by Agent {agentUsername}',
	transferAdjustment: 'Transfer adjustment via Admin Site from House',
	transferCutoff: 'Cutoff Transfer via Agent Site from: {agentUsername}',
	transferFund: 'Fund Transfer via Agent Site from: {agentUsername}',
	creditLimitViaAgent: 'Credit limit via agent site from Agent {agentUsername}',
	runningBetRefresh: 'Showing the running bet details',
	status: 'Status',
	runningBets: 'Runing Bets',
	cashBalanceGame: 'Cash Balance Game',
	details: 'Details',
	result: 'Result',
	chooseDate: 'Choose Date',
	search: 'Search',
	previous: 'Previous',
	next: 'Next',
	logNotice: 'The end of this report is one hour after the start date',
	total: 'Total',
	cancel: 'Cancel',
	ok: 'Ok',
	timeZoneNotice: 'Time indicated in this report is GMT+8',
	transactionID: 'Transaction ID',
	event: 'Event'
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
