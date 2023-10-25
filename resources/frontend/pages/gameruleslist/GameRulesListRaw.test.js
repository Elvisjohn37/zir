import React from 'react';
import GameRulesListRaw from './GameRulesListRaw';
import { render } from '@testing-library/react';
import * as gameRulesHelper from 'frontend/tests/gameRulesHelper';
import * as reactRouterDom from 'react-router-dom';
import * as lodash from 'lodash';

jest.mock('@mui/material/Container');
jest.mock('@mui/material/Grid');
jest.mock('@mui/material/Button');
jest.mock('@mui/icons-material/InsertDriveFile');
jest.mock('classnames');
jest.mock('@mui/material/IconButton');
jest.mock('@mui/icons-material/ArrowBack');
jest.mock('react-router-dom');
jest.mock('lodash');
jest.mock('frontend/components/GameRulesLoader');
jest.mock('frontend/components/GameRulesErrorMessage');

describe('<GameRulesListRaw/>', () => {
	beforeEach(() => {
		gameRulesHelper.resetGameRulesState();
		reactRouterDom.resetUseParams();
	});

	it('should match snapshot', () => {
		reactRouterDom.setUseParams({ product: 'games', gameType: 'table-games' });
		let { asFragment } = render(<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loader while game rules list data is loading', () => {
		reactRouterDom.setUseParams({ product: 'games', gameType: 'table-games' });

		gameRulesHelper.setGameRulesState({
			isLoading: true,
		});

		let { getByTestId, queryByTestId, rerender } = render(
			<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />
		);

		expect(getByTestId('GameRulesLoader')).toBeInTheDocument();

		gameRulesHelper.setGameRulesState({
			isLoading: false,
		});

		rerender(<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);

		expect(queryByTestId('GameRulesLoader')).not.toBeInTheDocument();
	});

	it('should display game rules list correctly', () => {
		reactRouterDom.setUseParams({ product: 'games', gameType: 'table-games' });
		let currentPath = reactRouterDom.useLocation().pathname;
		let gameRulesState = gameRulesHelper.getGameRulesState();
		let { baseElement, rerender } = render(
			<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />
		);
		let filteredGameRules = gameRulesState.gameRulesList.filter(
			(item) =>
				lodash.kebabCase(item.productName) == 'games' && lodash.kebabCase(item.gameTypeName) == 'table-games'
		);
		let gameRulesListDom = baseElement.querySelectorAll('.button');

		filteredGameRules.map((gr, index) => {
			let gameRulesListItem = gameRulesListDom[index];
			let isNewtag = gameRulesListItem.querySelector('.newTag');

			expect(gameRulesListItem).toHaveAttribute('to', `${currentPath}/${lodash.kebabCase(gr.gameName)}`);

			if (gr.isNew) {
				expect(gameRulesListItem).toHaveClass('isNew');
				expect(isNewtag).toBeInTheDocument();
			} else {
				expect(gameRulesListItem).not.toHaveClass('isNew');
				expect(isNewtag).not.toBeInTheDocument();
			}
		});

		reactRouterDom.setUseParams({ product: 'multiplayer', gameType: 'card-games' });
		rerender(<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);
		filteredGameRules = gameRulesState.gameRulesList.filter(
			(item) =>
				lodash.kebabCase(item.productName) == 'multiplayer' &&
				lodash.kebabCase(item.gameTypeName) == 'card-games'
		);
		gameRulesListDom = baseElement.querySelectorAll('.button');

		filteredGameRules.map((gr, index) => {
			let gameRulesListItem = gameRulesListDom[index];
			let isNewtag = gameRulesListItem.querySelector('.newTag');

			expect(gameRulesListItem).toHaveAttribute('to', `${currentPath}/${lodash.kebabCase(gr.gameName)}`);

			if (gr.isNew) {
				expect(gameRulesListItem).toHaveClass('isNew');
				expect(isNewtag).toBeInTheDocument();
			} else {
				expect(gameRulesListItem).not.toHaveClass('isNew');
				expect(isNewtag).not.toBeInTheDocument();
			}
		});
	});

	it('should display error message when game rules list data loading failed', () => {
		reactRouterDom.setUseParams({ product: 'multiplayer', gameType: 'card-games' });

		let { getByTestId, queryByTestId, rerender } = render(
			<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />
		);

		expect(queryByTestId('GameRulesErrorMessage')).not.toBeInTheDocument();

		gameRulesHelper.setGameRulesState({
			isError: true,
		});

		rerender(<GameRulesListRaw gameRulesState={gameRulesHelper.getGameRulesState()} />);

		expect(getByTestId('GameRulesErrorMessage')).toBeInTheDocument();
	});
});
