import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	newGames: 'NEW GAMES',
	newGamesContent1: 'Try out new and exciting games.',
	newGamesContent2: 'Spend time for fun!',
	letsPlay: "Let's play",
	topGames: 'TOP GAMES',
	signIn: 'Sign In',
	explore: 'EXPLORE',
	exploreContent1: 'Browse By Game Categories;',
	exploreContent2: 'Slot Games, Card Games,',
	exploreContent3: 'Table Games and Multiplayer Games.',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
