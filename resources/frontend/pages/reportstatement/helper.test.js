import { getStatementReport } from './helper';
import * as backend from 'frontend/ajax/backend';

jest.mock('frontend/ajax/backend');

describe('getStatementReport()', () => {
	let setDateRange = jest.fn();
	let setStatementData = jest.fn();
	let setStatementDataLoading = jest.fn();
	let setStatementDataError = jest.fn();

	beforeEach(() => {
		backend.resetStatementReportData();
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should fetch statement report data from backend', () => {
		jest.spyOn(backend, 'getStatementReport');
		getStatementReport(true, setDateRange, 1, setStatementData, setStatementDataLoading, setStatementDataError);
		getStatementReport(false, setDateRange, 2, setStatementData, setStatementDataLoading, setStatementDataError);

		expect(setStatementDataLoading).toHaveBeenNthCalledWith(1, true);
		expect(setStatementDataLoading).toHaveBeenNthCalledWith(3, true);
		expect(backend.getStatementReport).toHaveBeenNthCalledWith(
			1,
			1,
			false,
			expect.any(Function),
			expect.any(Function)
		);
		expect(backend.getStatementReport).toHaveBeenNthCalledWith(
			2,
			2,
			true,
			expect.any(Function),
			expect.any(Function)
		);
	});

	it('should set statement report table data when backend respond', () => {
		let statementReportData = backend.getStatementReportData();
		getStatementReport(true, setDateRange, 1, setStatementData, setStatementDataLoading, setStatementDataError);

		expect(setStatementDataLoading).toHaveBeenNthCalledWith(2, false);
		expect(setStatementData).toHaveBeenNthCalledWith(1, {
			content: statementReportData.data.data.content,
			footer: statementReportData.data.data.footer,
		});
	});
	it('should set statement report date range data when backend respond on first mount', () => {
		let statementReportData = backend.getStatementReportData();
		getStatementReport(true, setDateRange, 1, setStatementData, setStatementDataLoading, setStatementDataError);
		getStatementReport(false, setDateRange, 1, setStatementData, setStatementDataLoading, setStatementDataError);

		expect(setDateRange).toHaveBeenNthCalledWith(1, {
			isLoading: false,
			range: statementReportData.data.data.dateRange,
		});
		expect(setDateRange).toHaveBeenCalledTimes(1);
	});
	it('should set to statement report frontend error when backend respond with error data', () => {
		backend.setStatementReportData(false);
		getStatementReport(true, setDateRange, 1, setStatementData, setStatementDataLoading, setStatementDataError);

		expect(setStatementDataError).toHaveBeenCalled();
	});
});
