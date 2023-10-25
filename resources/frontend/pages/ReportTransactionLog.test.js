import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReportTransactionLog from './ReportTransactionLog';
import * as MediaQuery from 'react-responsive';
import * as backend from 'frontend/ajax/backend';
import userEvent from '@testing-library/user-event';
import { toDateTimeString } from 'frontend/utils/helper';

jest.mock('frontend/components/Language');
jest.mock('frontend/components/Sidebar');
jest.mock('frontend/components/TableIndicator');
jest.mock('frontend/components/ReportCommonFormatter');
jest.mock('frontend/components/ReportTransactionLogFormatter');
jest.mock('frontend/components/ReportBetFormatter');
jest.mock('frontend/components/ReportTransferFormatter');
jest.mock('frontend/components/ReportCreditFormatter');
jest.mock('frontend/components/Spinner');
jest.mock('frontend/contexts/User');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/ajax/backend');
jest.mock('frontend/utils/helper');
jest.mock('@mui/material/TableContainer');
jest.mock('@mui/material/Table');
jest.mock('@mui/material/TableHead');
jest.mock('@mui/material/TableRow');
jest.mock('@mui/material/TableBody');
jest.mock('@mui/material/TableCell');
jest.mock('@mui/material/Grid');
jest.mock('@mui/x-date-pickers/AdapterDateFns');
jest.mock('@mui/x-date-pickers/LocalizationProvider');
jest.mock('react-intl');
jest.mock('react-responsive');
jest.mock('./reporttransactionlog/DatePicker');

describe('<ReportTransactionLog/>', () => {
	let spyDate;

	beforeAll(() => {
		Date.prototype.addHours = function (h) {
			this.setTime(this.getTime() + h * 60 * 60 * 1000);
			return this;
		};
	});

	beforeEach(() => {
		let mockDate = new Date('11/11/2021, 1:51:00 PM');
		spyDate = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		cleanup();
		spyDate.mockRestore();
	});

	function expectCorrectTableContent() {
		let transactionLogData = backend.getTransactionLogData();
		let dataLength = transactionLogData.data.data.content.length;
		expect(screen.queryByText('Done loading TableIndicator')).toBeInTheDocument();
		if (dataLength == 0) {
			expect(screen.queryByText('TableIndicator Empty')).toBeInTheDocument();
		} else {
			expect(screen.queryByText('TableIndicator Empty')).not.toBeInTheDocument();
		}
		let columnsLength = 10;
		transactionLogData.data.data.content.forEach((data, index) => {
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 1]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 2]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 3]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 4]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 5]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 6]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 7]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 8]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 9]).toBeInTheDocument();
		});
	}

	it('should match snapshot', () => {
		let { asFragment } = render(<ReportTransactionLog />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loading when initiating the page', () => {
		render(<ReportTransactionLog />);
		expectCorrectTableContent();
	});

	it('should display date picker base on device type and latest 1 hour record on first load', () => {
		jest.spyOn(backend, 'getTransactionLog');
		let { rerender } = render(<ReportTransactionLog />);
		let dateMock = new Date();
		dateMock.setMinutes(0, 0, 0);

		expect(backend.getTransactionLog).toHaveBeenNthCalledWith(1, {
			date: toDateTimeString(dateMock),
			page: 1,
			showConfig: true,
			success: expect.any(Function),
			error: expect.any(Function),
		});
		expect(screen.getByTestId('MobileDatePicker')).toBeInTheDocument();
		expect(screen.queryByTestId('DesktopDatePicker')).toBeNull();
		MediaQuery.setMediaQuery(false);
		rerender(<ReportTransactionLog />);
		expect(screen.getByTestId('DesktopDatePicker')).toBeInTheDocument();
		expect(screen.queryByTestId('MobileDatePicker')).toBeNull();
	});

	it('should get 1 hour record base on date selected when player pick on date picker', () => {
		jest.spyOn(backend, 'getTransactionLog');
		MediaQuery.setMediaQuery(true);
		render(<ReportTransactionLog />);
		MediaQuery.setMediaQuery(true);
		let dateMock = new Date();
		dateMock.setMinutes(0, 0, 0);
		expectCorrectTableContent();
		expect(backend.getTransactionLog).toHaveBeenNthCalledWith(1, {
			date: toDateTimeString(dateMock),
			page: 1,
			showConfig: true,
			success: expect.any(Function),
			error: expect.any(Function),
		});
		userEvent.click(screen.getByTestId('MobileDatePicker'));
		expect(backend.getTransactionLog).toHaveBeenNthCalledWith(2, {
			date: toDateTimeString(dateMock.addHours(1)),
			page: 1,
			showConfig: false,
			success: expect.any(Function),
			error: expect.any(Function),
		});
		userEvent.click(screen.getByTestId('MobileDatePicker'));
		expect(backend.getTransactionLog).toHaveBeenNthCalledWith(3, {
			date: toDateTimeString(dateMock.addHours(1)),
			page: 1,
			showConfig: false,
			success: expect.any(Function),
			error: expect.any(Function),
		});
	});

	it('should display pagination and record base on selected page', () => {
		render(<ReportTransactionLog />);
		expect(screen.getByText('Pagination count: 7')).toBeInTheDocument();
		expect(screen.getByText('Pagination page: 0')).toBeInTheDocument();
		expect(screen.getByText('Pagination rowsPerPage: 20')).toBeInTheDocument();
		userEvent.click(screen.getByTestId('TableIndicator'));
		expect(screen.getByText('Pagination page: 1')).toBeInTheDocument();
		userEvent.click(screen.getByTestId('TableIndicator'));
		expect(screen.getByText('Pagination page: 2')).toBeInTheDocument();
	});

	it('should display no record found when record is empty', () => {
		backend.setTransactionLog(true, { content: [] });
		let { container } = render(<ReportTransactionLog />);
		let tableRow = container.getElementsByClassName('testTableRow');
		expect(tableRow).toHaveLength(0);
	});

	it('should display error message when backend response is not valid', () => {
		backend.setTransactionLog(false);
		render(<ReportTransactionLog />);
		expect(screen.getByText('Error Response')).toBeInTheDocument();
	});
});
