import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReportStatement from './ReportStatement';
import * as StatementReportHelper from './reportstatement/helper';
import * as MediaQuery from 'react-responsive';
import userEvent from '@testing-library/user-event';
import { setUserState } from 'frontend/contexts/User';

jest.mock('@mui/material/TableRow');
jest.mock('@mui/material/TableBody');
jest.mock('@mui/material/TableCell');
jest.mock('@mui/material/TableFooter');
jest.mock('./reportstatement/helper');
jest.mock('./reportstatement/DateRange');
jest.mock('frontend/components/Language');
jest.mock('react-intl');
jest.mock('frontend/components/Sidebar');
jest.mock('react-responsive');
jest.mock('frontend/components/TableIndicator');
jest.mock('frontend/components/ReportCommonFormatter');
jest.mock('frontend/components/ReportStatementFormatter');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/contexts/User');

describe('</ReportStatement>', () => {
	let rsAsFragment, rsContainer, rsRerender, rsGetByText;

	beforeEach(() => {
		jest.spyOn(StatementReportHelper, 'getStatementReport');
		jest.spyOn(MediaQuery, 'setMediaQuery');
		let { asFragment, container, rerender, getByText } = renderReportStatement();
		rsAsFragment = asFragment;
		rsContainer = container;
		rsRerender = rerender;
		rsGetByText = getByText;
	});

	afterEach(() => {
		resetMocks();
		cleanup();
		rsAsFragment = null;
		rsContainer = null;
		rsRerender = null;
		rsGetByText = null;
	});

	function resetMocks() {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		StatementReportHelper.resetGetStatementReport();
		MediaQuery.setMediaQuery(true);
	}

	function renderReportStatement() {
		let { asFragment, container, rerender, getByText } = render(<ReportStatement />);
		return { asFragment, container, rerender, getByText };
	}

	function expectCorrectTableContent() {
		setUserState({ user: { parent: 'test' } });
		let responseData = StatementReportHelper.getStatementReportData().data.data;
		let columnsLength = 9;
		responseData.content.forEach((data, index) => {
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 1]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 2]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 3]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 4]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 5]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 6]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 7]).toBeInTheDocument();
			expect(screen.getAllByTestId('TableCell')[columnsLength * index + columnsLength + 8]).toBeInTheDocument();
		});
	}

	it('should match snapshot', () => {
		expect(rsAsFragment()).toMatchSnapshot();
	});

	it('should display loader when initiating the page', () => {
		resetMocks();
		StatementReportHelper.setIsProceedHook(false);
		let { getByText } = renderReportStatement();
		expect(getByText('Loading TableIndicator')).toBeInTheDocument();
	});

	it('should display date picker base on device type', () => {
		expect(screen.getByTestId('MobileDateRange')).toBeInTheDocument();
		resetMocks();
		cleanup();
		MediaQuery.setMediaQuery(false);
		render(<ReportStatement />);
		expect(screen.getByTestId('DesktopDateRange')).toBeInTheDocument();
	});

	it('should get record only from backend and display it when player pick a date', () => {
		userEvent.click(screen.getByTestId('MobileDateRange'));
		expectCorrectTableContent();
	});

	it('should display no record found when record is empty', () => {
		cleanup();
		StatementReportHelper.setGetStatementReport(true, { content: [] });
		let { container } = renderReportStatement();
		let tableRow = container.getElementsByClassName('testTableRow');
		expect(tableRow).toHaveLength(0);
	});

	it('should display error message when backend response is not valid', () => {
		cleanup();
		StatementReportHelper.setGetStatementReport(false);
		renderReportStatement();
		expect(screen.getByText('Error Response')).toBeInTheDocument();
	});
});
