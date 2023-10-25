import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../gamerules/Loader';

jest.mock('@mui/material/Grid');
jest.mock('frontend/components/Skeleton');
jest.mock('lodash');

describe('<Loader />', () => {
	it('should match snapshot', () => {
		let { asFragment } = render(<Loader />);

		expect(asFragment()).toMatchSnapshot();
	});
});
