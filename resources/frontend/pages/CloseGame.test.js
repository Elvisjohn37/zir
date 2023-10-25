import React from 'react';
import { render } from '@testing-library/react';
import CloseGame from './CloseGame';

jest.mock('frontend/components/Spinner');
jest.mock('react-intl');
jest.mock('frontend/components/Language');

let postMessageFn = jest.fn();
window.parent.postMessage = postMessageFn;

describe('</CloseGame>', () => {
	it('should match snapshot', () => {
		let { asFragment } = render(<CloseGame />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should have called postMessage with closeGame param on mount', () => {
		render(<CloseGame />);
		expect(postMessageFn).toHaveBeenCalledWith('closeGame', '*');
	});
});
