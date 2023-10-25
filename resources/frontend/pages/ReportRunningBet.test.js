import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReportRunningBet from './ReportRunningBet';
import * as MediaQuery from 'react-responsive';
import { setUserState } from 'frontend/contexts/User';
import userEvent from '@testing-library/user-event';
import { blockSuccess } from 'frontend/ajax/__mocks__/backend/getRunningBets';
import * as runningBets from 'frontend/ajax/backend';

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
jest.mock('frontend/components/ReportBetFormatter');
jest.mock('frontend/components/TableRefresh');
jest.mock('frontend/components/MoneyFormat');
jest.mock('frontend/components/Skeleton');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/contexts/User');
jest.mock('react-responsive');
jest.mock('react-intl');
jest.mock('frontend/ajax/backend');

describe('<ReportRunningBet/>', () => {
	beforeEach(() => {
		jest.spyOn(runningBets, 'getRunningBets');
		jest.spyOn(MediaQuery, 'setMediaQuery');
	});

	afterEach(() => {
		resetMocks();
		cleanup();
	});

	function resetMocks() {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		runningBets.resetRunningBetsData();
		MediaQuery.setMediaQuery(true);
	}

	function expectCorrectTableContent() {
		setUserState({ user: { parent: 'test' } });
		let responseData = runningBets.getRunningBetsData().data.data;
		let columnsLength = 5;
		responseData.content.forEach((data, index) => {
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 1]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 2]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 3]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 4]).toBeInTheDocument();
		});
	}

	it('should match snapshot', () => {
		let { asFragment } = render(<ReportRunningBet />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should have table loading indicator on table during data fetching', () => {
		blockSuccess();
		render(<ReportRunningBet />);
		expect(screen.getByText('Loading TableIndicator')).toBeInTheDocument();
	});

	it('should fetch the latest running bet record from backend', () => {
		render(<ReportRunningBet />);
		expect(runningBets.getRunningBets).toHaveBeenCalledWith({
			page: 1,
			success: expect.any(Function),
			error: expect.any(Function),
		});
		expectCorrectTableContent();
	});

	it('should update and fetch latest record when refresh button is clicked', () => {
		render(<ReportRunningBet />);
		expectCorrectTableContent();
		userEvent.click(screen.getByTestId('MobileTableRefresh'));
		expect(runningBets.getRunningBets).toHaveBeenNthCalledWith(1, {
			page: 1,
			success: expect.any(Function),
			error: expect.any(Function),
		});

		runningBets.setRunningBetsData(true, {
			content: [
				{
					event: 'R',
					betLinkFormat: 'noBetLink',
					reasonFormat: 'noReason',
					gameID: '00641',
					roundIDFormat: 'roundDetID',
					roundDetID: 2,
					tableNameFormat: 'gameName',
					gameName: 'Dangdut Queen (Mobile)',
					stake: '100.000000',
					turnover: '100.000000',
					dateTime: '2021-08-26 08:00:00.000000',
				},
				{
					event: 'R',
					betLinkFormat: 'noBetLink',
					reasonFormat: 'noReason',
					gameID: '01641',
					roundIDFormat: 'roundDetID',
					roundDetID: 4,
					tableNameFormat: 'gameName',
					gameName: 'Dangdut Queen (Desktop)',
					stake: '111.000000',
					turnover: '102.000000',
					dateTime: '2021-08-28 09:01:00.000000',
				},
				{
					event: 'R',
					betLinkFormat: 'noBetLink',
					reasonFormat: 'noReason',
					gameID: '01643',
					roundIDFormat: 'roundDetID',
					roundDetID: 6,
					tableNameFormat: 'gameName',
					gameName: 'Dangdut Queen (Desktop)',
					stake: '111.000000',
					turnover: '112.000000',
					dateTime: '2021-08-28 10:01:00.000000',
				},
			],
			totalRunningBets: '100.000000',
			totalRow: 1,
			rowsPerPage: 20,
		});
		expect(runningBets.getRunningBets).toHaveBeenNthCalledWith(2, {
			page: 1,
			success: expect.any(Function),
			error: expect.any(Function),
		});
	});

	it('should display pagination and record base on selected page', () => {
		render(<ReportRunningBet />);
		expect(screen.getByText('Pagination count: 1')).toBeInTheDocument();
		expect(screen.getByText('Pagination page: 0')).toBeInTheDocument();
		expect(screen.getByText('Pagination rowsPerPage: 20')).toBeInTheDocument();
		userEvent.click(screen.getByTestId('TableIndicator'));
		expect(runningBets.getRunningBets).toHaveBeenNthCalledWith(2, {
			page: 2,
			success: expect.any(Function),
			error: expect.any(Function),
		});
	});

	it('should display no record found when record is empty', () => {
		runningBets.setRunningBetsData(true, { content: [] });
		let { container } = render(<ReportRunningBet />);
		let tableRow = container.getElementsByClassName('testTableRow');
		expect(tableRow).toHaveLength(0);
	});

	it('should display error message when backend response is not valid', () => {
		runningBets.setRunningBetsData(false);
		render(<ReportRunningBet />);
		expect(screen.getByText('Error Response')).toBeInTheDocument();
	});
});
