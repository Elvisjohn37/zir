import React from 'react';
import classnames from 'classnames';
import SkeletonLoading from 'react-skeleton-loading';
import styles from './Skeleton.module';

export default function Skeleton({ count, className, ...props }) {
	count = count || 1;
	let hasNoWidth = !props.width;
	let hasNoHeight = !props.height;

	return (
		<span
			className={classnames([
				styles.wrapper,
				className && className,
				hasNoWidth && styles.noWidth,
				hasNoHeight && styles.noHeight,
				count > 1 && styles.multi,
			])}
		>
			{Array.from({ length: count }, (item, index) => (
				<span className={styles.item} key={index}>
					<SkeletonLoading {...props} />
				</span>
			))}
		</span>
	);
}

export function SkeletonFull(props) {
	return <Skeleton {...props} className={styles.skeletonFull} />;
}
