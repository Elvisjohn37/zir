import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import usePlayerTransferList from './usePlayerTransferList';
import * as backend from 'frontend/ajax/backend';

jest.mock('frontend/ajax/backend');

describe('usePlayerTransferList()', () => {
	afterEach(() => {
		resetComponent();
	});

	function resetComponent() {
		jest.clearAllMocks();
		jest.clearAllTimers();
		backend.resetPlayerTransferListData();
		cleanup();
	}

	let TestComponent = ({ isAfterHooks = true }) => {
		let [isFetching, setIsFetching] = React.useState(true);
		let [isTransferListError, setTransferListError] = React.useState(false);

		if (!isAfterHooks) {
			return <div>fetching</div>;
		}

		let playerTransferList = usePlayerTransferList({
			isFetching: true,
			setIsFetching,
			date: '2021-07-15',
			page: 1,
			setTransferListError,
		});

		return (
			<>
				<div>{isFetching ? 'fetching' : 'fetched'}</div>
				<div>{isTransferListError ? 'Transfer List Error' : 'Transfer List Not Error'}</div>
				<div>{JSON.stringify(playerTransferList.content)}</div>
			</>
		);
	};

	it('should fetching indicator state will be false after request from backend', () => {
		render(<TestComponent isAfterHooks={false} />);
		expect(screen.queryByText('fetching')).toBeInTheDocument();
		expect(screen.queryByText('fetched')).not.toBeInTheDocument();

		resetComponent();

		render(<TestComponent />);
		expect(screen.queryByText('fetched')).toBeInTheDocument();
		expect(screen.queryByText('fetching')).not.toBeInTheDocument();
	});

	it('should return an object with required properties', () => {
		render(<TestComponent />);
		expect(screen.queryByText(JSON.stringify(backend.playerTransferList().data.data.content))).toBeInTheDocument();
	});

	it('should error indicator state will be true if request from backend is failed', () => {
		backend.setPlayerTransferListData(false);
		render(<TestComponent />);
		expect(screen.queryByText('Transfer List Error')).toBeInTheDocument();

		resetComponent();

		render(<TestComponent />);
		expect(screen.queryByText('Transfer List Not Error')).toBeInTheDocument();
	});
});
