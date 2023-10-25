import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { DesktopDatePicker, MobileDatePicker } from './DatePicker';
import { setDate } from 'frontend/tests/helpers';
import * as helper from './datepicker/helper';
import userEvent from '@testing-library/user-event';

jest.mock('@material-ui/core/InputAdornment');
jest.mock('@mui/icons-material/Search');
jest.mock('@mui/icons-material/NavigateBefore');
jest.mock('@mui/icons-material/Event');
jest.mock('@mui/icons-material/NavigateNext');
jest.mock('@mui/x-date-pickers/DateTimePicker');
jest.mock('@mui/x-date-pickers/MobileDateTimePicker');
jest.mock('@mui/material/Grid');
jest.mock('@mui/material/Button');
jest.mock('@mui/material/TextField');
jest.mock('./datepicker/helper');
jest.mock('react-intl');

let defaultDate = setDate('9/20/2021 4:00:00 PM');
let defaultSetSelected = jest.fn();
let defaultRefresh = jest.fn();
let defaultDateMinMax = { maxDate: '2021-09-20', minDate: '2021-07-01' };
let defaultProps = {
	selectedDate: defaultDate,
	dateMinMax: defaultDateMinMax,
	setSelectedDate: defaultSetSelected,
	refresh: defaultRefresh,
	transactionLogLoading: false,
};

