import React from 'react';
import { FormattedMessage } from 'react-intl';
import lodash from 'lodash';

export default function Default({ match }) {
	let splitUrl = match.url.split('/');
	let lastSegment = splitUrl.pop();
	return (
		<FormattedMessage
			id={lodash.camelCase(lastSegment)}
			defaultMessage={lodash.startCase(lastSegment.replaceAll('-', ' '))}
		/>
	);
}
