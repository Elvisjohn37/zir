import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import MoneyFormat from 'frontend/components/MoneyFormat';
import { isEmpty } from 'frontend/utils/helper';

function Default({ row }) {
	return (
		<LangDataProvider category="reports">
			<div>
				<FormattedMessage
					id="betAmount"
					values={{
						amount: (
							<MoneyFormat value={row.result.main_bet_amount ? row.result.main_bet_amount : row.stake} />
						),
					}}
				/>
			</div>

			{!isEmpty(row.result.side_bet_amount) && parseInt(row.result.side_bet_amount) != 0 && (
				<div>
					<FormattedMessage
						id="sideBetAmount"
						values={{
							amount: <MoneyFormat value={row.result.side_bet_amount} />,
						}}
					/>
				</div>
			)}

			{!isEmpty(row.result.stake_per_point) && parseInt(row.result.stake_per_point) != 0 && (
				<div>
					<FormattedMessage
						id="stakePerPoint"
						values={{
							amount: <MoneyFormat value={row.result.stake_per_point} />,
						}}
					/>
				</div>
			)}

			{!isEmpty(row.result.n) ? (
				<div>
					<FormattedMessage
						id="numberOfBets"
						values={{
							amount: row.result.n,
						}}
					/>
				</div>
			) : (
				row.result.event == 'R' && <div>--</div>
			)}

			{!isEmpty(row.result.Slot) && (
				<div>
					<FormattedMessage
						id="winningLines"
						values={{
							amount:
								row.result.Slot != 0 && row.result.Slot != '0'
									? row.result.Slot.split('|').length
									: '--',
						}}
					/>
				</div>
			)}

			{parseInt(row.result.gamble) === 1 && (
				<div>
					<FormattedMessage id="gamble" />
				</div>
			)}
		</LangDataProvider>
	);
}

export default function Description({ row }) {
	switch (row.descriptionFormat) {
		case 'noDescription':
			return <div>--</div>;

		case 'default':
			return <Default row={row} />;
	}
}
