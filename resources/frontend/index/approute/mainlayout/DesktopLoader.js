import React from 'react';
import Skeleton from 'frontend/components/Skeleton';
import classnames from 'classnames';
import styles from './DesktopLoader.module';

export default function DesktopLoader() {
	return (
		<>
			<header className={classnames([styles.header, styles.headerLoader])}>
				<div className={styles.container}>
					<Skeleton count={1} width={1} height={1} className={styles.headerSkeleton} />
				</div>
			</header>
			<section className={classnames([styles.body, styles.bodyLoader])}>
				<div className={styles.container}>
					<Skeleton count={1} width={1} height={1} className={styles.bodySkeleton} />
				</div>
			</section>
			<footer className={classnames([styles.footer, styles.footerLoader])}>
				<div className={styles.footerContainer}>
					<Skeleton count={1} width={1} height={1} className={styles.footerSkeleton} />
				</div>
			</footer>
		</>
	);
}
