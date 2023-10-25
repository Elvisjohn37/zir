import React from 'react';
import GameRulesList from './GameRulesList';
import { render } from '@testing-library/react';
import { getGameRulesState } from 'frontend/contexts/GameRules';

jest.mock('frontend/contexts/GameRules');
jest.mock('frontend/components/Language');
jest.mock('./gameruleslist/GameRulesListRaw');

describe('<GameRulesList />', () => {
	it('should match snapshot', () => {
		let { asFragment } = render(<GameRulesList />);
		expect(asFragment()).toMatchSnapshot();
	});
	it('should display game rules list with correct data', () => {
		let gameRulesState = getGameRulesState();
		let { getByTestId } = render(<GameRulesList />);
		let gameRulesList = getByTestId('GameRulesListRaw');

		expect(gameRulesList).toHaveAttribute('gamerulesstate', JSON.stringify(gameRulesState));
	});
});
