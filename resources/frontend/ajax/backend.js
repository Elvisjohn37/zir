import axios from 'axios';
import { subscribe, unsubscribe, responseInterceptor } from './backend/responseInterceptor';
import { autoAddCsrfToken } from './backend/csrfToken';
import defaultRequestHeaders from './backend/defaultRequestHeaders';

let axiosInstance = axios.create({
	baseURL: process.env.APP_ROOT || '',
});

defaultRequestHeaders(axiosInstance);
autoAddCsrfToken(axiosInstance);
responseInterceptor(axiosInstance);

export { subscribe, unsubscribe };

export function getSession(success, error) {
	axiosInstance
		.get('/getsession')
		.then(success)
		.catch(error ? error : () => {});
}

export function getGame({ isMobileDevice, page, success, error, ...otherOptions }) {
	axiosInstance({
		url: '/getgame',
		method: 'post',
		data: {
			page,
			isMobileDevice,
		},
		...otherOptions,
	})
		.then(success)
		.catch(error);
}

export function getbsiGames({ isMobileDevice, page, success, error, ...otherOptions }) {
	axiosInstance({
		url: '/getbsiGames',
		method: 'post',
		data: {
			page,
			isMobileDevice,
		},
		...otherOptions,
	})
		.then(success)
		.catch(error);
}

export function getAnnouncement({ success, error, viewType, showConfig, ...otherOptions }) {
	axiosInstance({
		url: '/getannouncement',
		method: 'post',
		data: {
			viewType,
			showConfig,
		},
		...otherOptions,
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getBalance(success, error) {
	axiosInstance.post('/getbalance').then(success).catch(error);
}

export function getBalanceBackground(success, error) {
	axiosInstance.post('/getbalancebg').then(success).catch(error);
}

export function getGameGuide({ product, gameType, lang, success, error, ...otherOptions }) {
	axiosInstance({
		url: '/getgameguide',
		method: 'post',
		data: {
			product,
			gameType,
			lang,
		},
		...otherOptions,
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function logout(success, error) {
	axiosInstance
		.post('/logout')
		.then(success)
		.catch(error ? error : () => {});
}

export function getRunningBets({ page, success, error }) {
	axiosInstance({
		url: '/getrunningbets',
		method: 'post',
		data: {
			page,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getStatementReport(rangeNo, showConfig, success, error) {
	axiosInstance({
		url: '/getstatementreport',
		method: 'post',
		data: {
			rangeNo,
			showConfig,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function checkIsMaintenance(success, error) {
	axiosInstance
		.get('/ismaintenance')
		.then(success)
		.catch(error ? error : () => {});
}

export function getPlayerBetList({ date, productID, page, success, error }) {
	axiosInstance({
		url: '/getplayerbetList',
		method: 'post',
		data: {
			date,
			page,
			productID,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getPlayerPromoList({ date, page, success, error }) {
	axiosInstance({
		url: '/getplayerpromolist',
		method: 'post',
		data: {
			date,
			page,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getPlayerTransferList({ date, page, success, error }) {
	axiosInstance({
		url: '/getplayertransferlist',
		method: 'post',
		data: {
			date,
			page,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getPlayerCreditList({ date, page, success, error }) {
	axiosInstance({
		url: '/getplayercreditlist',
		method: 'post',
		data: { date, page },
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getLayoutConfig(type, success, error) {
	let url;

	switch (type) {
		case 'main':
			url = '/getmainlayoutconfig';
			break;
		case 'noLayout':
			url = '/getnolayoutconfig';
	}

	axiosInstance
		.post(url)
		.then(success)
		.catch(error ? error : () => {});
}

export function getTransactionLog({ date, page, showConfig, success, error }) {
	axiosInstance({
		url: '/gettransactionlog',
		method: 'post',
		data: {
			date,
			page,
			showConfig,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getGameLedgerReport({ data, success, error }) {
	axiosInstance({
		url: '/getgameledger',
		method: 'post',
		data: {
			date: data.date,
			page: data.page,
			showConfig: data.showConfig,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getArcFinLedReport({ data, success, error }) {
	axiosInstance({
		url: '/getarcfinledreport',
		method: 'post',
		data: {
			date: data.date,
			page: data.page,
			showConfig: data.showConfig,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getBanners({ isMobileDevice, type, success, error }) {
	axiosInstance({
		url: '/getbanners',
		method: 'post',
		data: {
			type: type,
			isMobileDevice: isMobileDevice,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function settleRunningGame({ success, error }) {
	axiosInstance({
		url: '/settlerunninggame',
		method: 'post',
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getHomeConfig({ type, success, error }) {
	axiosInstance({
		url: '/gethomeconfig',
		method: 'post',
		data: {
			type: type,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getBsiGames({ page, isMobileDevice, success, error }) {
	axiosInstance({
		url: '/getBsiGames',
		method: 'post',
		data: {
			page,
			isMobileDevice,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}

export function getGameCategories(page, success, error) {
	axiosInstance({
		url: '/getgamecategories',
		method: 'post',
		data: {
			page: page,
		},
	})
		.then(success)
		.catch(error ? error : () => {});
}
