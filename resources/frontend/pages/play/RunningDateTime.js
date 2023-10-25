import React, { useState, useEffect } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

export default function RunningDateTime() {
	let [dateTime, setDateTime] = useState(new Date().toLocaleString());

	useEffect(() => {
		let timeOut = setTimeout(() => {
			setDateTime(new Date().toLocaleString());
		}, 10000);

		return () => {
			clearTimeout(timeOut);
		};
	});

	return (
		<>
			<FormattedDate value={new Date(dateTime)} />{' '}
			<FormattedTime value={new Date(dateTime)} hour12={false} timeZoneName="short" />
		</>
	);
}
