import React from 'react';
import GameRulesLoader from 'frontend/components/GameRulesLoader';
import withSuspense from 'frontend/utils/withSuspense';

let ErrorMessage = withSuspense(
	React.lazy(function () {
		return import('frontend/components/GameRulesFetchErrorMessage');
	}),
	<GameRulesLoader />
);

export default ErrorMessage;
