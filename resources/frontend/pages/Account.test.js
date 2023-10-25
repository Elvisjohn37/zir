import React from 'react';
import { render, screen, cleanup, within } from '@testing-library/react';
import Account from './Account';
import userEvent from '@testing-library/user-event';
import * as OpenWindow from './account/helper';
import { setUserState } from 'frontend/contexts/User';

jest.mock('@mui/material/Button');
jest.mock('@mui/material/Grid');
jest.mock('frontend/components/Language');
jest.mock('frontend/contexts/User');
jest.mock('react-intl');
jest.mock('react-router-dom');
jest.mock('./account/helper');

describe('<Account />', () => {
	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should match snapshot', () => {
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		let { asFragment } = render(<Account />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should open window once clicked the transfer funds menu', () => {
		jest.spyOn(OpenWindow, 'openAccountWindow');
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		render(<Account />);

		let button = screen.getAllByTestId('Button')[0];
		userEvent.click(button);
		expect(OpenWindow.openAccountWindow).toHaveBeenCalledWith('/account/transferfunds');
	});

	it('should open window once clicked the balance menu', () => {
		jest.spyOn(OpenWindow, 'openAccountWindow');
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		render(<Account />);

		let button = screen.getAllByTestId('Button')[1];
		userEvent.click(button);
		expect(OpenWindow.openAccountWindow).toHaveBeenCalledWith('/account/balance');
	});

	it('should open window once clicked the limit adjust menu', () => {
		jest.spyOn(OpenWindow, 'openAccountWindow');
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		render(<Account />);

		let button = screen.getAllByTestId('Button')[2];
		userEvent.click(button);
		expect(OpenWindow.openAccountWindow).toHaveBeenCalledWith('/account/limitadjust');
	});

	it('should open window once clicked the self exclusion menu', () => {
		jest.spyOn(OpenWindow, 'openAccountWindow');
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		render(<Account />);

		let button = screen.getAllByTestId('Button')[3];
		userEvent.click(button);
		expect(OpenWindow.openAccountWindow).toHaveBeenCalledWith('/account/selfexclusion');
	});

	it('should redirect page once clicked the archived report', () => {
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		let { container } = render(<Account />);

		expect(container.querySelector('a[to="/account/archived-report"]')).toBeInTheDocument();
	});

	it('should display funds menu if the player is walkin', () => {
		setUserState({ user: { parent: 'test', isWalkIn: 1 } });
		let { rerender } = render(<Account />);

		expect(screen.getByText('transferfunds')).toBeInTheDocument();

		setUserState({ user: { parent: 'test', isWalkIn: 0 } });
		rerender(<Account />);
		expect(screen.queryByText('transferfunds')).toBeNull();
	});
});
