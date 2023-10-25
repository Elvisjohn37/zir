import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BetInfoIframe from './BetInfoIframe';
import { setWindowResponse } from 'frontend/utils/helper';

jest.mock('frontend/components/Spinner');
jest.mock('frontend/components/SeamlessIframe');
jest.mock('frontend/utils/helper');
jest.mock('classnames');

let windowResize = jest.fn();
window.resizeTo = windowResize;

describe('</BetInfoIframe>', () => {
	let sampleGameUrl = 'www.game.com';

	beforeEach(() => {
		setWindowResponse({
			result: true,
			data: {
				data: {
					url: sampleGameUrl,
				},
			},
		});
	});

	it('should match snapshot', () => {
		let { asFragment, getByTestId } = render(<BetInfoIframe type="eyecon" />);
		fireEvent.load(getByTestId('SeamlessIframe'));
		expect(asFragment()).toMatchSnapshot();
	});

	it('should display loading indicator when bet details iframe is not yet ready', () => {
		let { getByTestId } = render(<BetInfoIframe type="eyecon" />);
		expect(getByTestId('Spinner')).toBeInTheDocument(1);
	});

	it('should display eyecon bet details iframe', () => {
		let { getByTestId } = render(<BetInfoIframe type="eyecon" />);
		let iframe = getByTestId('SeamlessIframe');

		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('width', '400');
		expect(iframe).toHaveAttribute('height', '600');
		expect(iframe).toHaveAttribute('src', sampleGameUrl);
		expect(windowResize).toHaveBeenCalledWith(410, 605);
	});

	it('should display funky bet details iframe', () => {
		let { getByTestId } = render(<BetInfoIframe type="funky" />);
		let iframe = getByTestId('SeamlessIframe');

		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('width', '387');
		expect(iframe).toHaveAttribute('height', '635');
		expect(iframe).toHaveAttribute('src', sampleGameUrl);
		expect(windowResize).toHaveBeenCalledWith(400, 700);
	});
});
