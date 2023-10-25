import React from 'react';
import { render, screen, cleanup, within } from '@testing-library/react';
import PlayerBetList from './PlayerBetList';
import { setUserState } from 'frontend/contexts/User';
import * as usePlayerBetList from './playerbetlist/usePlayerBetList';
import * as MediaQuery from 'react-responsive';
import userEvent from '@testing-library/user-event';

jest.mock('@mui/material/Table');
jest.mock('@mui/material/TableHead');
jest.mock('@mui/material/TableRow');
jest.mock('@mui/material/TableBody');
jest.mock('@mui/material/TableCell');
jest.mock('@mui/material/TableContainer');
jest.mock('frontend/components/TableIndicator');
jest.mock('frontend/components/TableRefresh');
jest.mock('frontend/components/Sidebar');
jest.mock('frontend/components/Language');
jest.mock('frontend/components/ReportCommonFormatter');
jest.mock('frontend/components/ReportBetFormatter');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/contexts/User');
jest.mock('./playerbetlist/usePlayerBetList');
jest.mock('react-responsive');

describe('<PlayerBetList />', () => {
	afterEach(() => {
		resetMocks();
		cleanup();
	});

	function resetMocks() {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		usePlayerBetList.resetUsePlayerBetListData();
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
		let responseData = usePlayerBetList.getPlayerBetListData().data.data;
		let columnsLength = 7;
		responseData.content.forEach((data, index) => {
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 1]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 2]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 3]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 4]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 5]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 6]).toBeInTheDocument();
		});
	}

	it('should match snapshot', () => {
		let { asFragment } = render(<PlayerBetList match={{ params: getComponentProps() }} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should have table loading indicator on table during data fetching', () => {
		usePlayerBetList.setIsProceedHook(false);
		render(<PlayerBetList match={{ params: getComponentProps() }} />);
		expect(screen.getByText('Loading TableIndicator')).toBeInTheDocument();
	});

	it('should fetch correct data when player select promotion or bet list report type', () => {
		let { rerender } = render(<PlayerBetList match={{ params: getComponentProps() }} />);
		rerender(<PlayerBetList match={{ params: getComponentProps('promotion') }} />);
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(1, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			productID: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'betting',
		});
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(2, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'betting',
			productID: 1,
		});
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(3, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'promotion',
			productID: undefined,
		});
	});

	it('should display correct data in table after request from backend', () => {
		render(<PlayerBetList match={{ params: getComponentProps() }} />);
		expectCorrectTableContent();
		usePlayerBetList.setUsePlayerBetListResponse(true, {
			content: [
				{
					rowNo: 100,
					betLinkFormat: 'hasBetLink',
					commission: '0.000000',
					dateTime: '2021-09-08 11:19:51.000000',
					event: 'W',
					gameID: '00014',
					gameName: 'Djap Go',
					grossRake: '0.000000',
					memWLCommisionFormatter: 'withMemWLCommission',
					netwin: '10000.000000',
					reasonFormat: 'noReason',
					roundDetID: 2,
					roundIDFormat: 'roundDetID',
					stake: '4.000000',
					tableNameFormat: 'gameName',
					transactionDetID: 'zW9',
					turnover: '4.000000',
				},
				{
					rowNo: 101,
					betLinkFormat: 'hasBetLink',
					commission: '0.000000',
					dateTime: '2021-09-08 11:19:51.000000',
					event: 'L',
					gameID: '00014',
					gameName: 'Djap Go',
					grossRake: '0.000000',
					memWLCommisionFormatter: 'withMemWLCommission',
					netwin: '10000.000000',
					reasonFormat: 'noReason',
					roundDetID: 2,
					roundIDFormat: 'roundDetID',
					stake: '4.000000',
					tableNameFormat: 'gameName',
					transactionDetID: 'zW9',
					turnover: '4.000000',
				},
			],
		});
		cleanup();
		resetMocks();
		render(<PlayerBetList match={{ params: getComponentProps() }} />);
		expectCorrectTableContent();
	});

	it('should fetch data from backend when user click the refresh button', () => {
		render(<PlayerBetList match={{ params: getComponentProps() }} />);
		userEvent.click(screen.getByTestId('MobileTableRefresh'));
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(1, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			productID: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'betting',
		});
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(2, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			productID: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'betting',
		});
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(3, {
			isFetching: true,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			productID: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'betting',
		});
		expect(usePlayerBetList.default).toHaveBeenNthCalledWith(4, {
			isFetching: false,
			setIsFetching: expect.any(Function),
			date: '2021-07-15',
			page: 1,
			productID: 1,
			setIsPromoBettingListError: expect.any(Function),
			type: 'betting',
		});
		expect(usePlayerBetList.default).toHaveBeenCalledTimes(4);
	});

	it('should display refresh button base on the type of device', () => {
		let { rerender } = render(<PlayerBetList match={{ params: getComponentProps() }} />);
		let MobileTableRefresh = screen.getByTestId('MobileTableRefresh');
		expect(MobileTableRefresh).toBeInTheDocument();

		MediaQuery.setMediaQuery(false);
		rerender(<PlayerBetList match={{ params: getComponentProps() }} />);
		let DesktopTableRefresh = screen.getByTestId('DesktopTableRefresh');
		expect(DesktopTableRefresh).toBeInTheDocument();
	});

	it('should display pagination and record base on selected page', () => {
		render(<PlayerBetList match={{ params: getComponentProps() }} />);
		expect(screen.getByText('Pagination page: 0')).toBeInTheDocument();
		expect(
			screen.getByText('Pagination count: ' + usePlayerBetList.usePlayerBetListData.totalRow)
		).toBeInTheDocument();
		expect(
			screen.getByText('Pagination rowsPerPage: ' + usePlayerBetList.usePlayerBetListData.rowsPerPage)
		).toBeInTheDocument();
	});

	it('should display no record found when record is empty', () => {
		usePlayerBetList.setUsePlayerBetListResponse(true, { content: [] });
		let { container } = render(<PlayerBetList match={{ params: getComponentProps() }} />);
		let tableRow = container.getElementsByClassName('testTableRow');
		expect(tableRow).toHaveLength(0);
	});

	it('should display error message when backend response is not valid', () => {
		usePlayerBetList.setUsePlayerBetListResponse(false);
		render(<PlayerBetList match={{ params: getComponentProps() }} />);
		expect(screen.getByText('Error Response')).toBeInTheDocument();
	});
});
