import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	home: 'Home',
	openaccount: 'Open Account',
	gamerules: 'Gaming Rules',
	aboutus: 'About Us',
	contactus: 'Contact Us',
	games: 'Games',
	account: 'Account',
	gamesLobby: 'Games Lobby',
	sports: 'Sports',
	allGames: 'All Games',
	categories: 'Categories',
	reports: 'Reports',
	back: 'Back',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
