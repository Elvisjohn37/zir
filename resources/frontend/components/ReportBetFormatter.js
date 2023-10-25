import React from 'react';
import { isObject, isEmpty, isString } from 'frontend/utils/helper';
import { FormattedMessage } from 'react-intl';
import dataHandlers from './reportbetformatter/dataHandlers';
import MoneyFormat from 'frontend/components/MoneyFormat';
import { DateTime } from 'frontend/components/ReportCommonFormatter';
import styles from './ReportBetFormatter.module';

const eventDescription = dataHandlers.getEventDescription();

function BetLink({ row }) {
	switch (row.betLinkFormat) {
		case 'noBetLink':
			return '';
		default:
			return (
				<div>
					<a
						onClick={() => {
							//create bet details request passing transaction detID
							window.open(
								'/betdetails?betID=' + row.transactionDetID,
								'account_window',
								'width = 670, height = 800'
							);
						}}
					>
						<FormattedMessage id="betDetails" />
					</a>
				</div>
			);
	}
}

function BetReason({ row }) {
	switch (row.reasonFormat) {
		case 'resultReason':
			return <div> {row.result.resettled.reason} </div>;
		case 'messageReason':
			return (
				<div>
					<FormattedMessage
						id="reason"
						values={{
							message: row.message,
						}}
					/>
				</div>
			);

		case 'noReason':
			return '';
	}
}

function TableName({ row }) {
	let resultTableName = '';

	if (isObject(row.result) && !isEmpty(row.result.table)) {
		resultTableName = row.result.table;
	} else {
		resultTableName = row.result;
	}
	switch (row.tableNameFormat) {
		case 'promotion':
			return <FormattedMessage id="promotion" />;
		case 'productName':
			return <div>{row.productName}</div>;
		case 'resultTableName':
			return <div>{resultTableName}</div>;
		case 'gameTableName':
			if (isString(resultTableName)) {
				return (
					<>
						<div>{row.gameName}</div>
						<div>{resultTableName}</div>
					</>
				);
			}
			return <div>{row.gameName}</div>;
		case 'gameName':
			return <div>{row.gameName}</div>;
	}
}

function RoundID({ row }) {
	switch (row.roundIDFormat) {
		case 'noRoundID':
			return '';
		case 'netwinAdjustment':
			return <FormattedMessage id="netwinAdjustment" />;
		case 'roundID':
			return (
				<div>
					{row.gameID}
					{row.roundID}
				</div>
			);
		default:
			return (
				<div>
					{row.gameID}
					{row.roundDetID}
				</div>
			);
	}
}

export function GameDetails({ row }) {
	return (
		<div className={styles.gameDetails}>
			<TableName row={row} />
			<RoundID row={row} />
			<BetLink row={row} />
			<BetReason row={row} />
			{row.addGameDetailsEndDateTime && <DateTime dateTime={row.dateTime} newLine={false} />}
		</div>
	);
}

export function GameResult({ row }) {
	return <FormattedMessage id={eventDescription[row.event]} />;
}

export function StakeTurnover({ row }) {
	return (
		<>
			<div>
				<MoneyFormat value={row.stake} />
			</div>
			<div>
				<MoneyFormat value={row.turnover} />
			</div>
		</>
	);
}

export function MembersWLCommision({ row }) {
	return (
		<>
			<div>
				<MoneyFormat value={row.netwin} />
			</div>
			<div>
				<MoneyFormat value={row.commission} />
			</div>
		</>
	);
}

export function Amount() {
	return '--';
}

export function typeProduct({ row }) {
	return (
		<>
			<div>{row.transactionType}</div>
			<div>{row.productName}</div>
		</>
	);
}
