import React from 'react';
import styles from './NewGames.module';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import Image from 'frontend/components/Image';
import MovingArrow from 'frontend/components/MovingArrow';
import { gameFileName } from 'frontend/utils/helper';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import Button from '@mui/material/Button';
import Spinner from 'frontend/components/Spinner';

let NewGames = ({ newGames = [], scaleRatio, className = '' }) => {
	let responsive = {
		superLargeDesktop: {
			breakpoint: {
				max: parseInt(styles.main_superLargeDesktop),
				min: parseInt(styles.main_superLargeDesktopLow),
			},
			items: 4,
			partialVisibilityGutter: 0,
		},
		desktop: {
			breakpoint: {
				max: parseInt(styles.main_desktop),
				min: parseInt(styles.main_desktopLow),
			},
			items: 2,
			partialVisibilityGutter: 100,
		},
		tablet: {
			breakpoint: {
				max: parseInt(styles.main_tablet),
				min: parseInt(styles.main_tabletLow),
			},
			items: 2,
			partialVisibilityGutter: 0,
		},
		mobile: {
			breakpoint: {
				max: parseInt(styles.main_mobile),
				min: parseInt(styles.main_mobileLow),
			},
			items: 2,
			partialVisibilityGutter: 0,
		},
	};

	let description = {
		title: 'newGames',
		contents: ['newGamesContent1', 'newGamesContent2'],
		action: 'letsPlay',
	};

	return (
		<div className={styles.newGames}>
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
					{newGames.map((newGame, index) => (
						<Image
							key={index}
							className={styles.newGamesImage}
							imgProps={{ draggable: false, partialVisible: false }}
							src={require(`frontend/assets/images/games/thumbnail/${newGame.gameProviderID}_${gameFileName(
								newGame.gameName
							)}.jpg`)}
							scaleRatio={scaleRatio}
						/>
					))}
				</Carousel>
			</div>
			<div className={styles.gameDescription}>
				<LangDataProvider category="home" fallback={<Spinner />}>
					<div className={classnames([styles.title])}>
						<FormattedMessage id={description.title} />
					</div>
					<div className={styles.content}>
						{description.contents.map((content, index) => (
							<span key={index}>
								<FormattedMessage id={content} />
							</span>
						))}
					</div>
					<div className={styles.action}>
						<Button className={styles.gameListDescriptionButton}>
							<FormattedMessage id={description.action} />
						</Button>
					</div>
				</LangDataProvider>
			</div>
		</div>
	);
};

export default NewGames;
