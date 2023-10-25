import React from 'react';
import { FormattedNumberParts } from 'react-intl';
import { isEmpty } from 'frontend/utils/helper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import styles from './MoneyFormat.module';

export default function MoneyFormat({ value, compactStart }) {
	compactStart = compactStart || 0;
	let isCompact = compactStart > 0 && value >= compactStart;

	return (
		<FormattedNumberParts value={value} style="currency" currency="USD">
			{() => moneyFormatter(value, isCompact)}
		</FormattedNumberParts>
	);
}

export function MoneyFormatToggle({ value, compactStart }) {
	let [isOpenFullAmount, setIsOpenFullAmount] = React.useState(false);

	let handleTooltipClose = () => {
		setIsOpenFullAmount(false);
	};

	let handleTooltipToggle = () => {
		setIsOpenFullAmount(isOpenFullAmount ? false : true);
	};

	return (
		<ClickAwayListener onClickAway={handleTooltipClose}>
			<span
				onClick={handleTooltipToggle}
				title={moneyFormatter(value, false)}
				className={value > compactStart ? styles.isCompact : ''}
			>
				<MoneyFormat value={value} compactStart={isOpenFullAmount ? 0 : compactStart} />
			</span>
		</ClickAwayListener>
	);
}

function compactFormat(num) {
	if (num >= 1000 && num < 1000000) {
		return { num: num / 1000, symbol: 'K' };
	} else if (num >= 1000000 && num < 1000000000) {
		return { num: num / 1000000, symbol: 'M' };
	} else if (num >= 1000000000 && num < 1000000000000) {
		return { num: num / 1000000000, symbol: 'B' };
	} else if (num >= 1000000000000 && num < 1000000000000000) {
		return { num: num / 1000000000000000, symbol: 'T' };
	} else {
		return { num: num, symbol: '' };
	}
}

function moneyFormatter(value, isCompact) {
	let compactSymbol = '';
	let formattedWithComma = Math.round(value * 100) / 100;

	if (isCompact) {
		let compactNumber = compactFormat(formattedWithComma);
		formattedWithComma = compactNumber.num;
		compactSymbol = compactNumber.symbol;
	}

	formattedWithComma = formattedWithComma.toString().split('.');
	formattedWithComma[0] = formattedWithComma[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	if (isEmpty(formattedWithComma[1])) {
		formattedWithComma[1] = '00';
	}

	if (!isEmpty(formattedWithComma[1])) {
		if (formattedWithComma[1].length == 1) {
			formattedWithComma[1] += 0;
		}

		if (formattedWithComma[1].length > 2) {
			formattedWithComma[1] = formattedWithComma[1].slice(0, 2);
		}
	}

	return formattedWithComma.join('.') + compactSymbol;
}
