import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import styles from './GameRulesListRaw.module';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import classnames from 'classnames';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import lodash from 'lodash';
import GameRulesLoader from 'frontend/components/GameRulesLoader';
import GameRulesErrorMessage from 'frontend/components/GameRulesErrorMessage';
import { FormattedMessage } from 'react-intl';

export default function GameRulesListRaw({ gameRulesState }) {
	let location = useLocation();
	let { product, gameType } = useParams();
	let currentPath = location.pathname;
	let splitPathName = currentPath.split('/');
	splitPathName.pop();
	splitPathName.pop();
	let rootPath = splitPathName.join('/');
	let filteredGameRules = gameRulesState.gameRulesList.filter(
		(item) => lodash.kebabCase(item.productName) == product && lodash.kebabCase(item.gameTypeName) == gameType
	);

	return (
		<Container className={styles.gameRulesLisRaw}>
			<div className={styles.backButtonContainer}>
				<IconButton component={NavLink} to={rootPath}>
					<ArrowBackIcon />
				</IconButton>
			</div>
			<Grid container spacing={1}>
				{gameRulesState.isLoading ? (
					<GameRulesLoader />
				) : gameRulesState.isError || filteredGameRules.length == 0 ? (
					<GameRulesErrorMessage />
				) : (
					filteredGameRules.map((item, index) => {
						return (
							<Grid item md={6} xs={12} lg={4} key={index}>
								<Button
									component={NavLink}
									startIcon={<InsertDriveFileIcon />}
									variant="contained"
									disableElevation
									color="primary"
									className={classnames([styles.button, item.isNew == '1' && styles.isNew])}
									to={`${currentPath}/${lodash.kebabCase(item.gameName)}`}
								>
									{item.gameName}
									{item.isNew == '1' && (
										<span className={styles.newTag}>
											<FormattedMessage id="new" />
										</span>
									)}
								</Button>
							</Grid>
						);
					})
				)}
			</Grid>
		</Container>
	);
}
