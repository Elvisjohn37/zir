import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
import { isObject, isEmpty, isString } from 'frontend/utils/helper';
import dataHandlers from 'frontend/components/reportbetformatter/__mocks__/dataHandlers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../ReportBetFormatter'));
const eventDescription = dataHandlers.getEventDescription();

mockedModules.BetLink = ({ ...props }) => {
	let { newProps } = transformProps(props);
	switch (props.row.betLinkFormat) {
		case 'noBetLink':
			return '';
		default:
			return (
				<div {...newProps} data-testid="BetLink" onClick={() => jest.fn()}>
					betDetails
				</div>
			);
	}
};

mockedModules.BetReason = ({ ...props }) => {
	let { newProps } = transformProps(props);
	switch (props.row.reasonFormat) {
		case 'resultReason':
			return (
				<div {...newProps} data-testid="BetReason">
					{' '}
					{props.row.result.resettled.reason}{' '}
				</div>
			);
		case 'messageReason':
			return (
				<div {...newProps} data-testid="BetReason">
					{props.row.message}
				</div>
			);

		case 'noReason':
			return '';
	}
};

mockedModules.TableName = ({ ...props }) => {
	let { newProps } = transformProps(props);
	let resultTableName = '';

	if (isObject(props.row.result) && !isEmpty(props.row.result.table)) {
		resultTableName = props.row.result.table;
	} else {
		resultTableName = props.row.result;
	}
	switch (props.row.tableNameFormat) {
		case 'promotion':
			return (
				<div {...newProps} data-testid="TableName">
					promotion
				</div>
			);
		case 'productName':
			return (
				<div {...newProps} data-testid="TableName">
					{props.row.productName}
				</div>
			);
		case 'resultTableName':
			return (
				<div {...newProps} data-testid="TableName">
					{resultTableName}
				</div>
			);
		case 'gameTableName':
			if (isString(resultTableName)) {
				return (
					<div {...newProps} data-testid="TableName">
						<div>{props.row.gameName}</div>
						<div>{resultTableName}</div>
					</div>
				);
			}
			return (
				<div {...newProps} data-testid="TableName">
					{' '}
					{props.row.gameName}
				</div>
			);
		case 'gameName':
			return (
				<div {...newProps} data-testid="TableName">
					{' '}
					{props.row.gameName}
				</div>
			);
	}
};

mockedModules.RoundID = ({ ...props }) => {
	let { newProps } = transformProps(props);
	switch (props.row.roundIDFormat) {
		case 'noRoundID':
			return '';
		case 'netwinAdjustment':
			return (
				<div {...newProps} data-testid="RoundID">
					netwinAdjustment
				</div>
			);
		case 'roundID':
			return (
				<div {...newProps} data-testid="RoundID">
					{props.row.gameID}
					{props.row.roundID}
				</div>
			);
		default:
			return (
				<div {...newProps} data-testid="RoundID">
					{props.row.gameID}
					{props.row.roundDetID}
				</div>
			);
	}
};

mockedModules.GameDetails = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="GameDetails">
			<span>{JSON.stringify(props.row)}</span>
			{props.row.addGameDetailsEndDateTime && props.row.dateTime}
		</div>
	);
};

mockedModules.GameResult = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="GameResult">
			{eventDescription[props.row.event]}
		</div>
	);
};

mockedModules.StakeTurnover = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="StakeTurnover">
			<div>{props.row.stake}</div>
			<div>{props.row.turnover}</div>
		</div>
	);
};

mockedModules.MembersWLCommision = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="MembersWLCommision">
			<div>{props.row.netwin}</div>
			<div>{props.row.commission}</div>
		</div>
	);
};

mockedModules.Amount = () => {
	return '--';
};

mockedModules.typeProduct = ({ ...props }) => {
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="typeProduct">
			<div>{props.row.transactionType}</div>
			<div>{props.row.productName}</div>
		</div>
	);
};

module.exports = mockedModules;
