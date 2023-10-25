import React from 'react';
import { getPlayerBetList, getPlayerPromoList } from 'frontend/ajax/backend';

export default function usePlayerBetList({
	isFetching,
	setIsFetching,
	date,
	page,
	productID,
	setIsPromoBettingListError,
	type,
}) {
	let [playerPromoBetList, setPlayerPromoBetList] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
		product: '',
	});

	React.useEffect(() => {
		if (isFetching) {
			if (type == 'betting') {
				getPlayerBetList({
					date,
					productID,
					page,
					success: (response) => {
						setPlayerPromoBetList(response.data.data);
						setIsFetching(false);
					},
					error: () => {
						setIsPromoBettingListError(true);
						setIsFetching(false);
					},
				});
			} else {
				getPlayerPromoList({
					date,
					page,
					success: (response) => {
						setPlayerPromoBetList(response.data.data);
						setIsFetching(false);
					},
					error: () => {
						setIsPromoBettingListError(true);
						setIsFetching(false);
					},
				});
			}
		}
	}, [isFetching]);

	return playerPromoBetList;
}
