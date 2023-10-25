import * as getGame from './backend/getGame';
import * as errorData from './backend/errorData';
import * as getBalance from './backend/getBalance';
import * as getStatementReport from './backend/getStatementReport';
import * as getPlayerCreditList from './backend/getPlayerCreditList';
import * as getPlayerTransferList from './backend/getPlayerTransferList';
import * as getTransactionLog from './backend/getTransactionLog';
import * as getPlayerBetList from './backend/getPlayerBetList';
import * as getRunningBets from './backend/getRunningBets';
import * as getGameLedgerReport from './backend/getGameLedgerReport';
import * as getArcFinLedReport from './backend/getArcFinLedReport';
import * as getGameGuide from './backend/getGameGuide';
import * as getBanners from './backend/getBanners';
import * as getHomeConfig from './backend/getHomeConfig';

let mockedModule = jest.createMockFromModule('../backend.js');
let { isFunction } = jest.requireActual('lodash');

let getSessionData;
let getSessionResult;
mockedModule.getSession = (success, error) => {
	if (getSessionResult) {
		isFunction(success) && success(getSessionData);
		return getSessionData;
	} else {
		let getErrorData = errorData.getError();
		isFunction(error) && error(getErrorData);
		return getErrorData;
	}
};
mockedModule.setGetSession = (result, data) => {
	getSessionResult = result;
	getSessionData.data.data = data;
	getSessionData.data.result = getSessionResult;
};
mockedModule.resetGetSession = () => {
	getSessionResult = true;
	getSessionData = {
		data: { result: getSessionResult, data: { isLogin: true, userName: 'test' } },
	};
};
mockedModule.resetGetSession();

mockedModule.subscribe = function subscribe(event, eventFuntion) {
	if (event == 'error') {
		let getErrorData = errorData.getError();
		eventFuntion(getErrorData);
		return getErrorData;
	}
};

// from other modules
Object.assign(
	mockedModule,
	errorData,
	getGame,
	getBalance,
	getStatementReport,
	getPlayerCreditList,
	getPlayerTransferList,
	getPlayerBetList,
	getTransactionLog,
	getRunningBets,
	getGameLedgerReport,
	getArcFinLedReport,
	getGameGuide,
	getBanners,
	getHomeConfig
);

module.exports = mockedModule;
