import React from 'react';
import {
	getPlayerPromoList,
	getPlayerBetList,
	setPlayerBetListData,
	resetPlayerBetListData,
	getPlayerBetListData,
} from 'frontend/ajax/__mocks__/backend';

let mockedModule = jest.createMockFromModule('../usePlayerBetList.js');

let usePlayerBetListData;
let isProceedHook = true;

mockedModule.usePlayerBetList = jest.fn(
	({ isFetching, setIsFetching, date, page, setIsPromoBettingListError, type, productID }) => {
		let [playerPromoBetList, setPlayerPromoBetList] = React.useState({
			content: [],
			totalRow: [],
			rowsPerPage: 0,
			product: '',
		});

		if (!isProceedHook) {
			return playerPromoBetList;
		}

		React.useEffect(() => {
			if (isFetching) {
				if (type == 'betting') {
					getPlayerBetList({
						date,
						productID,
						page,
						success: (response) => {
							setIsFetching(false);
							usePlayerBetListData = response.data.data;
							setPlayerPromoBetList(response.data.data);
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
							setIsFetching(false);
							usePlayerBetListData = response.data.data;
							setPlayerPromoBetList(response.data.data);
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
);

function setIsProceedHook(isProceed) {
	isProceedHook = isProceed;
}

function setUsePlayerBetListData(data) {
	usePlayerBetListData = { ...data };
}

function resetUsePlayerBetListData() {
	usePlayerBetListData = {};
	resetPlayerBetListData();
	isProceedHook = true;
}

function setUsePlayerBetListResponse(result, data) {
	setPlayerBetListData(result, data);
}

export default mockedModule.usePlayerBetList;

export {
	setUsePlayerBetListData,
	resetUsePlayerBetListData,
	usePlayerBetListData,
	setUsePlayerBetListResponse,
	setIsProceedHook,
	getPlayerBetListData,
};
