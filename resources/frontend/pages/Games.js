import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import styles from './Games.module';
import { isEmpty, isMobileDevice } from 'frontend/utils/helper';
import { ErrorMessageDisplay } from './games/Notifications';
import useGame from './games/useGames';
import Banner from 'frontend/components/Banner';
import ErrorBoundary from 'frontend/components/ErrorBoundary';
import { useLocation } from 'react-router-dom';
import { gameParams, gameTypeTitle } from 'frontend/utils/gameHelper';
import { LangConsumer } from 'frontend/contexts/Language';
import SearchBar from './games/SearchBar';
import lodash from 'lodash';
import { ErrorLight } from 'frontend/components/OnPageError';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { FormattedMessage } from 'react-intl';
import GameThumbnail, { GameThumbnailLoader } from 'frontend/components/GameThumbnail';
import { toLower, startCase } from 'lodash';
import RecentGame from './games/RecentGame';
import TopGame from './games/TopGame';
import AllGame from './games/AllGame';
import Grid from '@mui/material/Grid';
import withSuspense from 'frontend/utils/withSuspense';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import MobileQuery from 'frontend/components/MobileQuery';
import classnames from 'classnames';

let CategoryMenu = withSuspense(
	React.lazy(function () {
		return import('./games/CategoryMenu');
	})
);

function Games({ langState, matches, layoutState }) {
	let params = gameParams(useLocation);
	let [games, setGames] = React.useState([]);
	let [gameTypes, setGameTypes] = React.useState([]);
	let [gameError, setGameError] = React.useState(null);
	let [isLoading, setIsLoading] = React.useState(true);
	let [searchValue, setSearchValue] = React.useState(null);

	useGame({
		setGameTypes,
		setGames,
		setGameError,
		isLoading,
		setIsLoading,
		isMobileDevice: isMobileDevice(),
	});

	let selectedGameType = params.gameType ? toLower(startCase(params.gameType)) : 'all';
	let isSearch = !isEmpty(searchValue) || selectedGameType != 'all';

	let searchedGames = [];
	let hasSearchedGame = false;

	if (isSearch && !isLoading) {
		searchedGames = games.list
			.filter((game) => {
				if (selectedGameType != 'all') {
					if (game.gameTypeName.toLowerCase() != selectedGameType.toLowerCase()) {
						return false;
					}
				}

				if (!isEmpty(searchValue)) {
					if (!lodash.includes(game.gameName.toLowerCase(), searchValue.toLowerCase())) {
						return false;
					}
				}

				return true;
			})
			.sort((gameTypeRankCurrent, gameTypeRankNext) => {
				return gameTypeRankCurrent.gameTypeRank - gameTypeRankNext.gameTypeRank;
			});
		hasSearchedGame = searchedGames.length > 0;
	}

	return (
		<>
			<ErrorBoundary>
				<div className={styles.banner}>
					<Banner type={'games'} imgWidth={1250} imgHeight={325} langState={langState} />
				</div>
			</ErrorBoundary>
			<ErrorBoundary>
				<div className={styles.gamelobby}>
					{isLoading ? (
						<GameThumbnailLoader />
					) : !isEmpty(gameError) ? (
						<ErrorMessageDisplay response={gameError} />
					) : (
						<>
							<div
								className={classnames([
									styles.subMenuBar,
									layoutState.config.isMobileSite ? styles.mobileSite : styles.desktopSite,
								])}
							>
								{!layoutState.config.isMobileSite && (
									<CategoryMenu
										selectedGameType={selectedGameType}
										gameTypes={gameTypes}
										params={params}
									/>
								)}
								<div className={styles.searchBar}>
									<SearchBar
										onChange={(e) => {
											setSearchValue(e.target.value);
										}}
										value={searchValue}
										toggable={layoutState.config.isMobileSite}
									/>
								</div>
							</div>
							{isSearch ? (
								<div
									className={classnames([
										styles.searchResult,
										matches ? styles.mobile : styles.desktop,
									])}
								>
									{selectedGameType != 'all' && matches && (
										<div className={styles.gameTypeTitle}>
											<FormattedMessage id={gameTypeTitle(selectedGameType)} />
										</div>
									)}
									{hasSearchedGame ? (
										<div className={styles.searchResultWrapper}>
											<Grid container spacing={matches ? 1 : 3}>
												{searchedGames.map((game, index) => (
													<Grid item xs={4} lg={2.4} key={index}>
														<GameThumbnail
															game={game}
															index={index}
															gameType={game.gameTypeName}
															isDisplayFlag={true}
														/>
													</Grid>
												))}
											</Grid>
										</div>
									) : (
										<ErrorLight
											icon={SearchIcon}
											errorCode="ERR_00035"
											buttons={
												<Button
													variant="contained"
													onClick={() => {
														setSearchValue(null);
													}}
													startIcon={<ArrowBackIcon />}
													color="secondary"
												>
													<FormattedMessage id="back" />
												</Button>
											}
										/>
									)}
								</div>
							) : (
								<div className={styles.allGames}>
									<RecentGame games={games} />
									<TopGame games={games} />
									<AllGame games={games} />
								</div>
							)}
						</>
					)}
				</div>
			</ErrorBoundary>
		</>
	);
}

export default function GamesWithState(props) {
	return (
		<MobileQuery>
			{(matches) => (
				<LayoutConsumer>
					{({ layoutState }) => (
						<LangConsumer>
							{({ langState }) => {
								return (
									<LangDataProvider category="errormessage">
										<LangDataProvider category="gamelobby">
											<Games
												langState={langState}
												layoutState={layoutState}
												matches={matches}
												{...props}
											/>
										</LangDataProvider>
									</LangDataProvider>
								);
							}}
						</LangConsumer>
					)}
				</LayoutConsumer>
			)}
		</MobileQuery>
	);
}
