import React from 'react';
import {
	getPlayerCreditList,
	setPlayerCreditListData,
	resetPlayerCreditListData,
	getPlayerCreditListData,
} from 'frontend/ajax/__mocks__/backend/getPlayerCreditList';

let mockedModule = jest.createMockFromModule('../usePlayerCreditList.js');

let usePlayerCreditListData;
let isProceedHook = true;

mockedModule.usePlayerCreditList = jest.fn(({ isFetching, setIsFetching, date, page, setCreditListError }) => {
	let [playerCreditList, setPlayerCreditList] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
	});

	if (!isProceedHook) {
		return playerCreditList;
	}

	React.useEffect(() => {
		if (isFetching) {
			getPlayerCreditList({
				date,
				page,
				success: (response) => {
					usePlayerCreditListData = response.data.data;
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
});

function setIsProceedHook(isProceed) {
	isProceedHook = isProceed;
}

function setUsePlayerCreditListData(data) {
	usePlayerCreditListData = { ...mockedModule.usePlayerCreditList, ...data };
}

function resetUsePlayerCreditListData() {
	usePlayerCreditListData = {};
	resetPlayerCreditListData();
	isProceedHook = true;
}

function setUsePlayerCreditListResponse(result, data) {
	setPlayerCreditListData(result, data);
}

export default mockedModule.usePlayerCreditList;

export {
	setUsePlayerCreditListData,
	resetUsePlayerCreditListData,
	usePlayerCreditListData,
	setIsProceedHook,
	setUsePlayerCreditListResponse,
	getPlayerCreditListData,
};
