import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	gamelobby: 'เกมส์ ล้อบบี้',
	account_balance: 'ยอดบัญชีทั้งสิ้น: ',
	announcement: 'Announcement: Gaming Rules Update',
	lobbyInfo:
		"SBOBET Casino prohibits any activities using artificial inteligence.Violating this policy will suspend the player's account. All games, winnings and commissions will be forfeited.",
	videopoker: 'วีดิโอโป๊กเกอร์',
	card: 'เกมส์ไพ่',
	table: 'เกมส์เล่นบนโต๊ะ',
	slot: 'ซุปเปอร์ สล็อต',
	pleaseUse: 'Please use',
	puffinBrowser: 'Puffin Browser',
	toPlayTheClassic: 'to play the classic games or proceed playing the HTML5 games.',
	detectFlash:
		"Our system detects your browser doesn't support flash. You may now be redirected to our most popular and exciting HTML5 game!",
	okay: 'OKAY',
	cancel: 'CANCEL',
	notAvailable: 'Not available',
	topTitle: 'Top Picks',
	recentTitle: 'Recent Games',
	topTooltip: 'Show all top pick games',
	recentTooltip: 'Show all recent games',
	superSlotTooltip: 'Show all super slot games',
	cardGamesTooltip: 'Show all super card games',
	tableGamesTooltip: 'Show all super table games',
	showAll: 'Show All',
	searchGame: 'Search Game',
	back: 'Back',
	new: 'NEW',
	multiplayerTitle: 'Multiplayer',
	multiplayerTooltip: 'Show all multiplayer games',
	notice: 'NOTICE',
	notCertified:
		'You are now leaving the website www.sbobet.com and being redirected to a website that is not regulated by the Isle of Man Gambling Supervision Commission.',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
