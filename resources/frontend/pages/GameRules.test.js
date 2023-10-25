import React from 'react';
import { render } from '@testing-library/react';
import GameRules from './GameRules';
import { setGameRulesState, resetGameRulesState, getGameRulesState } from 'frontend/contexts/GameRules';
import { extractProductGameType } from './gamerules/helper';
import * as lodash from 'lodash';

jest.mock('@mui/material/Link');
jest.mock('react-router-dom');
jest.mock('react-intl');
jest.mock('frontend/components/Language');
jest.mock('frontend/contexts/GameRules');
jest.mock('frontend/components/GameRulesLoader');
jest.mock('lodash');
jest.mock('./gamerules/helper');
jest.mock('frontend/components/GameRulesErrorMessage');
jest.mock('classnames');

describe('GameRules Component', () => {
	beforeEach(() => {
		resetGameRulesState();
	});

	it('should match snapshot', () => {
		let { asFragment } = render(<GameRules />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loading indicator while game rules list is fetching', () => {
		setGameRulesState({
			isLoading: true,
		});
		let { getByTestId, queryByTestId, rerender } = render(<GameRules />);

		expect(getByTestId('GameRulesLoader')).toBeInTheDocument;

		resetGameRulesState();
		rerender(<GameRules />);

		expect(queryByTestId('GameRulesLoader')).not.toBeInTheDocument();
	});

	it('should redirect live casino game rules to correct URL', () => {
		let { baseElement } = render(<GameRules />);
		let liveCasinoLink = baseElement.querySelectorAll('.liveCasinoLink');
		let gameRulesState = getGameRulesState();
		liveCasinoLink.forEach((link) => {
			expect(link.getAttribute('href').startsWith(gameRulesState.config.liveDealerGameLink)).toBeTruthy();
		});
	});

	it('should display zircon product and game type link to group of game rules', () => {
		let { baseElement } = render(<GameRules />);
		let products = baseElement.querySelectorAll('.gameRulesProduct');
		let gameRulesList = extractProductGameType(getGameRulesState().gameRulesList);

		gameRulesList.map((gameRule, index) => {
			let product = products[index];
			let productTitle = product.querySelector('[data-testid="FormattedMessage"]');
			let allGameTypesLink = product.querySelectorAll('a');

			expect(productTitle).toHaveAttribute('id', `casinoGames.${lodash.camelCase(gameRule.productName)}`);

			gameRule.gameTypes.map((gameType, gameTypeIndex) => {
				let gameTypeLink = allGameTypesLink[gameTypeIndex];
				let gameTypeTitle = gameTypeLink.querySelector('[data-testid="FormattedMessage"]');

				expect(gameTypeLink).toHaveAttribute(
					'to',
					`/gamerules/${lodash.kebabCase(gameRule.productName)}/${lodash.kebabCase(gameType)}`
				);
				expect(gameTypeTitle).toHaveAttribute('id', `casinoGames.${lodash.camelCase(gameType)}`);
			});
		});
	});

	it('should display error message when gamerules response is not valid', () => {
		setGameRulesState({
			isError: true,
		});
		let { getByTestId } = render(<GameRules />);

		expect(getByTestId('GameRulesErrorMessage')).toBeInTheDocument();
	});
});