describe('<DesktopDatePicker/>', () => {
	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		helper.resetIsArrowDisabled();
		cleanup();
	});

	it('should match snapshot', () => {
		let { asFragment } = render(<DesktopDatePicker {...defaultProps} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display selected date in a datepicker input', () => {
		let { rerender } = render(<DesktopDatePicker {...defaultProps} />);
		expect(screen.getByText(JSON.stringify(new Date(defaultDate)))).toBeInTheDocument();

		let newDate = setDate('9/20/2021 5:00:00 PM');
		rerender(<DesktopDatePicker {...defaultProps} selectedDate={newDate} />);
		expect(screen.getByText(JSON.stringify(new Date(newDate)))).toBeInTheDocument();
	});

	it('should be able to change selected date', () => {
		let { rerender } = render(<DesktopDatePicker {...defaultProps} />);
		fireEvent.change(screen.getByTestId('DateTimePicker'), { target: { value: defaultProps.selectedDate } });
		expect(defaultSetSelected).toHaveBeenCalled();

		let newDate = setDate('9/20/2021 5:00:00 PM');
		rerender(<DesktopDatePicker {...defaultProps} selectedDate={newDate} />);
		fireEvent.change(screen.getByTestId('DateTimePicker'), { target: { value: newDate } });
		expect(defaultSetSelected).toHaveBeenCalled();
	});

	it('should start fetching when search button is clicked', () => {
		render(<DesktopDatePicker {...defaultProps} />);
		userEvent.click(screen.queryAllByTestId('Button')[0]);
		expect(defaultRefresh).toHaveBeenCalled();
	});

	it('should allow only dates that are within allowable range', () => {
		let { rerender } = render(<DesktopDatePicker {...defaultProps} />);
		expect(screen.getByText('maxDate: ' + JSON.stringify(new Date(defaultDateMinMax.maxDate)))).toBeInTheDocument();
		expect(screen.getByText('minDate: ' + JSON.stringify(new Date(defaultDateMinMax.minDate)))).toBeInTheDocument();

		let newDateMinMax = { maxDate: '2019-09-20', minDate: '2019-07-01' };
		rerender(<DesktopDatePicker {...defaultProps} dateMinMax={newDateMinMax} />);
		expect(screen.getByText('maxDate: ' + JSON.stringify(new Date(newDateMinMax.maxDate)))).toBeInTheDocument();
		expect(screen.getByText('minDate: ' + JSON.stringify(new Date(newDateMinMax.minDate)))).toBeInTheDocument();
	});

	it('should disable previous button when selected time is 12AM or loading', () => {
		let { rerender, baseElement, container } = render(<DesktopDatePicker {...defaultProps} />);
		expect(baseElement.querySelector('.prevBtnIdt')).not.toHaveAttribute('disabled');

		rerender(<DesktopDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.prevBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(true);
		rerender(<DesktopDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.prevBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(false);
		rerender(<DesktopDatePicker {...defaultProps} />);
		expect(container.querySelector('.prevBtnIdt')).not.toHaveAttribute('disabled');
	});

	it('should disable next button when selected time is 11PM or loading', () => {
		let { rerender, baseElement, container } = render(<DesktopDatePicker {...defaultProps} />);
		expect(baseElement.querySelector('.nextBtnIdt')).not.toHaveAttribute('disabled');

		rerender(<DesktopDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.nextBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(true);
		rerender(<DesktopDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.nextBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(false);
		rerender(<DesktopDatePicker {...defaultProps} />);
		expect(container.querySelector('.nextBtnIdt')).not.toHaveAttribute('disabled');
	});

	it('should change the selected date to previous 1 hour when previous button is clicked', () => {
		render(<DesktopDatePicker {...defaultProps} />);
		userEvent.click(screen.queryAllByTestId('Button')[1]);
		expect(helper.navigateTime).toHaveBeenCalledWith(
			defaultDate,
			defaultSetSelected,
			expect.any(Function),
			expect.any(Function),
			defaultRefresh,
			'sub'
		);
	});

	it('should change the selected date to next 1 hour when next button is clicked', () => {
		render(<DesktopDatePicker {...defaultProps} />);
		userEvent.click(screen.queryAllByTestId('Button')[2]);
		expect(helper.navigateTime).toHaveBeenCalledWith(
			defaultDate,
			defaultSetSelected,
			expect.any(Function),
			expect.any(Function),
			defaultRefresh,
			'add'
		);
	});
});

describe('<MobileDatePicker/>', () => {
	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		helper.resetIsArrowDisabled();
		cleanup();
	});

	it('should match snapshot', () => {
		let { asFragment } = render(<MobileDatePicker {...defaultProps} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display selected date in a datepicker input', () => {
		let { rerender } = render(<MobileDatePicker {...defaultProps} />);
		expect(screen.getByText(JSON.stringify(new Date(defaultDate)))).toBeInTheDocument();

		let newDate = setDate('9/20/2021 5:00:00 PM');
		rerender(<MobileDatePicker {...defaultProps} selectedDate={newDate} />);
		expect(screen.getByText(JSON.stringify(new Date(newDate)))).toBeInTheDocument();
	});

	it('should be able to change and start fetch selected date', () => {
		let { rerender } = render(<MobileDatePicker {...defaultProps} />);
		userEvent.click(screen.getByTestId('MobileDateTimePicker'));
		expect(defaultSetSelected).toHaveBeenNthCalledWith(1, defaultDate);
		expect(defaultRefresh).toHaveBeenCalled();

		let newDate = setDate('9/20/2021 5:00:00 PM');
		rerender(<MobileDatePicker {...defaultProps} selectedDate={newDate} />);
		userEvent.click(screen.getByTestId('MobileDateTimePicker'));
		expect(defaultSetSelected).toHaveBeenNthCalledWith(2, newDate);
		expect(defaultRefresh).toHaveBeenCalled();
	});

	it('should allow only dates that are within allowable range', () => {
		let { rerender } = render(<MobileDatePicker {...defaultProps} />);
		expect(screen.getByText('maxDate: ' + JSON.stringify(new Date(defaultDateMinMax.maxDate)))).toBeInTheDocument();
		expect(screen.getByText('minDate: ' + JSON.stringify(new Date(defaultDateMinMax.minDate)))).toBeInTheDocument();

		let newDateMinMax = { maxDate: '2019-09-20', minDate: '2019-07-01' };
		rerender(<MobileDatePicker {...defaultProps} dateMinMax={newDateMinMax} />);
		expect(screen.getByText('maxDate: ' + JSON.stringify(new Date(newDateMinMax.maxDate)))).toBeInTheDocument();
		expect(screen.getByText('minDate: ' + JSON.stringify(new Date(newDateMinMax.minDate)))).toBeInTheDocument();
	});

	it('should disable previous button when minimum time requirement was reached or loading', () => {
		let { rerender, baseElement, container } = render(<MobileDatePicker {...defaultProps} />);
		expect(baseElement.querySelector('.prevBtnIdt')).not.toHaveAttribute('disabled');

		rerender(<MobileDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.prevBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(true);
		rerender(<MobileDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.prevBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(false);
		rerender(<MobileDatePicker {...defaultProps} />);
		expect(container.querySelector('.prevBtnIdt')).not.toHaveAttribute('disabled');
	});

	it('should disable next button when maximum time requirement was reached or loading', () => {
		let { rerender, baseElement, container } = render(<MobileDatePicker {...defaultProps} />);
		expect(baseElement.querySelector('.nextBtnIdt')).not.toHaveAttribute('disabled');

		rerender(<MobileDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.nextBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(true);
		rerender(<MobileDatePicker {...defaultProps} transactionLogLoading={true} />);
		expect(container.querySelector('.nextBtnIdt')).toHaveAttribute('disabled');

		helper.setIsArrowDisabled(false);
		rerender(<MobileDatePicker {...defaultProps} />);
		expect(container.querySelector('.nextBtnIdt')).not.toHaveAttribute('disabled');
	});

	it('should change the selected date to previous 1 hour when previous button is clicked', () => {
		render(<MobileDatePicker {...defaultProps} />);
		userEvent.click(screen.queryAllByTestId('Button')[0]);
		expect(helper.navigateTime).toHaveBeenCalledWith(
			defaultDate,
			defaultSetSelected,
			expect.any(Function),
			expect.any(Function),
			defaultRefresh,
			'sub'
		);
	});

	it('should change the selected date to next 1 hour when next button is clicked', () => {
		render(<MobileDatePicker {...defaultProps} />);
		userEvent.click(screen.queryAllByTestId('Button')[1]);
		expect(helper.navigateTime).toHaveBeenCalledWith(
			defaultDate,
			defaultSetSelected,
			expect.any(Function),
			expect.any(Function),
			defaultRefresh,
			'add'
		);
	});
});
