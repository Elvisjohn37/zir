import React from 'react';
import { StackedCarousel, ResponsiveContainer } from 'react-stacked-center-carousel';
import { TopGameThumbnailContainer } from 'frontend/components/GameThumbnail';
import styles from './MobileCarousel.module';
import classnames from 'classnames';

export default function ResponsiveCarousel({ filteredGames }) {
	let ref = React.useRef();

	return (
		<div className={styles.carousel}>
			<ResponsiveContainer
				carouselRef={ref}
				render={(parentWidth, carouselRef) => {
					return (
						<StackedCarousel
							ref={carouselRef}
							slideComponent={Card}
							slideWidth={parentWidth / 1.4}
							carouselWidth={parentWidth}
							data={filteredGames}
							currentVisibleSlide={3}
							maxVisibleSlide={3}
							fadeDistance={0.15}
							customScales={[1, 0.75, 0.75]}
							useGrabCursor
						/>
					);
				}}
			/>
		</div>
	);
}

const Card = React.memo(function Card(props) {
	let { data, dataIndex, isCenterSlide, swipeTo, slideIndex } = props;

	// 1 is still the first, but we will reverse index 1 to 9 to make it rtl
	let reverseIndex = dataIndex == 0 ? dataIndex : data.length - dataIndex;

	return (
		<div
			className={classnames([styles.card, isCenterSlide ? styles.active : styles.inactive])}
			onClick={() => !isCenterSlide && swipeTo(slideIndex)}
		>
			<TopGameThumbnailContainer game={data[reverseIndex]} index={reverseIndex} isDisableClick={!isCenterSlide} />
		</div>
	);
});
