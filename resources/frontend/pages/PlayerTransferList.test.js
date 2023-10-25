import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PlayerTransferList from './PlayerTransferList';
import * as MediaQuery from 'react-responsive';
import { setUserState } from 'frontend/contexts/User';
import * as usePlayerTransferList from './playertransferlist/usePlayerTransferList';
import userEvent from '@testing-library/user-event';

jest.mock('./playertransferlist/usePlayerTransferList');
jest.mock('./playertransferlist/usePlayerTransferList');
jest.mock('@mui/material/Table');
jest.mock('@mui/material/TableHead');
jest.mock('@mui/material/TableRow');
jest.mock('@mui/material/TableBody');
jest.mock('@mui/material/TableCell');
jest.mock('@mui/material/TableContainer');
jest.mock('frontend/components/TableIndicator');
jest.mock('frontend/components/Sidebar');
jest.mock('frontend/components/Language');
jest.mock('frontend/components/ReportCommonFormatter');
jest.mock('frontend/components/ReportTransferFormatter');
jest.mock('frontend/components/TableRefresh');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/contexts/Language');
jest.mock('frontend/contexts/User');
jest.mock('react-responsive');
jest.mock('react-intl');

describe('<PlayerTransferList />', () => {
	let defaultProps = {
		match: {
			params: {
				date: '2021-07-15',
			},
		},
	};

	afterEach(() => {
		resetMocks();
		cleanup();
	});

	function resetMocks() {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		usePlayerTransferList.resetUsePlayerTransferListData();
		MediaQuery.setMediaQuery(true);
	}

	function expectCorrectTableContent() {
		setUserState({ user: { parent: 'test' } });
		let responseData = usePlayerTransferList.getPlayerTransferListData().data.data;
		let columnsLength = 6;
		responseData.content.forEach((data, index) => {
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 1]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 2]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 3]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 4]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 5]).toBeInTheDocument();
		});
	}

	it('should match snapshot', () => {
		let { asFragment } = render(<PlayerTransferList {...defaultProps} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should have table loading indicator on table during data fetching', () => {
		usePlayerTransferList.setIsProceedHook(false);
		render(<PlayerTransferList {...defaultProps} />);
		expect(screen.getByText('Loading TableIndicator')).toBeInTheDocument();
	});

	it('should display correct data in table after request from backend', () => {
		let { rerender } = render(<PlayerTransferList {...defaultProps} />);
		expectCorrectTableContent();
		usePlayerTransferList.setUsePlayerTransferListResponse(true, {
			content: [
				{
					rowNo: '7',
					amount: '1000.000000',
					amountFormat: 'defaultAmount',
					dateTime: '2021-07-15 14:32:23.753000',
					descriptionFormat: 'depositApproved',
					outstandingBalanceFormat: 'noOutstandingBalance',
					playableBalance: '1000.000000',
				},
				{
					rowNo: '8',
					amount: '1000.000000',
					amountFormat: 'defaultAmount',
					dateTime: '2021-07-15 14:32:23.753000',
					descriptionFormat: 'depositApproved',
					outstandingBalanceFormat: 'noOutstandingBalance',
					playableBalance: '1000.000000',
				},
			],
			totalRow: 2,
			rowsPerPage: 20,
		});
		rerender(<PlayerTransferList {...defaultProps} />);
		expectCorrectTableContent();
	});

	it('should fetch data from backend when user click the refresh button', () => {
		render(<PlayerTransferList {...defaultProps} />);
		userEvent.click(screen.getByTestId('MobileTableRefresh'));
		expect(usePlayerTransferList.default).toHaveBeenNthCalledWith(1, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setTransferListError: expect.any(Function),
		});
		expect(usePlayerTransferList.default).toHaveBeenNthCalledWith(2, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setTransferListError: expect.any(Function),
		});
		expect(usePlayerTransferList.default).toHaveBeenNthCalledWith(3, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setTransferListError: expect.any(Function),
		});
		expect(usePlayerTransferList.default).toHaveBeenNthCalledWith(4, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setTransferListError: expect.any(Function),
		});
		expect(usePlayerTransferList.default).toHaveBeenCalledTimes(4);
	});

	it('should display refresh button base on the type of device', () => {
		let { rerender } = render(<PlayerTransferList {...defaultProps} />);
		let MobileTableRefresh = screen.getByTestId('MobileTableRefresh');
		expect(MobileTableRefresh).toBeInTheDocument();

		MediaQuery.setMediaQuery(false);
		rerender(<PlayerTransferList {...defaultProps} />);
		let DesktopTableRefresh = screen.getByTestId('DesktopTableRefresh');
		expect(DesktopTableRefresh).toBeInTheDocument();
	});

	it('should display pagination and record base on selected page', () => {
		render(<PlayerTransferList {...defaultProps} />);
		expect(screen.getByText('Pagination page: 0')).toBeInTheDocument();
		expect(
			screen.getByText('Pagination count: ' + usePlayerTransferList.usePlayerTransferListData.totalRow)
		).toBeInTheDocument();
		expect(
			screen.getByText('Pagination rowsPerPage: ' + usePlayerTransferList.usePlayerTransferListData.rowsPerPage)
		).toBeInTheDocument();
	});

	it('should display no record found when record is empty', () => {
		usePlayerTransferList.setUsePlayerTransferListResponse(true, { content: [] });
		let { container } = render(<PlayerTransferList {...defaultProps} />);
		let tableRow = container.getElementsByClassName('testTableRow');
		expect(tableRow).toHaveLength(0);
	});

	it('should display error message when backend response is not valid', () => {
		usePlayerTransferList.setUsePlayerTransferListResponse(false);
		render(<PlayerTransferList {...defaultProps} />);
		expect(screen.getByText('Error Response')).toBeInTheDocument();
	});
});
