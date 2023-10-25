import React from 'react';
import { getPlayerTransferList } from 'frontend/ajax/backend';

export default function usePlayerTransferList({ 
    isFetching, 
    setIsFetching, 
    date, 
    page, 
    setTransferListError 
}) {
    let [playerTransferList, setPlayerTransferList] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
	});

    React.useEffect(() => {
		if (isFetching) {
			getPlayerTransferList({
				date,
				page,
				success: (response) => {
                    setIsFetching(false);
					setPlayerTransferList({
						content: response.data.data.content,
						totalRow: response.data.data.totalRow,
						rowsPerPage: response.data.data.rowsPerPage,
					});
				},
				error: () => {
					setTransferListError(true);
                    setIsFetching(false);
				},
			});
		}
	}, [isFetching]);

    return playerTransferList;
}
