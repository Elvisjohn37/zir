import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	home: '主页',
	openaccount: '新帐户',
	gamerules: '游戏规则',
	aboutus: '关于我们',
	contactus: '联系我们',
	games: '游戏',
	account: '账户',
	gamesLobby: '游戏大厅',
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
