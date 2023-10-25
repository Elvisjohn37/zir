import React, { useState, useEffect } from 'react';
import { createTransparentImage } from 'frontend/utils/helper';
import styles from './Banner.module';
import Skeleton from 'frontend/components/Skeleton';
import { getBanners } from 'frontend/ajax/backend';
import Image from 'frontend/components/Image';
import { getRsoUrl } from 'frontend/utils/bannerHelper';
import { isMobileDevice } from 'frontend/utils/helper';
import BannerRedirect from './banner/BannerRedirect';
import Carousel from 'react-multi-carousel';
import MovingArrow from 'frontend/components/MovingArrow';

export default function Banner({
	type,
	imgWidth,
	imgHeight,
	imgProps,
	autoPlay,
	showIndicators,
	infiniteLoop,
	interval,
	langState,
	...otherProps
}) {
	let [isLoading, setIsLoading] = useState(true);
	let [banners, setBanners] = useState([]);
	let [bannerRso, setBannerRso] = useState();
	autoPlay = autoPlay == undefined ? true : autoPlay;
	showIndicators = showIndicators == undefined ? false : showIndicators;
	infiniteLoop = infiniteLoop == undefined ? true : infiniteLoop;
	interval = interval == undefined ? 6000 : interval;

	useEffect(() => {
		if (isLoading) {
			getBanners({
				type: type,
				isMobileDevice: isMobileDevice(),
				success: (response) => {
					setBannerRso(response.data.data.bannerRso);
					setBanners(response.data.data.banners);
					setIsLoading(false);
				},
				error: () => {
					setIsLoading(false);
				},
			});
		}
	}, [isLoading]);

	return isLoading ? (
		<div className={styles.placeholder}>
			<Skeleton className={styles.loader} />
			<img {...imgProps} className={styles.bannerImg} src={createTransparentImage(imgWidth, imgHeight)} />
		</div>
	) : (
		<>
			<Carousel
				autoPlay={autoPlay}
				autoPlaySpeed={interval}
				additionalTransfrom={0}
				containerClass={styles.carouselContainer}
				arrows
				centerMode={false}
				className=""
				draggable={false}
				swipeable={false}
				focusOnSelect={false}
				itemClass=""
				keyBoardControl
				minimumTouchDrag={80}
				partialVisible={false}
				pauseOnHover
				renderArrowsWhenDisabled={false}
				renderButtonGroupOutside={false}
				renderDotsOutside={false}
				infinite={infiniteLoop}
				responsive={{
					desktop: {
						breakpoint: {
							max: parseInt(styles.main_desktop),
							min: parseInt(styles.main_desktopLow),
						},
						items: 1,
					},
					tablet: {
						breakpoint: {
							max: parseInt(styles.main_tablet),
							min: parseInt(styles.main_tabletLow),
						},
						items: 1,
					},
					mobile: {
						breakpoint: {
							max: parseInt(styles.main_mobile),
							min: parseInt(styles.main_mobileLow),
						},
						items: 1,
					},
				}}
				rtl={false}
				showDots={showIndicators}
				slidesToSlide={1}
				customLeftArrow={<LeftArrow />}
				customRightArrow={<RightArrow />}
				{...otherProps}
			>
				{banners.map((banner, index) => (
					<div className={styles.bannerItem} key={index}>
						{banner.isPlayable ? (
							<BannerRedirect
								src={getRsoUrl(`${bannerRso}${banner.bannerImg}`, banner.type, langState.active)}
								scaleRatio={{ width: imgWidth, height: imgHeight }}
								gameID={banner.gameID}
								isCertified={banner.isCertified}
								isNewTab={banner.isNewTab}
								className={styles.bannerImg}
								imgProps={{ successClassName: styles.realImg }}
							/>
						) : (
							<Image
								src={getRsoUrl(`${bannerRso}${banner.bannerImg}`, banner.type, langState.active)}
								scaleRatio={{ width: imgWidth, height: imgHeight }}
								className={styles.bannerImg}
								imgProps={{ successClassName: styles.realImg }}
							/>
						)}
					</div>
				))}
			</Carousel>
		</>
	);
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
