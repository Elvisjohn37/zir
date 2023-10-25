import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import LazyLoad from 'react-lazyload';
import { isPlainObject } from 'lodash';
import { createTransparentImage } from 'frontend/utils/helper';
import Spinner from 'frontend/components/Spinner';
import styles from './Video.module';

function LoadingAnimation({ placeholder }) {
	return <div className={styles.lazyPlaceholder}>{placeholder ? placeholder : <Spinner />}</div>;
}

function Video({ src, scaleRatio, videoProps, className, placeholder, onLoad, onEnded }) {
	let [isError, setIsError] = useState(false);
	let [isLoading, setIsLoading] = useState(true);
	videoProps = videoProps || {};

	useEffect(() => {
		if(!isLoading) onLoad && onLoad();
	}, [isLoading]);

	return (
		<div
			className={classnames([
				styles.videoWrapper,
				className,
				isLoading && styles.isLoading,
				isError && styles.isError,
			])}
		>
			{isPlainObject(scaleRatio) && (
				<img
					{...videoProps}
					data-id="placeholder"
					className={classnames([styles.placeholder, videoProps.className])}
					src={createTransparentImage(scaleRatio.width, scaleRatio.height)}
				/>
			)}

			<LazyLoad
				offset={document.body.scrollHeight}
				placeholder={<LoadingAnimation placeholder={placeholder} />}
				once
			>
				{isLoading && <LoadingAnimation placeholder={placeholder} />}
				{src && (
                    <video 
						autoPlay 
						muted 
						onEnded={onEnded} 
						onLoadStart={ () => setIsLoading(true) } 
						onLoadedData={ () => setIsLoading(false) } 
						onError={ () => setIsError(true) }
					>
                        <source
                            {...videoProps}
                            type="video/webm"
                            data-id="realImage"
                            src={src}
                            className={classnames([
                                styles.videoTag,
                                videoProps.className,
                                isPlainObject(scaleRatio) && styles.hasRatio,
                            ])}
                        />
                    </video>
				)}
			</LazyLoad>
		</div>
	);
}

export default Video;
