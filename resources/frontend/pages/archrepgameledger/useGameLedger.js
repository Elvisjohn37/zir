import React from 'react';
import { getGameLedgerReport } from 'frontend/ajax/backend';
import { toDateTimeString } from 'frontend/utils/helper';

export default function useGameLedger({ 
    isFetching, 
    setIsFetching, 
    page, 
    date,
	setIsMounted,
	setGameLedgerError,
	setDateRange,
	isMounted
}) {
    let [gameLedger, setGameLedger] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
	});

    React.useEffect(() => {
		if (isFetching) {
			getGameLedgerReport({
				data: {
					date: toDateTimeString(date),
					page,
					showConfig: !isMounted,
				},
				success: (response) => {
					setIsFetching(false);
					setGameLedgerError(false);
					setGameLedger(response.data.data);
					if (!isMounted) {
						setDateRange({
							isLoading: false,
							range: response.data.data.dateRange,
						});
					}
					setIsMounted(true);
				},
				error: () => {
					setGameLedgerError(true);
					setIsFetching(false);
				}
			});
		}
	}, [isFetching]);

    return gameLedger;
}
