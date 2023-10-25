import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	game_rules: 'Gaming Rules',
	applicability: {
		title: 'Applicability of these Rules',
		description1:
			'The following product-specific rules (the "Gaming Rules") ' +
			'governthe end user\'s (the "Player", "you" or "your") ' +
			"use of all the Operator's (or SBOBET Casino's) " +
			'interactive casino products and services ' +
			'(the "Casino Games") available at ',
		description2: 'casino.sbobet.com',
		description3:
			' (the "Website"). They form part of the Operator\'s ' +
			'Terms and Conditions, which apply to all the Casino Games ' +
			'the Operator offers and which the Player has to accept ' +
			'upon registering for any of the Casino Games. ' +
			'To the extent there is any inconsistency between the ' +
			'Terms and Conditions and any of these Gaming Rules, ' +
			'the Terms and Conditions shall prevail.',
	},
	generalRules: 'GENERAL GAMING RULES',
	liability: {
		title: 'Liability',
		description:
			'The Player shall have no cause of action and ' +
			'hereby waives any rights or claims against the software developer ' +
			'of the Casino Games for any matter, cause or thing involving the ' +
			'Player’s participation in the Casino Games or otherwise.',
	},
	playForFun: {
		title: ' Play for fun',
		description:
			'The Player agrees that the Casino Games are for ' +
			'entertainment value only. The Player understands and ' +
			'acknowledges that no monetary bet is necessary or required ' +
			'to play the Casino Games. If the Player wishes to play without ' +
			'betting money, they may do so in the "demo play" area only.',
	},
	personalUse: {
		title: ' Personal use only',
		description:
			"The Player's interest in the Casino and the Website " +
			'is personal and not professional. A Player entering the Website ' +
			'does so solely for their own personal entertainment and any other ' +
			'entrance, access, use or re-use of theCasino Games is strictly ' +
			'prohibited.',
	},
	malfunctions: {
		title: 'Malfunction',
		description:
			'Unless otherwise specified, below (e.g. with certain ' +
			'live games) malfunctions of any sort (software or hardware) ' +
			'will void play. This means that any stake placed will be returned ' +
			'irrespective of any indicative result.',
	},
	smartPlayer: {
		title: 'Smart Player and Artificial Intelligence',
		description:
			'SBOBET Casino reserves the right to reject SMART ' +
			'players or any suspected SMART players and Card Counters. ' +
			'Any activities using artificial intelligencecalled bots are ' +
			'strictly prohibited. Any attempt to breach or violate this policy ' +
			"will result in suspension and exclusion of the Player's Account. " +
			'All winnings and commissions will be forfeited.',
	},
	complaintsRng: {
		title: 'Complaint for random number generated gaming',
		description1:
			'If a Player has any complaints about any aspect of ' +
			'the Casino Games (save for the Live Casino Games, the complaints ' +
			'procedure for which is dealt with below), they should submit the ' +
			'nature such complaint within 14 (fourteen) days of the incident ' +
			'occurring to ',
		description2: 'support@sbobet.com',
		description3:
			' together with their User ID, the ' +
			'time and date of playing and any further information that may be ' +
			'relevant. Please note that the Operator will investigate the ' +
			'complaint fully using data from the Operator’s servers but the ' +
			'ultimate decision on the complaint rests with the Operator acting ' +
			'reasonably in light of all the available evidence.',
	},
	complaintsLg: {
		title: 'Complaints for Live Gaming',
		description1:
			'If a Player wishes to make a complaint or dispute a ' +
			'live Casino Game result, they must provide the Operator with their ' +
			"user ID the time of playing, the dealer's name, the Table ID and " +
			'Round ID at the time of contacting the Operator.Failure to do so ' +
			'may result in the complaint being unable to be addressed by the ' +
			'Operator.Video images of live Casino Games is kept for 24 hours ' +
			'and therefore Players must address their complaint within 24 hours ' +
			'of the dispute occurring. Any complaints submitted after 24 hours ' +
			'will be rejected by the Operator due to the absence of video evidence',
		description2:
			'In case of any dispute, the Player acknowledges and agrees that ' +
			'the Operator’s decision is final and official.',
	},
	maxWin: {
		title: 'Maximum Win',
		description: 'There is no maximum gross win in any day.',
	},
	liveCasinoGames: {
		title: 'Live Casino Games',
		description1:
			'For Live Casino Games, valid results on the Casino ' +
			'Games are those results which are detected by the electronic ' +
			'sensor equipment installed for that purpose.If for any reason ' +
			'a result is not detected and registered by the electronic sensors, ' +
			'then that result is deemed to have not occurred, and any bets ' +
			'locked will remain locked until a valid result is determined.',
		description2:
			'Specific rules on any malfunction in Live Casino ' +
			'Games are included in the specific Casino Games rules below. ' +
			'Please left-click on the names of any of the Casino Games to ' +
			'see the specific rules for that Casino Game:',
	},
	casinoGames: {
		live_dealer_baccarat: 'LIVE DEALER BACCARAT',
		live_dealer_roulette: 'LIVE DEALER ROULETTE',
		live_dealer_sicbo: 'LIVE DEALER SIC BO',
		live_dealer_blackjack: 'LIVE DEALER BLACKJACK',
		games: 'GAMES',
		slot: 'SLOT',
		card: 'CARD',
		table: 'TABLE',
	},
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
