import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import usePlayerCreditList from './usePlayerCreditList';
import * as backend from 'frontend/ajax/backend';

jest.mock('frontend/ajax/backend');

describe('usePlayerCreditList()', () => {
	afterEach(() => {
		resetComponent();
	});

	function resetComponent() {
		jest.clearAllMocks();
		jest.clearAllTimers();
		backend.resetPlayerCreditListData();
		cleanup();
	}

	let TestComponent = ({ isAfterHooks = true }) => {
		let [isFetching, setIsFetching] = React.useState(true);
		let [isCreditListError, setCreditListError] = React.useState(false);

		if (!isAfterHooks) {
			return <div>fetching</div>;
		}

		let playerCreditList = usePlayerCreditList({
			isFetching: true,
			setIsFetching,
			date: '2021-07-15',
			page: 1,
			setCreditListError,
		});

		return (
			<>
				<div>{isFetching ? 'fetching' : 'fetched'}</div>
				<div>{isCreditListError ? 'Credit List Error' : 'Credit List Not Error'}</div>
				<div>{JSON.stringify(playerCreditList.content)}</div>
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
		expect(screen.queryByText(JSON.stringify(backend.playerCreditList().data.data.content))).toBeInTheDocument();
	});

	it('should error indicator state will be true if request from backend is failed', () => {
		backend.setPlayerCreditListData(false);
		render(<TestComponent />);
		expect(screen.queryByText('Credit List Error')).toBeInTheDocument();

		resetComponent();

		render(<TestComponent />);
		expect(screen.queryByText('Credit List Not Error')).toBeInTheDocument();
	});
});
