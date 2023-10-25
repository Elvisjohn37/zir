import React from 'react';
import Play from './Play';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { resetWindowResponse, setWindowResponse, windowResponse, setErrorResponse } from './play/helper';

jest.mock('frontend/components/OnPageError');
jest.mock('frontend/components/AccountBalance');
jest.mock('frontend/components/MoneyFormat');
jest.mock('react-intl');
jest.mock('frontend/components/Language');
jest.mock('./play/RunningDateTime');
jest.mock('frontend/contexts/User');
jest.mock('frontend/components/Spinner');
jest.mock('classnames');
jest.mock('frontend/components/Announcement');
jest.mock('./play/helper');
jest.mock('@mui/material/Dialog');
jest.mock('@mui/material/DialogActions');
jest.mock('@mui/material/DialogContentText');
jest.mock('@mui/material/DialogContent');
jest.mock('@mui/material/Button');
jest.mock('frontend/utils/helper');

describe('<Play />', () => {
	beforeEach(() => {
		resetWindowResponse();
	});

	it('should match snapshot', () => {
		let { asFragment, rerender } = render(<Play />);
		let desktopFragment = asFragment();

		setWindowResponse({ isMobile: true });
		rerender(<Play />);
		let mobileFragment = asFragment();

		expect(desktopFragment).toMatchSnapshot();
		expect(mobileFragment).toMatchSnapshot();
	});

	it('should display message when playable balance is zero', () => {
		let { getByTestId } = render(<Play />);

		expect(getByTestId('Dialog')).not.toHaveAttribute('open');

		cleanup();
		setWindowResponse({ balanceInfo: { playableBalance: 0 } });
		let { getByTestId: getByTestId2 } = render(<Play />);

		expect(getByTestId2('Dialog')).toHaveAttribute('open');
	});

	it('should display game announcement for desktop when device is desktop', () => {
		let { getByTestId } = render(<Play />);
		let announcement = getByTestId('Announcement');

		expect(announcement).toHaveAttribute('ismobile', 'false');
		expect(announcement).toHaveAttribute('viewType', windowResponse().data.productID);
	});

	it('should display game announcement for mobile when device is mobile', () => {
		setWindowResponse({ isMobile: true });
		let { getByTestId } = render(<Play />);
		let announcement = getByTestId('Announcement');

		expect(announcement).toHaveAttribute('ismobile', 'true');
		expect(announcement).toHaveAttribute('viewType', windowResponse().data.productID);
	});

	it('should display live date and time when device is desktop', () => {
		let { getByTestId, queryByTestId, rerender } = render(<Play />);

		expect(getByTestId('RunningDateTime')).toBeInTheDocument();

		setWindowResponse({ isMobile: true });

		rerender(<Play />);

		expect(queryByTestId('RunningDateTime')).not.toBeInTheDocument();
	});

	it('should display max payout when  device is desktop ', () => {
		let { getByTestId, queryByTestId, rerender } = render(<Play />);
		let maxPayout = getByTestId('MoneyFormatToggle');

		expect(maxPayout).toBeInTheDocument();
		expect(maxPayout).toHaveAttribute('value', windowResponse().data.maxPayout);

		setWindowResponse({ isMobile: true });

		rerender(<Play />);

		expect(queryByTestId('MoneyFormatToggle')).not.toBeInTheDocument();
	});

	it('should display live account balance when device is desktop', () => {
		let { getByTestId, queryByTestId, rerender } = render(<Play />);
		let accountBalance = getByTestId('AccountBalance');

		expect(accountBalance).toBeInTheDocument();
		expect(accountBalance).toHaveAttribute('initialbalanceinfo', JSON.stringify(windowResponse().data.balanceInfo));
		expect(accountBalance).toHaveAttribute('isautoupdate', 'true');

		setWindowResponse({ isMobile: true });

		rerender(<Play />);

		expect(queryByTestId('AccountBalance')).not.toBeInTheDocument();
	});

	it('should display loading indicator when loading game', () => {
		let { getByTestId, queryByTestId, baseElement } = render(<Play />);

		expect(getByTestId('Spinner')).toBeInTheDocument();

		fireEvent.load(baseElement.querySelector('iframe'));

		expect(queryByTestId('Spinner')).not.toBeInTheDocument();
	});

	it('should load game', () => {
		let { baseElement } = render(<Play />);
		let gameIframe = baseElement.querySelector('iframe');

		expect(gameIframe).toBeInTheDocument();
		expect(gameIframe).toHaveAttribute('src', windowResponse().data.url);
	});

	it('should display error page when game data is incorrect', () => {
		setErrorResponse();
		let { getByTestId } = render(<Play />);

		expect(getByTestId('ErrorPage')).toBeInTheDocument();
	});
});
