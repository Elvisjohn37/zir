import React, { useEffect, useState, useRef } from 'react';
import Spinner from 'frontend/components/Spinner';
import styles from './BetInfoIframe.module';
import SeamlessIframe from 'frontend/components/SeamlessIframe';
import { windowResponse } from 'frontend/utils/helper';
import classnames from 'classnames';

const IFRAME_SIZE = {
	eyecon: {
		width: 400,
		height: 600,
	},

	funky: {
		width: 387,
		height: 635,
	},
};

const WINDOW_SIZE = {
	eyecon: {
		width: 410,
		height: 605,
	},
	funky: {
		width: 400,
		height: 700,
	},
};

export default function BetInfoIframe({ type }) {
	let iframeRef = useRef();
	let response = windowResponse();
	let [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		window.resizeTo(WINDOW_SIZE[type].width, WINDOW_SIZE[type].height);
	});

	return (
		<div className={classnames([styles.betInfoIframe, styles[type]])}>
			{isLoading && <Spinner color="primary" className={styles.iframeSpinner} />}
			<SeamlessIframe
				width={IFRAME_SIZE[type].width}
				height={IFRAME_SIZE[type].height}
				scrolling="1"
				src={response.data.data.url}
				ref={iframeRef}
				onLoad={() => setIsLoading(false)}
			></SeamlessIframe>
		</div>
	);
}
