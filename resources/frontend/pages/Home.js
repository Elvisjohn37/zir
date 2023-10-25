import React from 'react';
import styles from './Home.module';
import MainBanner from './home/MainBanner';
import { getHomeConfig, getBsiGames } from 'frontend/ajax/backend';
import { createBannerRsoUrl } from './home/helpers';
import { LangConsumer } from 'frontend/contexts/Language';
import { isEmpty, isMobileDevice } from 'frontend/utils/helper';
import ErrorBoundary from 'frontend/components/ErrorBoundary';

import NewGames from './home/NewGames';
import TopGames from './home/TopGames';
import Explore from './home/Explore';

let Home = () => {
	let [assets, setAssets] = React.useState({});
	let [rsoUrl, setRsoUrl] = React.useState('');
	let [topGames, setTopGames] = React.useState([]);
	let [newGames, setNewGames] = React.useState([]);
	let [gameTypes, setGameTypes] = React.useState([]);

	React.useEffect(() => {
		getHomeConfig({
			type: 'home',
			success: (response) => {
				let data = response.data.data;
				setRsoUrl(data.bannerRso);
				data &&
					setAssets({
						mainBanner: data.banners.mainBanner || [],
					});
			},
		});
		getBsiGames({
			type: 'home',
			isMobileDevice: isMobileDevice(),
			page: 'home',
			success: (response) => {
				let data = response.data.data;
				setTopGames(data.topGames);
				setNewGames(data.newGames);
				setGameTypes(data.gameTypes);
			},
		});
	}, []);

	return (
		<LangConsumer>
			{({ langState }) => (
				<div className={styles.home}>
					{/* Main banner component */}
					<div className={styles.homeMainBanner}>
						<MainBanner
							bsiBanner={
								createBannerRsoUrl({
									assets: assets.mainBanner || [],
									rsoUrl,
									lang: langState.active,
									type: 2,
								})[0] || {}
							}
							langState={langState}
							type="newGames"
						>
							{!isEmpty(newGames) && (
								<ErrorBoundary>
									<div className={styles.newGamesContainer}>
										<NewGames
											scaleRatio={{ width: 350, height: 150 }}
											newGames={newGames || []}
											langState={langState}
											className={styles.homeNewGames}
										/>
									</div>
								</ErrorBoundary>
							)}
						</MainBanner>
					</div>
					{/* Top Games Component */}
					<div className={styles.homeTopGames}>
						{!isEmpty(topGames) && (
							<ErrorBoundary>
								<div className={styles.topGamesContainer}>
									<TopGames
										scaleRatio={{ width: 300, height: 420 }}
										topGames={topGames || []}
										langState={langState}
										className={styles.homeTopGames}
									/>
								</div>
							</ErrorBoundary>
						)}
					</div>
					{/* Game Categories */}
					<div className={styles.homegameTypes}>
						{!isEmpty(gameTypes) && (
							<ErrorBoundary>
								<div className={styles.exploreContainer}>
									<Explore
										scaleRatio={{ width: 456, height: 315 }}
										exploreGames={gameTypes || []}
										className={styles.homeExplore}
									/>
								</div>
							</ErrorBoundary>
						)}
					</div>
				</div>
			)}
		</LangConsumer>
	);
};

export default Home;
