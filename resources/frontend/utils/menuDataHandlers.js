import appendQuery from 'append-query';

function getAfterLoginMenu(layoutState) {
	return {
		en: {
			games: `/`,
			account: `/account`,
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
		zh: {
			games: `/`,
			account: `/account`,
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
		ko: {
			games: `/`,
			account: `/account`,
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
		th: {
			games: `/`,
			account: `/account`,
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
	};
}

function getBeforeLoginMenu(layoutState) {
	return {
		en: {
			home: `/`,
			open_account: appendQuery(layoutState.config.menuOpenAccount,'lang=en'),
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
		zh: {
			home: `/`,
			open_account: appendQuery(layoutState.config.menuOpenAccount,'lang=zh-tw'),
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
		ko: {
			home: `/`,
			open_account: appendQuery(layoutState.config.menuOpenAccount,'lang=ko-kr'),
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
		th: {
			home: `/`,
			open_account: appendQuery(layoutState.config.menuOpenAccount,'lang=th-th'),
			game_rules: `/gamerules`,
			about_us: layoutState.config.aboutUs,
			contact_us: layoutState.config.contactUs,
		},
	};
}

export function menuPathName(useLocation) {
	let pathname = `/${useLocation().pathname.split('/')[1]}`;

	if (pathname === '/games') {
		pathname = '/';
	}

	return pathname;
}

export default { getAfterLoginMenu, getBeforeLoginMenu };
