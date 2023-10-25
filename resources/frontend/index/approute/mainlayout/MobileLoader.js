import React from 'react';
import styles from './MobileLoader.module';
import Spinner from 'frontend/components/Spinner';

export default function MobileLoader() {
	return (
		<div className={styles.mobileLoader}>
			<Spinner />
		</div>
	);
}
