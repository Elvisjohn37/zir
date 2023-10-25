import React from 'react';
import IconButton from '@mui/material/IconButton';
import styles from './IconButtonLabeled.module';
import Skeleton from 'frontend/components/Skeleton';

export default function IconButtonLabeled({ icon: Icon, children, ...props }) {
	return (
		<IconButton color="primary" className={styles.button} {...props}>
			<div className={styles.contentWrapper}>
				<div className={styles.icon}>
					<Icon />
				</div>
				<div className={styles.label}>{children}</div>
			</div>
		</IconButton>
	);
}

export function Loader() {
	return (
		<div className={styles.loader}>
			<div className={styles.contentWrapper}>
				<div className={styles.icon}>
					<Skeleton className={styles.skeletonIcon} />
				</div>
				<div className={styles.label}>
					<Skeleton className={styles.skeletonLabel} />
				</div>
			</div>
		</div>
	);
}
