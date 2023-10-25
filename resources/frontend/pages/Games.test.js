import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Games from './Games';
import * as useGames from './games/useGames';
import * as helper from 'frontend/utils/helper';
import * as gameHelper from 'frontend/utils/gameHelper';
import * as layout from 'frontend/contexts/Layout';
import * as reactRouterDom from 'react-router-dom';

jest.mock('frontend/components/Language');
jest.mock('frontend/utils/helper');
jest.mock('./games/Notifications');
jest.mock('./games/useGames');
jest.mock('frontend/components/Banner');
jest.mock('./games/GameCategories');
jest.mock('frontend/components/ErrorBoundary');
jest.mock('react-router-dom');
jest.mock('frontend/utils/gameHelper');
jest.mock('frontend/contexts/Language');
jest.mock('./games/SearchBar');
jest.mock('lodash');
jest.mock('frontend/components/OnPageError');
jest.mock('@mui/icons-material/Search');
jest.mock('@mui/icons-material/ArrowBack');
jest.mock('@mui/material/Button');
jest.mock('react-intl');
jest.mock('frontend/contexts/Layout');
jest.mock('frontend/components/GameThumbnail');
jest.mock('./games/GameDialog');

describe('</Games>', () => {
	beforeEach(() => {
		useGames.resetUseGames();
		useGames.unblockUseGames();
		gameHelper.resetGameParams();
		layout.resetLayoutState();
		reactRouterDom.resetUseHistory();
		jest.clearAllMocks();
	});

	it('should match snapshot', () => {
		let { asFragment } = render(<Games />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loading indicator on first load', () => {
		useGames.blockUseGames();
		let { getByTestId } = render(<Games />);
		expect(getByTestId('GameThumbnailLoader')).toBeInTheDocument();
	});

	it('should fetch games from backend on first load', () => {
		jest.spyOn(useGames, 'default');
		render(<Games />);
		expect(useGames.default).toHaveBeenCalledWith({
			setGameTypes: expect.any(Function),
			setGames: expect.any(Function),
			setGameError: expect.any(Function),
			isLoading: true,
			setIsLoading: expect.any(Function),
			isMobileDevice: helper.isMobileDevice(),
		});
	});

	it('should display recent games', () => {
		let { getByTestId } = render(<Games />);
		let recentList = getByTestId('GameRecentList');

		expect(recentList).toBeInTheDocument();
		expect(recentList).toHaveAttribute('games', JSON.stringify(useGames.getUseGames().data.data));
	});

	it('should display top pick games', () => {
		let { getByTestId } = render(<Games />);
		let topList = getByTestId('GameTopList');

		expect(topList).toBeInTheDocument();
		expect(topList).toHaveAttribute('games', JSON.stringify(useGames.getUseGames().data.data));
	});

	it('should display top games of each categories', () => {
		let { getAllByTestId } = render(<Games />);
		let gameTypeList = getAllByTestId('GameTypeList');
		let useGamesData = useGames.getUseGames();

		useGamesData.data.data.gameTypeNames.map((gameTypeName, index) => {
			let gameTypeComponentProps = gameTypeList[index];
			expect(gameTypeComponentProps).toHaveAttribute('games', JSON.stringify(useGamesData.data.data));
			expect(gameTypeComponentProps).toHaveAttribute('type', gameTypeName);
		});
	});

	it('should display filtered games when user enter text on search input', () => {
		let { getByTestId, getAllByTestId } = render(<Games />);
		let searchBar = getByTestId('SearchBar');

		userEvent.type(searchBar, 'Everything');

		getAllByTestId('GameThumbnail').forEach((searchedGame) => {
			let gameAttribute = JSON.parse(searchedGame.getAttribute('game'));
			expect(gameAttribute.gameName.indexOf('Everything') != -1).toBeTruthy();
		});

		userEvent.clear(searchBar);
		userEvent.type(searchBar, 'Virtual');
		getAllByTestId('GameThumbnail').forEach((searchedGame) => {
			let gameAttribute = JSON.parse(searchedGame.getAttribute('game'));
			expect(gameAttribute.gameName.indexOf('Virtual') != -1).toBeTruthy();
		});
	});

	it('should open game list popup when open with type in route', () => {
		let historyPush = jest.fn();
		reactRouterDom.setUseHistory({ push: historyPush });

		let { queryByTestId, getByTestId, rerender } = render(<Games />);
		let useGamesData = useGames.getUseGames();
		let useGamesDataJson = JSON.stringify(useGamesData.data.data);
		let gameDialog = queryByTestId('GameDialog');

		expect(gameDialog).not.toBeInTheDocument();

		let wrapper2GameParams = { gameType: 'table-games', page: 'games' };
		gameHelper.setGameParams(wrapper2GameParams);

		rerender(<Games />);
		gameDialog = getByTestId('GameDialog');
		userEvent.click(gameDialog);

		expect(gameDialog).toBeInTheDocument();
		expect(gameDialog).toHaveAttribute('games', useGamesDataJson);
		expect(gameDialog).toHaveAttribute('type', wrapper2GameParams.gameType);
		expect(gameDialog).toHaveAttribute('ismobilesite', 'false');
		expect(historyPush).toHaveBeenNthCalledWith(1, '/' + wrapper2GameParams.page);

		let wrapper3GameParams = { gameType: 'super-slots', page: 'skill-games' };
		gameHelper.setGameParams(wrapper3GameParams);

		rerender(<Games />);
		gameDialog = getByTestId('GameDialog');
		userEvent.click(gameDialog);

		expect(gameDialog).toBeInTheDocument();
		expect(gameDialog).toHaveAttribute('games', useGamesDataJson);
		expect(gameDialog).toHaveAttribute('type', wrapper3GameParams.gameType);
		expect(gameDialog).toHaveAttribute('ismobilesite', 'false');
		expect(historyPush).toHaveBeenNthCalledWith(2, '/' + wrapper3GameParams.page);
	});

	it('should display error message when fetching from backend fails', () => {
		let gameError = { data: { result: false } };
		useGames.setUseGames(gameError);

		let { getByTestId } = render(<Games />);
		let errorMessage = getByTestId('ErrorMessageDisplay');

		expect(errorMessage).toBeInTheDocument();
		expect(errorMessage).toHaveAttribute('response', JSON.stringify(gameError));
	});

	it('should display error message when searched game is not found', () => {
		let useGamesData = useGames.getUseGames();
		let { getByTestId, getAllByTestId, queryByTestId } = render(<Games />);
		let searchBar = getByTestId('SearchBar');

		userEvent.type(searchBar, 'Wrong Game Name');
		let GameThumbnail = queryByTestId('GameThumbnail');
		let errorMessage = getByTestId('ErrorLight');
		let backButton = getByTestId('Button');

		expect(GameThumbnail).not.toBeInTheDocument();
		expect(errorMessage).toBeInTheDocument();

		userEvent.click(backButton);
		let recentList = getByTestId('GameRecentList');
		let topPick = getByTestId('GameTopList');
		let gameTypeList = getAllByTestId('GameTypeList');

		expect(errorMessage).not.toBeInTheDocument();
		expect(recentList).toBeInTheDocument();
		expect(topPick).toBeInTheDocument();
		useGamesData.data.data.gameTypeNames.map((gameTypeName, index) => {
			let gameTypeComponentProps = gameTypeList[index];
			expect(gameTypeComponentProps).toHaveAttribute('games', JSON.stringify(useGamesData.data.data));
			expect(gameTypeComponentProps).toHaveAttribute('type', gameTypeName);
		});
	});
});
