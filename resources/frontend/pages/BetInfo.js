import React from 'react';
import { windowResponse } from 'frontend/utils/helper';
import { ErrorPage } from 'frontend/components/OnPageError';
import { useParams } from 'react-router-dom';
import BetInfoIframe from './betinfo/BetInfoIframe';
import lodash from 'lodash';

const BET_INFO_IFRAME = ['eyecon', 'funky'];

export default function BetInfo() {
	let response = windowResponse();
	let { type } = useParams();

	return response.result === true && lodash.includes(BET_INFO_IFRAME, type) ? (
		<BetInfoIframe type={type} />
	) : (
		<ErrorPage />
	);
}
