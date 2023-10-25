import React from 'react';
import RunningDateTime from './RunningDateTime';
import { render, act } from '@testing-library/react';

jest.mock('react-intl');

describe('<RunningDateTime />', () => {
	let spyDate;

	beforeEach(() => {
		let mockDate = new Date('11/11/2021, 1:51:00 PM');
		spyDate = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
		spyDate.mockRestore();
	});

	it('should match snapshot', () => {
		expect(render(<RunningDateTime />)).toMatchSnapshot();
	});

	it('should auto update date and time every 10000 milisecond', () => {
		let { getByTestId } = render(<RunningDateTime />);

		expect(getByTestId('FormattedDate')).toHaveAttribute(
			'value',
			JSON.stringify(new Date('11/11/2021, 1:51:00 PM'))
		);

		act(() => {
			jest.advanceTimersByTime(10000);
		});

		expect(getByTestId('FormattedDate')).toHaveAttribute(
			'value',
			JSON.stringify(new Date('11/11/2021, 1:51:10 PM'))
		);

		act(() => {
			jest.advanceTimersByTime(10000);
		});

		expect(getByTestId('FormattedDate')).toHaveAttribute(
			'value',
			JSON.stringify(new Date('11/11/2021, 1:51:20 PM'))
		);

		act(() => {
			jest.advanceTimersByTime(10000);
		});

		expect(getByTestId('FormattedDate')).toHaveAttribute(
			'value',
			JSON.stringify(new Date('11/11/2021, 1:51:30 PM'))
		);
	});
});
