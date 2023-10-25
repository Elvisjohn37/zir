import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import GameThumbnail from 'frontend/components/GameThumbnail';
import styles from './RecentGame.module';
import { FormattedMessage } from 'react-intl';
import HistoryIcon from '@mui/icons-material/History';
import MovingArrow from 'frontend/components/MovingArrow';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';
import MobileQuery from 'frontend/components/MobileQuery';

const SCREEN_ITEMS = {
	mobile: 3,
	tablet: 3,
	desktop: 5,
	superLargeDesktop: 7,
};

function RecentGame({ games, isMobile, isTablet, isDesktop, matches }) {
	let filteredGames = [];
	let recentGamesCacheRaw = games.recentGames;

	if (recentGamesCacheRaw != '') {
		let recentGamesCache = recentGamesCacheRaw.split(';');
		let recentGameLength = recentGamesCache.length;

		for (var i = 0; i < recentGameLength; i++) {
			let recentGameID = recentGamesCache[i];

			if (recentGameID != '') {
				let recentGameDetails = games.list.find((game) => {
					return game.gameID == recentGameID;
				});

				if (recentGameDetails) {
					filteredGames.push(recentGameDetails);
				}
			}
		}
	}

	let visibleItems = isMobile
		? SCREEN_ITEMS.mobile
		: isTablet
		? SCREEN_ITEMS.tablet
		: isDesktop
		? SCREEN_ITEMS.desktop
		: SCREEN_ITEMS.superLargeDesktop;
	let isDisplayArrows = visibleItems < filteredGames.length;

	return filteredGames.length > 0 ? (
		<div className={classnames([styles.container, matches ? styles.mobile : styles.desktop])}>
			<div className={styles.title}>
				<HistoryIcon className={styles.icon} />
				<FormattedMessage id={'recentTitle'} />
			</div>
			<div className={styles.carouselContainer}>
				<div className={classnames([styles.carousel, !isDisplayArrows && styles.carouselFix])}>
					<div className={styles.carouselContent}>
						<Carousel
							additionalTransfrom={0}
							arrows={!matches}
							centerMode={false}
							className=""
							containerClass={styles.carouselContainerClass}
							draggable
							focusOnSelect={false}
							itemClass=""
							keyBoardControl
							minimumTouchDrag={80}
							partialVisible={!matches}
							pauseOnHover
							renderArrowsWhenDisabled={isDisplayArrows}
							renderButtonGroupOutside={false}
							renderDotsOutside={false}
							infinite={false}
							responsive={{
								superLargeDesktop: {
									breakpoint: {
										max: parseInt(styles.main_superLargeDesktop),
										min: parseInt(styles.main_superLargeDesktopLow),
									},
									items: SCREEN_ITEMS.superLargeDesktop,
									partialVisibilityGutter: 70,
								},
								desktop: {
									breakpoint: {
										max: parseInt(styles.main_desktop),
										min: parseInt(styles.main_desktopLow),
									},
									items: SCREEN_ITEMS.desktop,
									partialVisibilityGutter: 20,
								},
								tablet: {
									breakpoint: {
										max: parseInt(styles.main_tablet),
										min: parseInt(styles.main_tabletLow),
									},
									items: SCREEN_ITEMS.tablet,
									partialVisibilityGutter: 0,
								},
								mobile: {
									breakpoint: {
										max: parseInt(styles.main_mobile),
										min: parseInt(styles.main_mobileLow),
									},
									items: SCREEN_ITEMS.mobile,
									partialVisibilityGutter: 0,
								},
							}}
							rtl={false}
							showDots={false}
							slidesToSlide={1}
							swipeable
							customLeftArrow={<LeftArrow />}
							customRightArrow={<RightArrow />}
						>
							{filteredGames.map((game, index) => {
								return (
									<GameThumbnail
										game={game}
										className={styles.gameThumbnail}
										index={index}
										gameType={game.gameTypeName}
										key={index}
									/>
								);
							})}
						</Carousel>
					</div>
				</div>
			</div>
		</div>
	) : null;
}

function LeftArrow({ onClick }) {
	return (
		<div className={styles.leftArrow} onClick={onClick}>
			<div className={styles.movingArrowContainer}>
				<MovingArrow className={styles.movingArrow} />
			</div>
		</div>
	);
}

function RightArrow({ onClick }) {
	return (
		<div className={styles.rightArrow} onClick={onClick}>
			<div className={styles.movingArrowContainer}>
				<MovingArrow className={styles.movingArrow} direction="right" />
			</div>
		</div>
	);
}

export default function RecentGameWithState({ games }) {
	return (
		<MobileQuery>
			{(matches) => (
				<MediaQuery maxWidth={styles.main_mobile}>
					{(isMobile) => (
						<MediaQuery maxWidth={styles.main_tablet}>
							{(isTablet) => (
								<MediaQuery maxWidth={styles.main_desktop}>
									{(isDesktop) => (
										<RecentGame
											games={games}
											isMobile={isMobile}
											isTablet={isTablet}
											isDesktop={isDesktop}
											matches={matches}
										/>
									)}
								</MediaQuery>
							)}
						</MediaQuery>
					)}
				</MediaQuery>
			)}
		</MobileQuery>
	);
}
