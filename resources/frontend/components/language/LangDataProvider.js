import React, { Suspense, lazy } from 'react';
import { LangConsumer } from 'frontend/contexts/Language';
import { SkeletonFull } from 'frontend/components/Skeleton';

const PROVIDERS = {
	menu: {
		en: lazy(() => import('./langdataprovider/en/Menu')),
		zh: lazy(() => import('./langdataprovider/zh/Menu')),
		ko: lazy(() => import('./langdataprovider/ko/Menu')),
		th: lazy(() => import('./langdataprovider/th/Menu')),
		id: lazy(() => import('./langdataprovider/id/Menu')),
	},
	langselector: {
		en: lazy(() => import('./langdataprovider/en/LangSelector')),
		zh: lazy(() => import('./langdataprovider/zh/LangSelector')),
		ko: lazy(() => import('./langdataprovider/ko/LangSelector')),
		th: lazy(() => import('./langdataprovider/th/LangSelector')),
		id: lazy(() => import('./langdataprovider/id/LangSelector')),
	},
	footer: {
		en: lazy(() => import('./langdataprovider/en/Footer')),
		zh: lazy(() => import('./langdataprovider/zh/Footer')),
		ko: lazy(() => import('./langdataprovider/ko/Footer')),
		th: lazy(() => import('./langdataprovider/th/Footer')),
		id: lazy(() => import('./langdataprovider/id/Footer')),
	},
	headertablink: {
		en: lazy(() => import('./langdataprovider/en/HeaderTabLink')),
		zh: lazy(() => import('./langdataprovider/zh/HeaderTabLink')),
		ko: lazy(() => import('./langdataprovider/ko/HeaderTabLink')),
		th: lazy(() => import('./langdataprovider/th/HeaderTabLink')),
		id: lazy(() => import('./langdataprovider/id/HeaderTabLink')),
	},
	loginlogoutform: {
		en: lazy(() => import('./langdataprovider/en/LoginLogoutForm')),
		zh: lazy(() => import('./langdataprovider/zh/LoginLogoutForm')),
		ko: lazy(() => import('./langdataprovider/ko/LoginLogoutForm')),
		th: lazy(() => import('./langdataprovider/th/LoginLogoutForm')),
		id: lazy(() => import('./langdataprovider/id/LoginLogoutForm')),
	},
	gamelobby: {
		en: lazy(() => import('./langdataprovider/en/GameLobby')),
		zh: lazy(() => import('./langdataprovider/zh/GameLobby')),
		ko: lazy(() => import('./langdataprovider/ko/GameLobby')),
		th: lazy(() => import('./langdataprovider/th/GameLobby')),
		id: lazy(() => import('./langdataprovider/id/GameLobby')),
	},
	gamerules: {
		en: lazy(() => import('./langdataprovider/en/GameRules')),
		zh: lazy(() => import('./langdataprovider/zh/GameRules')),
		ko: lazy(() => import('./langdataprovider/ko/GameRules')),
		th: lazy(() => import('./langdataprovider/th/GameRules')),
		id: lazy(() => import('./langdataprovider/id/GameRules')),
	},
	bankingOptions: {
		en: lazy(() => import('./langdataprovider/en/BankingOptions')),
		zh: lazy(() => import('./langdataprovider/zh/BankingOptions')),
		ko: lazy(() => import('./langdataprovider/ko/BankingOptions')),
		th: lazy(() => import('./langdataprovider/th/BankingOptions')),
		id: lazy(() => import('./langdataprovider/id/BankingOptions')),
	},
	reports: {
		en: lazy(() => import('./langdataprovider/en/Reports')),
		zh: lazy(() => import('./langdataprovider/zh/Reports')),
		ko: lazy(() => import('./langdataprovider/ko/Reports')),
		th: lazy(() => import('./langdataprovider/th/Reports')),
		id: lazy(() => import('./langdataprovider/id/Reports')),
	},
	errormessage: {
		en: lazy(() => import('./langdataprovider/en/ErrorMessage')),
		zh: lazy(() => import('./langdataprovider/zh/ErrorMessage')),
		ko: lazy(() => import('./langdataprovider/ko/ErrorMessage')),
		th: lazy(() => import('./langdataprovider/th/ErrorMessage')),
		id: lazy(() => import('./langdataprovider/id/ErrorMessage')),
	},
	gametypeicon: {
		en: lazy(() => import('./langdataprovider/en/GameIcon')),
		zh: lazy(() => import('./langdataprovider/zh/GameIcon')),
		ko: lazy(() => import('./langdataprovider/ko/GameIcon')),
		th: lazy(() => import('./langdataprovider/th/GameIcon')),
		id: lazy(() => import('./langdataprovider/id/GameIcon')),
	},
	termscondition: {
		en: lazy(() => import('./langdataprovider/en/TermsAndCondition')),
		zh: lazy(() => import('./langdataprovider/zh/TermsAndCondition')),
		ko: lazy(() => import('./langdataprovider/ko/TermsAndCondition')),
		th: lazy(() => import('./langdataprovider/th/TermsAndCondition')),
		id: lazy(() => import('./langdataprovider/id/TermsAndCondition')),
	},
	gamerulescontent: {
		en: lazy(() => import('./langdataprovider/en/GameRulesContent')),
		zh: lazy(() => import('./langdataprovider/zh/GameRulesContent')),
		ko: lazy(() => import('./langdataprovider/ko/GameRulesContent')),
		th: lazy(() => import('./langdataprovider/th/GameRulesContent')),
		id: lazy(() => import('./langdataprovider/id/GameRulesContent')),
	},
	errorcomponent: {
		en: lazy(() => import('./langdataprovider/en/ErrorComponent')),
		zh: lazy(() => import('./langdataprovider/zh/ErrorComponent')),
		ko: lazy(() => import('./langdataprovider/ko/ErrorComponent')),
		th: lazy(() => import('./langdataprovider/th/ErrorComponent')),
		id: lazy(() => import('./langdataprovider/id/ErrorComponent')),
	},
	submenu: {
		en: lazy(() => import('./langdataprovider/en/Submenu')),
		zh: lazy(() => import('./langdataprovider/zh/Submenu')),
		ko: lazy(() => import('./langdataprovider/ko/Submenu')),
		th: lazy(() => import('./langdataprovider/th/Submenu')),
		id: lazy(() => import('./langdataprovider/id/Submenu')),
	},
	table: {
		en: lazy(() => import('./langdataprovider/en/Table')),
		zh: lazy(() => import('./langdataprovider/zh/Table')),
		ko: lazy(() => import('./langdataprovider/ko/Table')),
		th: lazy(() => import('./langdataprovider/th/Table')),
		id: lazy(() => import('./langdataprovider/id/Table')),
	},
	announcement: {
		en: lazy(() => import('./langdataprovider/en/Announcement')),
		zh: lazy(() => import('./langdataprovider/zh/Announcement')),
		ko: lazy(() => import('./langdataprovider/ko/Announcement')),
		th: lazy(() => import('./langdataprovider/th/Announcement')),
		id: lazy(() => import('./langdataprovider/id/Announcement')),
	},
	gamewindow: {
		en: lazy(() => import('./langdataprovider/en/GameWindow')),
		zh: lazy(() => import('./langdataprovider/zh/GameWindow')),
		ko: lazy(() => import('./langdataprovider/ko/GameWindow')),
		th: lazy(() => import('./langdataprovider/th/GameWindow')),
		id: lazy(() => import('./langdataprovider/id/GameWindow')),
	},
	faq: {
		en: lazy(() => import('./langdataprovider/en/Faq')),
		zh: lazy(() => import('./langdataprovider/zh/Faq')),
		ko: lazy(() => import('./langdataprovider/ko/Faq')),
		th: lazy(() => import('./langdataprovider/th/Faq')),
		id: lazy(() => import('./langdataprovider/id/Faq')),
	},
	home: {
		en: lazy(() => import('./langdataprovider/en/Home')),
		zh: lazy(() => import('./langdataprovider/zh/Home')),
		ko: lazy(() => import('./langdataprovider/ko/Home')),
		th: lazy(() => import('./langdataprovider/th/Home')),
		id: lazy(() => import('./langdataprovider/id/Home')),
	},
	cookiepolicy: {
		en: lazy(() => import('./langdataprovider/en/CookiePolicy')),
		zh: lazy(() => import('./langdataprovider/zh/CookiePolicy')),
		ko: lazy(() => import('./langdataprovider/ko/CookiePolicy')),
		th: lazy(() => import('./langdataprovider/th/CookiePolicy')),
		id: lazy(() => import('./langdataprovider/id/CookiePolicy')),
	},
};

export default function LangIntlProvider({ category, children, fallback }) {
	return (
		<Suspense fallback={fallback || <SkeletonFull />}>
			<LangConsumer>
				{({ langState }) => {
					const Provider = PROVIDERS[category][langState.active];
					return <Provider locale={langState.active}>{children}</Provider>;
				}}
			</LangConsumer>
		</Suspense>
	);
}
