import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DesktopDateRange, MobileDateRange } from './DateRange';

jest.mock('frontend/components/Skeleton');
jest.mock('frontend/components/ReportCommonFormatter');
jest.mock('@mui/material/Tabs');
jest.mock('@mui/material/Tab');
jest.mock('@mui/material/Button');
jest.mock('@mui/material/Menu');
jest.mock('@mui/material/MenuItem');
jest.mock('@mui/material/ListItemText');
jest.mock('@mui/icons-material/DateRange');

const DATE_RANGE_ISLOADING = { isLoading: true, range: [] };
const DATE_RANGE_LOADED = {
	isLoading: false,
	range: [
		{ number: 3, startDate: '2021-07-01', endDate: '2021-07-31' },
		{ number: 2, startDate: '2021-08-01', endDate: '2021-08-31' },
		{ number: 1, startDate: '2021-09-01', endDate: '2021-09-01' },
	],
};

describe('</DesktopDateRange>', () => {
	let defaultProps = { dateRange: DATE_RANGE_LOADED, onChange: () => jest.fn() };
	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		cleanup();
	});

	it('should match snapshot', () => {
		let { asFragment } = render(<DesktopDateRange {...defaultProps} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loader when config is still loading', () => {
		render(<DesktopDateRange {...defaultProps} dateRange={DATE_RANGE_ISLOADING} />);
		expect(screen.getByTestId('Skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('Tabs')).not.toBeInTheDocument();
	});

	it('should display date range options in tab form after config loading', () => {
		render(<DesktopDateRange {...defaultProps} />);
		expect(screen.queryByTestId('Skeleton')).not.toBeInTheDocument();
		DATE_RANGE_LOADED.range.map((item) => {
			expect(screen.getByText('{"row":' + JSON.stringify(item) + '}')).toBeInTheDocument();
		});
	});

	it('should handle change when user click an option and highlight active date', () => {
		let handleChange = jest.fn();
		render(<DesktopDateRange {...defaultProps} onChange={handleChange} />);
		userEvent.click(screen.getByTestId('Tabs'));
		expect(handleChange).toHaveBeenCalled();
	});
});

describe('</MobileDateRange>', () => {
	let defaultProps = { activeDate: 1, dateRange: DATE_RANGE_LOADED, onChange: () => jest.fn() };
	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		cleanup();
	});

	it('should match snapshot', () => {
		let { asFragment } = render(<MobileDateRange {...defaultProps} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loader when config is still loading', () => {
		render(<MobileDateRange {...defaultProps} dateRange={DATE_RANGE_ISLOADING} />);
		expect(screen.getByTestId('Skeleton')).toBeInTheDocument();
		expect(screen.queryByTestId('Tabs')).not.toBeInTheDocument();
	});

	it('should display date range options in button menu after config loading', () => {
		render(<MobileDateRange {...defaultProps} />);
		expect(screen.queryByTestId('Skeleton')).not.toBeInTheDocument();
		expect(screen.queryByTestId('Button')).toBeInTheDocument();
	});

	it('should handle change when user click an option and highlight active date', () => {
		let handleChange = jest.fn();
		render(<MobileDateRange {...defaultProps} onChange={handleChange} />);
		fireEvent.change(screen.getByTestId('Button'));

		DATE_RANGE_LOADED.range.map((item) => {
			let activeCounter = 0;
			let inActiveCounter = 0;
			if (item.number == 1) {
				expect(screen.getAllByText('selected: true')[activeCounter]).toBeInTheDocument();
				activeCounter++;
			} else {
				expect(screen.getAllByText('selected: false')[inActiveCounter]).toBeInTheDocument();
				inActiveCounter++;
			}
		});
	});
});
