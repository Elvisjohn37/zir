import React from 'react';
import styles from './Mobile.module';
import Announcement from 'frontend/components/Announcement';
import BottomNavigation from './mobile/BottomNavigation';

export default function Mobile({ children }) {
	return (
		<>
			<Announcement viewType="playerSite" isMobile={true} />
			<div className={styles.mobileWrapper}>{children}</div>
			<BottomNavigation />
		</>
	);
}
