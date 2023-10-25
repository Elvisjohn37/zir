import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import MoneyFormat from 'frontend/components/MoneyFormat';

function DateTime({ dateTime, newLine }) {
	if (newLine) {
		return (
			<div>
				<FormattedDate value={dateTime} />
				<br />
				<FormattedTime hour="numeric" minute="numeric" second="numeric" value={dateTime} />
			</div>
		);
	}
	return (
		<div>
			<FormattedDate value={dateTime} />{' '}
			<FormattedTime hour="numeric" minute="numeric" second="numeric" value={dateTime} />
		</div>
	);
}

function Date({ date }) {
	return <FormattedDate value={date} />;
}

function DateRange({ row }) {
	return (
		<>
			<FormattedDate month="short" day="2-digit" value={row.startDate} />
			{' - '}
			<FormattedDate day="2-digit" value={row.endDate} /> <FormattedDate year="numeric" value={row.endDate} />
		</>
	);
}

export function GrossRake({ row }) {
	return <MoneyFormat value={parseFloat(row.grossRake)} />;
}
export { DateTime, Date, DateRange };
