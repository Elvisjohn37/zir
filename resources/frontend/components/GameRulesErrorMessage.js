import React from 'react';
import GameRulesLoader from 'frontend/components/GameRulesLoader';
import withSuspense from 'frontend/utils/withSuspense';

let GameRulesErrorMessage = withSuspense(
	React.lazy(function () {
		return import('frontend/components/gameruleserrormessage/GameRulesErrorMessageRaw');
	}),
	<GameRulesLoader />
);

export default GameRulesErrorMessage;
