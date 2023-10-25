import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { isPlainObject } from 'lodash';
import { createTransparentImage } from 'frontend/utils/helper';
import styles from './Image.module';
import broken from 'frontend/assets/images/image/broken.png';
import { loadImage } from 'frontend/utils/helper';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'frontend/components/Skeleton';

function LoadingAnimation({ placeholder }) {
	return (
		<div className={styles.lazyPlaceholder}>
			{placeholder ? placeholder : <Skeleton className={styles.loadingSkeleton} />}
		</div>
	);
}

function Image({
	src,
	scaleRatio,
	imgProps,
	className,
	onLoad,
	onLoadSuccess,
	placeholder,
	onLoadFail,
	onLoadClassName,
	isLazy,
}) {
	let [isError, setIsError] = useState(false);
	let [isLoading, setIsLoading] = useState(true);
	let [isLazyLoaded, setIsLazyLoaded] = useState(false);
	imgProps = imgProps || {};

	useEffect(() => {
		setIsLoading(true);
		isError && setIsError(false);
		if (src) {
			loadImage(
				src,
				() => {
					setIsLoading(false);
				},
				() => {
					!isError && setIsError(true);
					setIsLoading(false);
				}
			);
		}
	}, [src]);

	useEffect(() => {
		if (!isLoading) {
			onLoad && onLoad();
			!isError ? onLoadSuccess && onLoadSuccess() : onLoadFail && onLoadFail();
		}
	}, [isLoading]);

	return (
		<div
			className={classnames([
				styles.imageWrapper,
				className,
				isLoading && styles.isLoading,
				isError && styles.isError,
				!isLoading && (isLazyLoaded || isLazy == false) && onLoadClassName,
			])}
		>
			{isPlainObject(scaleRatio) && (
				<img
					{...imgProps}
					data-id="placeholder"
					className={classnames([styles.placeholder, imgProps.className])}
					src={createTransparentImage(scaleRatio.width, scaleRatio.height)}
				/>
			)}

			{isLoading && <LoadingAnimation placeholder={placeholder} />}
			{src &&
				(isLazy === false ? (
					<img
						{...imgProps}
						data-id="realImage"
						src={isError ? broken : src}
						className={classnames([
							styles.imgTag,
							imgProps.className,
							isError ? imgProps.errorClassName : imgProps.successClassName,
							isPlainObject(scaleRatio) && styles.hasRatio,
						])}
					/>
				) : (
					<>
						{!isLazyLoaded && <LoadingAnimation placeholder={placeholder} />}
						<LazyLoadImage
							{...imgProps}
							beforeLoad={() => setIsLazyLoaded(false)}
							afterLoad={() => setIsLazyLoaded(true)}
							data-id="realImage"
							src={isError ? broken : src}
							threshold={1}
							className={classnames([
								styles.imgTag,
								imgProps.className,
								isError ? imgProps.errorClassName : imgProps.successClassName,
								isPlainObject(scaleRatio) && styles.hasRatio,
							])}
						/>
					</>
				))}
		</div>
	);
}

export default Image;
