import React from 'react';
import { ErrorMessageDisplay } from './Notifications';
import { render } from '@testing-library/react';

jest.mock('@mui/material/Container');
jest.mock('frontend/components/OnPageError');

describe('<ErrorMessageDisplay />', () => {
	const SAMPLE_RESPONSE = { data: 'test data' };

	it('should match snapshot', () => {
		let { asFragment } = render(<ErrorMessageDisplay response={SAMPLE_RESPONSE} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
