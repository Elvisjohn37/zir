import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import classnames from 'classnames';
import styles from './SeamlessIframe.module';
import { useWindowWidth } from '@react-hook/window-size';

function iframeAdjustmentToFit(iframe) {
	let iframeWidth = iframe.clientWidth;
	let iframeHeight = iframe.clientHeight;
	let parentWidth = iframe.parentNode.clientWidth;

	if (iframeWidth > parentWidth) {
		var scale = parentWidth / iframeWidth;

		let newHeight = iframeHeight * scale;
		let heightDiff = (iframeHeight - newHeight) / 2;
		let widthDiff = (iframeWidth - iframeWidth * scale) / 2;

		return {
			scale: scale,
			marginTop: 0 - heightDiff,
			marginLeft: 0 - widthDiff,
			parentHeight: newHeight,
		};
	} else {
		return {
			scale: 1,
			marginTop: false,
			marginLeft: false,
		};
	}
}

export default React.forwardRef(function CustomIframe(
	{ width, iframeHolderClassName, iframeClassName, onLoad, ...props },
	ref
) {
	let [iframeScale, setiframeScale] = useState(1);
	let [iframeMarginTop, setIframeMarginTop] = useState(false);
	let [iframeMarginLeft, setIframeMarginLeft] = useState(false);
	let [iframeParentHeight, setIframeParentHeight] = useState(false);
	let [isMounted, setIsMounted] = useState(false);
	let iframeRef = useRef();
	let iframeHolderRef = useRef();
	let windowWidth = useWindowWidth();

	useImperativeHandle(ref, () => ({
		resize: () => {
			let iframeAdjustment = iframeAdjustmentToFit(iframeHolderRef.current);
			setiframeScale(iframeAdjustment.scale);
			setIframeMarginTop(iframeAdjustment.marginTop);
			setIframeMarginLeft(iframeAdjustment.marginLeft);
			setIframeParentHeight(iframeAdjustment.parentHeight);
		},
	}));

	useEffect(() => {
		if (isMounted) {
			ref.current.resize();
		} else {
			setIsMounted(true);
		}
	}, [windowWidth]);

	return (
		<div className={styles.parent} style={{ height: iframeParentHeight && `${iframeParentHeight}px` }}>
			<div
				className={classnames([iframeHolderClassName, styles.iframeHolder])}
				style={{
					transform: `scale(${iframeScale})`,
					marginTop: iframeMarginTop && `${iframeMarginTop}px`,
					marginLeft: iframeMarginLeft && `${iframeMarginLeft}px`,
					width: width,
				}}
				ref={iframeHolderRef}
			>
				<iframe
					{...props}
					className={classnames([styles.iframe, iframeClassName])}
					onLoad={onLoad ? onLoad : ref.current.resize}
					ref={iframeRef}
				/>
			</div>
		</div>
	);
});
