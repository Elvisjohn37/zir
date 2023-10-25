import React from 'react';
import { getPlayerCreditList } from 'frontend/ajax/backend';

export default function usePlayerCreditList({ 
	isFetching, 
    setIsFetching, 
    date, 
    page, 
    setCreditListError 
}) {
    let [playerCreditList, setPlayerCreditList] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
	});

    React.useEffect(() => {
        if (isFetching) {
			getPlayerCreditList({
				date,
				page,
				success: (response) => {
                    setIsFetching(false);
					setPlayerCreditList(response.data.data);
				},
				error: () => {
					setCreditListError(true);
                    setIsFetching(false);
				},
			});
		}
    }, [isFetching]);

    return playerCreditList;
}
