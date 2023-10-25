import React from 'react';
import styles from './MainBanner.module';
import Image from 'frontend/components/Image';
import bsiBannerBackground from 'frontend/assets/images/home/bsiBackground.svg';
import Spinner from 'frontend/components/Spinner';

let MainBanner = ({ children = null, bsiBanner = {} }) => {
	return (
		<div className={styles.mainBanner}>
			<div className={styles.bannerContainer}>
				<Image
					className={styles.bsiBannerBackground}
					src={bsiBannerBackground}
					scaleRatio={{ width: 1920, height: 632 }}
					placeholder={<Spinner />}
				/>
				<Image className={styles.bsiBanner} src={bsiBanner.bannerImg} placeholder={<Spinner />} />
			</div>
			<div className={styles.mainBannerGameList}>{children}</div>
		</div>
	);
};

export default MainBanner;
