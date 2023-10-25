import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import RouteWrap from './approute/RouteWrap';
import UserProviderWrap from './approute/UserProviderWrap';
import GameRulesProviderWrap from './approute/GameRulesProviderWrap';
import DesktopOnlyRoute from './approute/DesktopOnlyRoute';
import withSuspense from 'frontend/utils/withSuspense';
import Spinner from 'frontend/components/Spinner';

let MainLayout = withSuspense(
	React.lazy(function () {
		return import('./approute/MainLayout');
	})
);
let NoLayout = withSuspense(
	React.lazy(function () {
		return import('./approute/NoLayout');
	})
);
let Home = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/Home');
	}),
	<Spinner/>
);
let Games = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/Games');
	}),
	<Spinner/>
);

let GameRules = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/GameRules');
	}),
	<Spinner/>
);

let GameRulesList = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/GameRulesList');
	}),
	<Spinner/>
);

let GameRulesContent = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/GameRulesContent');
	}),
	<Spinner/>
);
let TermsAndCondition = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/TermsAndCondition');
	}),
	<Spinner/>
);
let PrivacyPolicy = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/GameRulesContent'); // temp
	}),
	<Spinner/>
);
let ResponsibleGambling = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/GameRulesContent'); // temp
	}),
	<Spinner/>
);
let Faq = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/Faq');
	}),
	<Spinner/>
);

let SessionBasedRoute = withSuspense(
	React.lazy(function () {
		return import('./approute/SessionBasedRoute');
	}),
	<Spinner/>
);
let Account = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/Account');
	}),
	<Spinner/>
);

let ErrorPage = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/ErrorPage');
	})
);

let ReportStatement = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/ReportStatement');
	}),
	<Spinner/>
);

let PlayerBetList = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/PlayerBetList');
	}),
	<Spinner/>
);

let PlayerTransferList = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/PlayerTransferList');
	}),
	<Spinner/>
);

let PlayerCreditList = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/PlayerCreditList');
	}),
	<Spinner/>
);

let ReportRunningBet = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/ReportRunningBet');
	}),
	<Spinner/>
);
let ReportTransactionLog = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/ReportTransactionLog');
	}),
	<Spinner/>
);
let Play = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/Play');
	}),
	<Spinner/>
);
let BetInfo = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/BetInfo');
	}),
	<Spinner/>
);

let CloseGame = withSuspense(
	React.lazy(function () {
		return import('frontend/pages/CloseGame');
	}),
	<Spinner/>
);

const GAMERULES_PATH = '/gamerules/:product/:gameType';
const GAME_WRAPPERS = [
	{ component: UserProviderWrap },
	{ component: MainLayout },
	{ component: SessionBasedRoute, fallback: Home },
];

export default function AppRoute() {
	return (
		<BrowserRouter basename={process.env.APP_ROOT || '/'}>
			<Switch>
				<RouteWrap exact path="/" wrappers={GAME_WRAPPERS} component={Games} />
				<RouteWrap exact path="/games/:type?" wrappers={GAME_WRAPPERS} component={Games} />
				<RouteWrap
					exact
					path="/gamerules"
					wrappers={[
						{ component: UserProviderWrap },
						{ component: MainLayout },
						{ component: DesktopOnlyRoute },
						{ component: GameRulesProviderWrap },
					]}
					component={GameRules}
				/>
				<Route exact path="/gamerules/:product" component={() => <Redirect to="/gamerules/" />} />
				<RouteWrap
					exact
					path={GAMERULES_PATH}
					wrappers={[
						{ component: UserProviderWrap },
						{ component: MainLayout },
						{ component: DesktopOnlyRoute },
						{ component: GameRulesProviderWrap },
					]}
					component={GameRulesList}
				/>
				<RouteWrap
					exact
					path={`${GAMERULES_PATH}/:gameName`}
					wrappers={[
						{ component: UserProviderWrap },
						{ component: MainLayout },
						{ component: DesktopOnlyRoute },
						{ component: GameRulesProviderWrap },
					]}
					component={GameRulesContent}
				/>
				<RouteWrap
					exact
					path="/termsandcondition"
					wrappers={[
						{ component: UserProviderWrap },
						{ component: MainLayout },
						{ component: DesktopOnlyRoute },
						{ component: SessionBasedRoute },
					]}
					component={TermsAndCondition}
				/>
				<RouteWrap
					exact
					path="/privacypolicy"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: DesktopOnlyRoute }]}
					component={PrivacyPolicy}
				/>
				<RouteWrap
					exact
					path="/responsiblegambling"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: DesktopOnlyRoute }]}
					component={ResponsibleGambling}
				/>
				<RouteWrap
					exact
					path="/faq"
					wrappers={[
						{ component: UserProviderWrap },
						{ component: MainLayout },
						{ component: DesktopOnlyRoute },
						{ component: SessionBasedRoute, isLogin: false },
					]}
					component={Faq}
				/>
				<RouteWrap
					exact
					path="/account"
					wrappers={[
						{ component: UserProviderWrap },
						{ component: MainLayout },
						{ component: DesktopOnlyRoute },
						{ component: SessionBasedRoute },
					]}
					component={Account}
				/>
				<Route
					exact
					path="/account/archived-report"
					component={() => <Redirect to="/account/archived-report/statement" />}
				/>
				<RouteWrap
					exact
					path="/account/archived-report/statement"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={ReportStatement}
				/>
				<RouteWrap
					exact
					path="/account/archived-report/runningbet"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={ReportRunningBet}
				/>
				<RouteWrap
					exact
					path="/account/archived-report/transactionlog"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={ReportTransactionLog}
				/>
				<RouteWrap
					exact
					path="/account/archived-report/statement/:type(betting)/:productID/:date"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={PlayerBetList}
				/>

				<RouteWrap
					exact
					path="/account/archived-report/statement/:type(promotion)/:date"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={PlayerBetList}
				/>
				<RouteWrap
					exact
					path="/account/archived-report/statement/:type(transfer)/:date"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={PlayerTransferList}
				/>
				<RouteWrap
					exact
					path="/account/archived-report/statement/:type(credit)/:date"
					wrappers={[{ component: UserProviderWrap }, { component: MainLayout }, { component: SessionBasedRoute }]}
					component={PlayerCreditList}
				/>
				<RouteWrap
					exact
					path="/play"
					wrappers={[{ component: UserProviderWrap }, { component: NoLayout }, { component: SessionBasedRoute }]}
					component={Play}
				/>
				<RouteWrap exact path="/betinfo/:type" wrappers={[{ component: NoLayout }]} component={BetInfo} />

				<RouteWrap exact wrappers={[{ component: NoLayout }]} path="/closegame/" component={CloseGame} />

				<RouteWrap exact path="*" wrappers={[{ component: NoLayout }]} component={ErrorPage} />
			</Switch>
		</BrowserRouter>
	);
}
