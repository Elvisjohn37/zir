import React from 'react';
import { render, screen } from '@testing-library/react';
import usePlayerBetList from './usePlayerBetList';
import * as backend from 'frontend/ajax/backend';

jest.mock('frontend/ajax/backend');

let mockedUseState = jest.spyOn(React, 'useState');

describe('usePlayerBetList()', () => {
	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
		backend.resetPlayerBetListData();
	});

	let TestComponent = ({ isAfterHooks = true, transactionType = 'betting' }) => {
		let [isFetching, setIsFetching] = mockedUseState(true);
		let [isPromoBettingListError, setIsPromoBettingListError] = mockedUseState(false);

		if (!isAfterHooks) {
			return <div>Fetching</div>;
		}

		let params = {
			isFetching: true,
			setIsFetching,
			date: '2021-07-15',
			page: 1,
			setIsPromoBettingListError,
			type: transactionType,
		};

		if (transactionType == 'betting') {
			params = { ...params, productID: 1 };
			jest.spyOn(backend, 'getPlayerBetList');
		} else {
			jest.spyOn(backend, 'getPlayerPromoList');
		}

		let playerBetList = usePlayerBetList(params);

		return (
			<>
				<div>{isPromoBettingListError ? 'Bet List Error' : 'Bet List Not Error'}</div>
				<div>{isFetching ? 'fetching' : 'fetched'}</div>
				<div>{isPromoBettingListError ? 'Error' : 'Not Error'}</div>
				<div>{JSON.stringify(playerBetList.content)}</div>
			</>
		);
	};

	it('should request betting record if the event type is betting', () => {
		render(<TestComponent />);
		expect(backend.getPlayerBetList).toHaveBeenCalledWith({
			date: '2021-07-15',
			productID: 1,
			page: 1,
			success: expect.any(Function),
			error: expect.any(Function),
		});
	});

	it('should request promotion record if the event type is not betting', () => {
		render(<TestComponent transactionType="not betting" />);
		expect(backend.getPlayerPromoList).toHaveBeenCalledWith({
			date: '2021-07-15',
			page: 1,
			success: expect.any(Function),
			error: expect.any(Function),
		});
	});

	it('should update fetching indicator before and after data is loaded', () => {
		render(<TestComponent />);
		expect(screen.getByText('fetched')).toBeInTheDocument();

		jest.clearAllMocks();
		jest.clearAllTimers();
		backend.resetPlayerBetListData();
		render(<TestComponent isAfterHooks={false} />);
		expect(screen.getByText('Fetching')).toBeInTheDocument();
	});

	it('should update error indicator when loading fails', () => {
		backend.setPlayerBetListData(false);
		render(<TestComponent />);
		expect(screen.getByText('Error')).toBeInTheDocument();

		jest.clearAllMocks();
		jest.clearAllTimers();
		backend.resetPlayerBetListData();
		render(<TestComponent />);

		expect(screen.getByText('Not Error')).toBeInTheDocument();
	});
});
