import React from 'react';
import useGames from './useGames';
import * as backend from 'frontend/ajax/backend';
import * as gameHelper from 'frontend/utils/gameHelper';
import { render, cleanup } from '@testing-library/react';

jest.mock('frontend/ajax/backend');
jest.mock('frontend/utils/gameHelper');
jest.mock('react-router-dom');

describe('useGames()', () => {
	beforeEach(() => {
		gameHelper.resetGameParams();
		backend.resetGetGame();
		jest.clearAllMocks();
	});

	function TestComponent({ isMobileDevice, isLoading }) {
		let [games, setGames] = React.useState([]);
		let [gameTypes, setGameTypes] = React.useState([]);
		let [gameError, setGameError] = React.useState(null);
		let [isLoadingState, setIsLoading] = React.useState(isLoading);

		useGames({
			setGameTypes,
			setGames,
			setGameError,
			isLoading,
			isMobileDevice,
			setIsLoading,
		});

		return (
			<div
				data-testid="testElement"
				games={JSON.stringify(games)}
				gametypes={JSON.stringify(gameTypes)}
				gameerror={JSON.stringify(gameError)}
				isloading={JSON.stringify(isLoadingState)}
			>
				test
			</div>
		);
	}

	it('should not set game data when not loading', () => {
		jest.spyOn(backend, 'getGame');

		let { getByTestId } = render(<TestComponent isMobileDevice={false} isLoading={false} />);
		let testDiv = getByTestId('testElement');

		expect(backend.getGame).toHaveBeenCalledTimes(0);
		expect(testDiv).toHaveAttribute('games', '[]');
		expect(testDiv).toHaveAttribute('gametypes', '[]');
		expect(testDiv).toHaveAttribute('gameerror', 'null');
		expect(testDiv).toHaveAttribute('isloading', 'false');
	});

	it('should set game data when loading', () => {
		jest.spyOn(backend, 'getGame');

		let gameData = backend.getGameData();
		let stringifyGames = JSON.stringify(gameData.data.data);
		let stringifyGameTypes = JSON.stringify(gameData.data.data.gameTypeNames);

		let wrapper1GameParams = { gameType: 'table-games', page: 'games' };
		gameHelper.setGameParams(wrapper1GameParams);

		let { getByTestId } = render(<TestComponent isMobileDevice={false} isLoading={true} />);
		let testDiv1 = getByTestId('testElement');
		let games1 = testDiv1.getAttribute('games');
		let gametypes1 = testDiv1.getAttribute('gametypes');
		let gameerror1 = testDiv1.getAttribute('gameerror');
		let isloading1 = testDiv1.getAttribute('isloading');
		cleanup();

		let wrapper2GameParams = { gameType: 'slot-games', page: 'skill-games' };
		gameHelper.setGameParams(wrapper2GameParams);

		let { getByTestId: getByTestId2 } = render(<TestComponent isMobileDevice={true} isLoading={true} />);
		let testDiv2 = getByTestId2('testElement');
		let games2 = testDiv2.getAttribute('games');
		let gametypes2 = testDiv2.getAttribute('gametypes');
		let gameerror2 = testDiv2.getAttribute('gameerror');
		let isloading2 = testDiv2.getAttribute('isloading');

		expect(backend.getGame).toHaveBeenCalledTimes(2);
		expect(backend.getGame).toHaveBeenNthCalledWith(1, {
			isErrorHandled: true,
			isMobileDevice: false,
			page: 'games',
			success: expect.any(Function),
			error: expect.any(Function),
		});
		expect(backend.getGame).toHaveBeenNthCalledWith(2, {
			isErrorHandled: true,
			isMobileDevice: true,
			page: 'skill-games',
			success: expect.any(Function),
			error: expect.any(Function),
		});

		expect(games1).toEqual(stringifyGames);
		expect(gametypes1).toEqual(stringifyGameTypes);
		expect(gameerror1).toEqual('null');
		expect(isloading1).toEqual('false');

		expect(games2).toEqual(stringifyGames);
		expect(gametypes2).toEqual(stringifyGameTypes);
		expect(gameerror2).toEqual('null');
		expect(isloading2).toEqual('false');
	});

	it('should set error when fetching fails', () => {
		backend.setGetGame(false);

		let { getByTestId } = render(<TestComponent isMobileDevice={true} isLoading={true} />);
		let testDiv = getByTestId('testElement');

		expect(backend.getGame).toHaveBeenCalledTimes(1);
		expect(testDiv).toHaveAttribute('games', '[]');
		expect(testDiv).toHaveAttribute('gametypes', '[]');
		expect(testDiv).toHaveAttribute('gameerror', JSON.stringify(backend.getError().data));
		expect(testDiv).toHaveAttribute('isloading', 'false');
	});
});
