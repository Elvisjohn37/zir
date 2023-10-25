import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

jest.mock('frontend/components/GameRulesLoader');
jest.mock('frontend/utils/withSuspense');

describe('<ErrorMessage />', () => {
	it('should match snapshot', () => {
		let { asFragment } = render(<ErrorMessage />);
		expect(asFragment()).toMatchSnapshot();
	});
});
