import React from 'react';
import Skeleton from 'frontend/components/Skeleton';
import styles from './GameRulesLoader.module';

export default function GameRulesLoader() {
	return (
		<>
			<div className={styles.block}>
				<Skeleton height={36} width={250} className={styles.skeleton} />
				<div className={styles.paragraph}>
					<Skeleton height={20} width={624} className={styles.skeleton} />
					<Skeleton height={20} width={624} className={styles.skeleton} />
					<Skeleton height={20} width={500} className={styles.skeleton} />
				</div>
			</div>
			<div className={styles.block}>
				<Skeleton height={36} width={250} className={styles.skeleton} />
				<div className={styles.paragraph}>
					<Skeleton height={20} width={524} className={styles.skeleton} />
					<Skeleton height={20} width={624} className={styles.skeleton} />
					<Skeleton height={20} width={420} className={styles.skeleton} />
				</div>
			</div>
		</>
	);
}
