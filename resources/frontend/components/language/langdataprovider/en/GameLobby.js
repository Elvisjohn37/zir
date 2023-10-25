import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	gamelobby: 'Games Lobby',
	account_balance: 'Account Balance: ',
	announcement: 'Announcement: Gaming Rules Update',
	lobbyInfo:
		"SBOBET Casino prohibits any activities using artificial inteligence.Violating this policy will suspend the player's account. All games, winnings and commissions will be forfeited.",
	videopoker: 'Video Poker',
	cardGamesTitle: 'Card Games',
	tableGamesTitle: 'Table Games',
	superSlotTitle: 'Super Slots',
	multiplayerTitle: 'Multiplayer',
	multiplayerTooltip: 'Show all multiplayer games',
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
	cardGamesTooltip: 'Show all card games',
	tableGamesTooltip: 'Show all table games',
	showAll: 'Show All',
	totalMoreGames: '{totalMoreGames}+',
	moreGames: 'more games',
	searchGame: 'SEARCH',
	back: 'Back',
	new: 'NEW',
	notice: 'NOTICE',
	notCertified:
		'You are now leaving the website www.sbobet.com and being redirected to a website that is not regulated by the Isle of Man Gambling Supervision Commission.',
	allGames: 'ALL GAMES',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
