import React, { useEffect } from 'react';
import styles from './CloseGame.module';
import Spinner from 'frontend/components/Spinner';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';

export default function CloseGame() {
	useEffect(() => {
		parent.postMessage('closeGame', '*');
	}, []);

	return (
		<LangDataProvider category="gamewindow">
			<div className={styles.loadingMessage}>
				<Spinner color="primary" />
				<FormattedMessage id="returningToLobby" />
			</div>
		</LangDataProvider>
	);
}
