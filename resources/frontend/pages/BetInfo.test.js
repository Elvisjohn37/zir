import React from 'react';
import BetInfo from './BetInfo';
import { render } from '@testing-library/react';
import { setWindowResponse, resetWindowResponse } from 'frontend/utils/helper';
import { setUseParams, resetUseParams } from 'react-router-dom';

jest.mock('frontend/utils/helper');
jest.mock('frontend/components/OnPageError');
jest.mock('react-router-dom');
jest.mock('./betinfo/BetInfoIframe');
jest.mock('lodash');

describe('</BetInfo>', () => {
	beforeEach(() => {
		resetWindowResponse();
		resetUseParams();
	});

	it('should match snapshot', () => {
		setWindowResponse({ result: true });
		setUseParams({ type: 'eyecon' });
		let { asFragment } = render(<BetInfo />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should load eyecon bet details', () => {
		setWindowResponse({ result: true });
		setUseParams({ type: 'eyecon' });
		let { getByTestId, queryByTestId } = render(<BetInfo />);
		let betInfoIframe = getByTestId('BetInfoIframe');
		let errorPage = queryByTestId('ErrorPage');

		expect(betInfoIframe).toBeInTheDocument();
		expect(betInfoIframe).toHaveAttribute('type', 'eyecon');
		expect(errorPage).not.toBeInTheDocument(0);
	});

	it('should load funky bet details', () => {
		setWindowResponse({ result: true });
		setUseParams({ type: 'funky' });
		let { getByTestId, queryByTestId } = render(<BetInfo />);
		let betInfoIframe = getByTestId('BetInfoIframe');
		let errorPage = queryByTestId('ErrorPage');

		expect(betInfoIframe).toBeInTheDocument();
		expect(betInfoIframe).toHaveAttribute('type', 'funky');
		expect(errorPage).not.toBeInTheDocument(0);
	});

	it('should display error page when the bet details type is unknown', () => {
		setWindowResponse({ result: true });
		setUseParams({ type: 'unknownType' });
		let { getByTestId } = render(<BetInfo />);

		expect(getByTestId('ErrorPage')).toBeInTheDocument();
	});

	it('should display error page when fetching of bet details in backend fails', () => {
		setWindowResponse({ result: false });
		setUseParams({ type: 'eyecon' });
		let { getByTestId } = render(<BetInfo />);

		expect(getByTestId('ErrorPage')).toBeInTheDocument();
	});
});
