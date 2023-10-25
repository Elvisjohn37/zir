import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	home: 'หน้าแรก',
	openaccount: 'เปิดบัญชี',
	gamerules: 'กติกาการเล่นเกม',
	aboutus: 'เกี่ยวกับเรา',
	contact_us: 'ติดต่อเรา',
	games: 'เกมส์',
	account: 'เบอร์บัญชี',
	gamesLobby: 'เกมส์ ล้อบบี้',
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
