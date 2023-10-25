import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GameRulesContentRaw from './GameRulesContentRaw';
import * as gameRulesHelper from 'frontend/tests/gameRulesHelper';
import * as reactRouterDom from 'react-router-dom';
import * as iframeHandler from './gamerulescontentraw/iframeHandler';
import lodash from 'lodash';

jest.mock('react-router-dom');
jest.mock('@mui/material/Container');
jest.mock('@mui/material/IconButton');
jest.mock('@mui/icons-material/ArrowBack');
jest.mock('frontend/components/SeamlessIframe');
jest.mock('./gamerulescontentraw/iframeHandler');
jest.mock('classnames');
jest.mock('lodash');
jest.mock('frontend/components/GameRulesErrorMessage');
jest.mock('frontend/components/GameRulesLoader');

describe('<GameRulesContentRaw />', () => {
	beforeEach(() => {
		gameRulesHelper.resetGameRulesState();
		reactRouterDom.resetUseParams();
	});

	it('should match snapshot', () => {
		reactRouterDom.setUseParams({
			gameName: 'dice-wars-mobile',
		});
		let { asFragment } = render(<GameRulesContentRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loader when game rules content is loading', () => {
		reactRouterDom.setUseParams({
			gameName: 'dice-wars-mobile',
		});

		gameRulesHelper.setGameRulesState({
			isLoading: true,
		});

		let { queryByTestId, getByTestId, rerender } = render(
			<GameRulesContentRaw gameRulesState={gameRulesHelper.getGameRulesState()} />
		);

		expect(getByTestId('GameRulesLoader')).toBeInTheDocument();

		gameRulesHelper.setGameRulesState({
			isLoading: false,
		});

		rerender(<GameRulesContentRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);

		expect(getByTestId('GameRulesLoader')).toBeInTheDocument();

		fireEvent.load(getByTestId('SeamlessIframe'));

		expect(queryByTestId('GameRulesLoader')).not.toBeInTheDocument();
	});

	it('should display game rules after loading', () => {
		jest.spyOn(iframeHandler, 'loadGoogleDocsIframe');
		reactRouterDom.setUseParams({
			gameName: 'yin-yang-treasure-mobile',
		});

		let gameDetails = gameRulesHelper
			.getGameRulesState()
			.gameRulesList.find((game) => lodash.kebabCase(game.gameName) == 'dice-wars-mobile');
		let { getByTestId } = render(<GameRulesContentRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);
		let iframe = getByTestId('SeamlessIframe');
		fireEvent.load(iframe);

		expect(iframe.getAttribute('iframeholderclassname').includes('isContentLoading')).toBeFalsy();
		expect(iframeHandler.loadGoogleDocsIframe).toHaveBeenCalledWith(iframe, gameDetails.url, {
			success: expect.any(Function),
			error: expect.any(Function),
		});
	});

	it('should display error message when game rules data loading failed', () => {
		reactRouterDom.setUseParams({
			gameName: 'yin-yang-treasure-mobile',
		});

		let { getByTestId, queryByTestId, rerender } = render(
			<GameRulesContentRaw gameRulesState={gameRulesHelper.getGameRulesState()} />
		);

		expect(queryByTestId('GameRulesErrorMessage')).not.toBeInTheDocument();

		gameRulesHelper.setGameRulesState({
			isError: true,
		});

		rerender(<GameRulesContentRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);

		expect(getByTestId('GameRulesErrorMessage')).toBeInTheDocument();
	});
});
