import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PlayerCreditList from './PlayerCreditList';
import * as MediaQuery from 'react-responsive';
import * as usePlayerCreditList from './playercreditlist/usePlayerCreditList';
import { setUserState } from 'frontend/contexts/User';
import userEvent from '@testing-library/user-event';

jest.mock('./playercreditlist/usePlayerCreditList');
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
jest.mock('frontend/components/ReportCreditFormatter');
jest.mock('frontend/components/TableRefresh');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/contexts/Language');
jest.mock('frontend/contexts/User');
jest.mock('react-responsive');
jest.mock('react-intl');

describe('<PlayerCreditList />', () => {
	beforeEach(() => {
		jest.spyOn(MediaQuery, 'setMediaQuery');
	});

	afterEach(() => {
		resetMocks();
		cleanup();
	});

	function resetMocks() {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		usePlayerCreditList.resetUsePlayerCreditListData();
		MediaQuery.setMediaQuery(true);
	}

	function getComponentProps(transactionType = 'betting') {
		let params = {
			type: transactionType,
			date: '2021-07-15',
		};
		if (transactionType == 'betting') {
			params = { ...params, productID: 1 };
		}
		return params;
	}

	function expectCorrectTableContent() {
		setUserState({ user: { parent: 'test' } });
		let responseData = usePlayerCreditList.getPlayerCreditListData().data.data;
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
		let { asFragment, rerender } = render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		expect(asFragment()).toMatchSnapshot();

		rerender(<PlayerCreditList match={{ params: getComponentProps('promotion') }} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should have table loading indicator on table during data fetching', () => {
		usePlayerCreditList.setIsProceedHook(false);
		render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		expect(screen.getByText('Loading TableIndicator')).toBeInTheDocument();
	});

	it('should display correct data in table after request from backend', () => {
		let { rerender } = render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		expectCorrectTableContent();
		usePlayerCreditList.setUsePlayerCreditListResponse(true, {
			content: [
				{
					dateTime: '2021-07-15 19:32:23.753000',
					creditLimit: '1000.000000',
					playerTotalBalance: '1000.000000',
					playableBalance: '1000.000000',
				},
				{
					dateTime: '2021-07-15 19:32:24.753000',
					creditLimit: '1000.000000',
					playerTotalBalance: '1000.000000',
					playableBalance: '1000.000000',
				},
			],
			totalRow: 2,
			rowsPerPage: 20,
		});
		rerender(<PlayerCreditList match={{ params: getComponentProps() }} />);
		expectCorrectTableContent();
	});

	it('should fetch data from backend when user click the refresh button', () => {
		render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		userEvent.click(screen.getByTestId('MobileTableRefresh'));
		expect(usePlayerCreditList.default).toHaveBeenNthCalledWith(1, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setCreditListError: expect.any(Function),
		});
		expect(usePlayerCreditList.default).toHaveBeenNthCalledWith(2, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setCreditListError: expect.any(Function),
		});
		expect(usePlayerCreditList.default).toHaveBeenNthCalledWith(3, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setCreditListError: expect.any(Function),
		});
		expect(usePlayerCreditList.default).toHaveBeenNthCalledWith(4, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setCreditListError: expect.any(Function),
		});
		expect(usePlayerCreditList.default).toHaveBeenCalledTimes(4);
	});

	it('should display refresh button base on the type of device', () => {
		let { rerender } = render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		let MobileTableRefresh = screen.getByTestId('MobileTableRefresh');
		expect(MobileTableRefresh).toBeInTheDocument();

		MediaQuery.setMediaQuery(false);
		rerender(<PlayerCreditList match={{ params: getComponentProps() }} />);
		let DesktopTableRefresh = screen.getByTestId('DesktopTableRefresh');
		expect(DesktopTableRefresh).toBeInTheDocument();
	});

	it('should display pagination and record base on selected page', () => {
		render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		expect(screen.getByText('Pagination page: 0')).toBeInTheDocument();
		expect(
			screen.getByText('Pagination count: ' + usePlayerCreditList.usePlayerCreditListData.totalRow)
		).toBeInTheDocument();
		expect(
			screen.getByText('Pagination rowsPerPage: ' + usePlayerCreditList.usePlayerCreditListData.rowsPerPage)
		).toBeInTheDocument();
	});

	it('should display no record found when record is empty', () => {
		usePlayerCreditList.setUsePlayerCreditListResponse(true, { content: [] });
		let { container } = render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		let tableRow = container.getElementsByClassName('testTableRow');
		expect(tableRow).toHaveLength(0);
	});

	it('should display error message when backend response is not valid', () => {
		usePlayerCreditList.setUsePlayerCreditListResponse(false);
		render(<PlayerCreditList match={{ params: getComponentProps() }} />);
		expect(screen.getByText('Error Response')).toBeInTheDocument();
	});
});
