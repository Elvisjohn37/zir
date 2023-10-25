import React from 'react';
import styles from './TopGames.module';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import Image from 'frontend/components/Image';
import MovingArrow from 'frontend/components/MovingArrow';
import { gameFileName } from 'frontend/utils/helper';
import { LangDataProvider } from 'frontend/components/Language';
import Spinner from 'frontend/components/Spinner';
import { FormattedMessage } from 'react-intl';

let TopGames = ({ topGames = [], scaleRatio, className = '' }) => {
	let responsive = {
		superLargeDesktop: {
			breakpoint: {
				max: parseInt(styles.main_superLargeDesktop),
				min: parseInt(styles.main_superLargeDesktopLow),
			},
			items: 7,
			partialVisibilityGutter: 20,
		},
		desktop: {
			breakpoint: {
				max: parseInt(styles.main_desktop),
				min: parseInt(styles.main_desktopLow),
			},
			items: 5,
			partialVisibilityGutter: 0,
		},
		tablet: {
			breakpoint: {
				max: parseInt(styles.main_tablet),
				min: parseInt(styles.main_tabletLow),
			},
			items: 4,
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
	};

	return (
		<LangDataProvider category="home" fallback={<Spinner />}>
			<div className={styles.topGames}>
				<div className={styles.title}>
					<FormattedMessage id="topGames" />
				</div>
				<div className={styles.gameList}>
					<Carousel
						additionalTransfrom={0}
						responsive={responsive}
						customLeftArrow={<MovingArrow className={styles.gameListMovingArrowLeft} />}
						customRightArrow={<MovingArrow className={styles.gameListMovingArrowRight} direction="right" />}
						infinite={false}
						rtl={false}
						showDots={false}
						slidesToSlide={1}
						swipeable
						focusOnSelect={false}
						itemClass={styles.imageContainer}
						className={className}
						keyBoardControl
						minimumTouchDrag={80}
						partialVisible={true}
						pauseOnHover
						renderArrowsWhenDisabled={false}
						renderButtonGroupOutside={false}
						renderDotsOutside={false}
						containerClass={styles.carouselContainerClass}
					>
						{topGames.map((newGame, index) => (
							<Image
								key={index}
								className={styles.topGamesImage}
								imgProps={{ draggable: false, partialVisible: false }}
								src={require(`frontend/assets/images/games/bsitopgames/${
									newGame.gameProviderID
								}_${gameFileName(newGame.gameName)}.jpg`)}
								scaleRatio={scaleRatio}
							/>
						))}
					</Carousel>
				</div>
			</div>
		</LangDataProvider>
	);
};

export default TopGames;
