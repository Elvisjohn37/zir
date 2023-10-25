import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import GameThumbnail from 'frontend/components/GameThumbnail';
import styles from './AllGame.module';
import { FormattedMessage } from 'react-intl';
import MovingArrow from 'frontend/components/MovingArrow';
import { AllGames as AllGamesIcon, AllGamesOutline } from 'frontend/components/Icons';
import MobileQuery from 'frontend/components/MobileQuery';
import classnames from 'classnames';

const DIVIDER_COUNT = 3;

export default function AllGameWithState(props) {
	return <MobileQuery>{(matches) => <AllGame {...props} matches={matches} />}</MobileQuery>;
}

function AllGame({ games, matches }) {
	let filteredGames = games.list;
	let filteredGameLength = filteredGames.length;

	let items = [];

	filteredGames.forEach((gameItem, index) => {
		let count = index + 1;
		let remainder = count % DIVIDER_COUNT;
		let isCutoff = remainder == 0;
		let isLastItem = count >= filteredGameLength;

		if (isCutoff || isLastItem) {
			items.push(
				<div className={styles.item} key={index}>
					{filteredGames.slice(count - (DIVIDER_COUNT - remainder), count).map((game, innerIndex) => (
						<GameThumbnail
							game={game}
							className={styles.gameThumbnail}
							index={index}
							gameType={game.gameTypeName}
							key={index + innerIndex}
							isDisplayFlag={true}
						/>
					))}
				</div>
			);
		}
	});

	return filteredGameLength > 0 ? (
		<div className={classnames([styles.container, matches ? styles.mobile : styles.desktop])}>
			<div className={styles.title}>
				{matches ? <AllGamesOutline className={styles.icon} /> : <AllGamesIcon className={styles.icon} />}
				<FormattedMessage id={'allGames'} />
				{matches && (
					<div className={styles.arrowSign}>
						<div className={styles.arrowContainer}>
							<MovingArrow className={styles.arrow} />
						</div>
						<div className={styles.arrowContainer}>
							<MovingArrow className={styles.arrow} direction="right" />
						</div>
					</div>
				)}
			</div>
			<div className={styles.carouselContainer}>
				<div className={styles.carousel}>
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
							renderArrowsWhenDisabled={true}
							renderButtonGroupOutside={false}
							renderDotsOutside={false}
							infinite={false}
							responsive={{
								superLargeDesktop: {
									breakpoint: {
										max: parseInt(styles.main_superLargeDesktop),
										min: parseInt(styles.main_superLargeDesktopLow),
									},
									items: 7,
									partialVisibilityGutter: 10,
								},
								desktop: {
									breakpoint: {
										max: parseInt(styles.main_desktop),
										min: parseInt(styles.main_desktopLow),
									},
									items: 5,
									partialVisibilityGutter: 20,
								},
								tablet: {
									breakpoint: {
										max: parseInt(styles.main_tablet),
										min: parseInt(styles.main_tabletLow),
									},
									items: 3,
									partialVisibilityGutter: 0,
								},
								mobile: {
									breakpoint: {
										max: parseInt(styles.main_mobile),
										min: parseInt(styles.main_mobileLow),
									},
									items: 3,
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
							{items}
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
