import React from 'react';
import GameRulesContent from './GameRulesContent';
import { render } from '@testing-library/react';
import { getGameRulesState } from 'frontend/contexts/GameRules';

jest.mock('frontend/contexts/GameRules');
jest.mock('frontend/components/Language');
jest.mock('./gamerulescontent/GameRulesContentRaw');

describe('<GameRulesContent />', () => {
	it('should match snapshot', () => {
		let { asFragment } = render(<GameRulesContent />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should game rules content with correct data', () => {
		let gameRulesState = getGameRulesState();
		let { getByTestId } = render(<GameRulesContent />);
		let gameRulesContent = getByTestId('GameRulesContentRaw');

		expect(gameRulesContent).toHaveAttribute('gamerulesstate', JSON.stringify(gameRulesState));
	});
});
