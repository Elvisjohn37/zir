import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	home: '홈',
	openaccount: '계좌 개설',
	gamerules: '게임 규칙',
	aboutus: '카지노 소개',
	contact_us: '문의처',
	games: '게임',
	account: '계정',
	gamesLobby: '게임로비',
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
