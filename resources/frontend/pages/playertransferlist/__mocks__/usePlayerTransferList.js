import React from 'react';
import {
	getPlayerTransferList,
	setPlayerTransferListData,
	resetPlayerTransferListData,
	getPlayerTransferListData,
} from 'frontend/ajax/__mocks__/backend/getPlayerTransferList';

let mockedModule = jest.createMockFromModule('../usePlayerTransferList.js');

let usePlayerTransferListData;
let isProceedHook = true;

mockedModule.usePlayerTransferList = jest.fn(({ isFetching, setIsFetching, date, page, setTransferListError }) => {
	let [playerTransferList, setPlayerTransferList] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
	});

	if (!isProceedHook) {
		return playerTransferList;
	}

	React.useEffect(() => {
		if (isFetching) {
			getPlayerTransferList({
				date,
				page,
				success: (response) => {
					usePlayerTransferListData = response.data.data;
					setIsFetching(false);
					setPlayerTransferList(response.data.data);
				},
				error: () => {
					setTransferListError(true);
					setIsFetching(false);
				},
			});
		}
	}, [isFetching]);
	return playerTransferList;
});

function setUsePlayerTransferListData(data) {
	usePlayerTransferListData = { ...mockedModule.usePlayerTransferList, ...data };
}

function setIsProceedHook(isProceed) {
	isProceedHook = isProceed;
}

function resetUsePlayerTransferListData() {
	usePlayerTransferListData = {};
	resetPlayerTransferListData();
	isProceedHook = true;
}

function setUsePlayerTransferListResponse(result, data) {
	setPlayerTransferListData(result, data);
}

export default mockedModule.usePlayerTransferList;

export {
	setUsePlayerTransferListData,
	resetUsePlayerTransferListData,
	usePlayerTransferListData,
	setUsePlayerTransferListResponse,
	setIsProceedHook,
	getPlayerTransferListData,
};
