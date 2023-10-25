import React from 'react';
import { UserConsumer } from 'frontend/contexts/User';
import { FormattedMessage } from 'react-intl';

export default function Root() {
	return (
		<UserConsumer>
			{({ userState }) =>
				!userState.loading ? (
					userState.isLogin ? (
						<FormattedMessage id="gamesLobby" />
					) : (
						<FormattedMessage id="home" />
					)
				) : null
			}
		</UserConsumer>
	);
}
