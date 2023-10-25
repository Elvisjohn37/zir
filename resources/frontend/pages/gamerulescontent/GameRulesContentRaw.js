import React, { useState } from 'react';
import { useParams, useLocation, NavLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './GameRulesContentRaw.module';
import SeamlessIframe from 'frontend/components/SeamlessIframe';
import { loadGoogleDocsIframe } from './gamerulescontentraw/iframeHandler';
import classnames from 'classnames';
import lodash from 'lodash';
import GameRulesErrorMessage from 'frontend/components/GameRulesErrorMessage';
import GameRulesLoader from 'frontend/components/GameRulesLoader';

export default function GameRulesContentRaw({ gameRulesState }) {
	let [isContentLoading, setIsContentLoading] = useState(true);
	let [isContentError, setIsContentError] = useState(false);

	let { gameName } = useParams();
	let gameRuleDetails = gameRulesState.gameRulesList.find((item) => lodash.kebabCase(item.gameName) == gameName);

	let location = useLocation();
	let splitPathName = location.pathname.split('/');
	splitPathName.pop();
	let rootPath = splitPathName.join('/');

	let iframeRef = React.useRef();

	return (
		<Container className={styles.gameRulesContentRaw}>
			<div className={styles.backButtonContainer}>
				<IconButton component={NavLink} to={rootPath}>
					<ArrowBackIcon />
				</IconButton>
			</div>
			<div className={styles.content}>
				{gameRulesState.isLoading ? (
					<GameRulesLoader />
				) : gameRulesState.isError || gameRuleDetails === undefined || isContentError ? (
					<GameRulesErrorMessage />
				) : (
					<>
						{isContentLoading && <GameRulesLoader />}
						<SeamlessIframe
							scrolling="no"
							src={'/frame'}
							iframeHolderClassName={classnames([styles.iframeHolder, isContentLoading && styles.isContentLoading])}
							iframeClassName={styles.iframe}
							ref={iframeRef}
							width={640}
							onLoad={(e) => {
								loadGoogleDocsIframe(e.target, gameRuleDetails.url, {
									success: () => {
										iframeRef.current.resize();
										setIsContentLoading(false);
									},
									error: () => {
										setIsContentError(true);
									},
								});
							}}
						/>
					</>
				)}
			</div>
		</Container>
	);
}
