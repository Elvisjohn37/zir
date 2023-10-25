import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from './DesktopCarousel.module';
import { TopGameThumbnailContainer } from 'frontend/components/GameThumbnail';

export default function DesktopCarousel({ filteredGames }) {
	return (
		<div className={styles.carousel}>
			<Carousel
				additionalTransfrom={0}
				arrows={false}
				centerMode={false}
				className=""
				containerClass={styles.containerClass}
				draggable
				focusOnSelect={false}
				itemClass=""
				keyBoardControl
				minimumTouchDrag={80}
				partialVisible
				pauseOnHover
				renderArrowsWhenDisabled={false}
				renderButtonGroupOutside={false}
				renderDotsOutside={false}
				infinite={false}
				responsive={{
					superLargeDesktop: {
						breakpoint: {
							max: parseInt(styles.main_superLargeDesktop),
							min: parseInt(styles.main_superLargeDesktopLow),
						},
						items: 4,
						partialVisibilityGutter: 70,
					},
					desktop: {
						breakpoint: {
							max: parseInt(styles.main_desktop),
							min: parseInt(styles.main_desktopLow),
						},
						items: 3,
						partialVisibilityGutter: 50,
					},
					tablet: {
						breakpoint: {
							max: parseInt(styles.main_tablet),
							min: parseInt(styles.main_tabletLow),
						},
						items: 3,
						partialVisibilityGutter: 30,
					},
					mobile: {
						breakpoint: {
							max: parseInt(styles.main_mobile),
							min: parseInt(styles.main_mobileLow),
						},
						items: 3,
						partialVisibilityGutter: 30,
					},
				}}
				rtl={false}
				showDots={false}
				slidesToSlide={1}
				swipeable
			>
				{filteredGames.map((game, index) => {
					return <TopGameThumbnailContainer key={index} game={game} index={index} />;
				})}
			</Carousel>
		</div>
	);
}
