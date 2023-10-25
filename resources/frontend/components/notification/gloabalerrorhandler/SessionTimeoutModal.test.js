import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@mui/material';
import SessionTimeoutModal from './SessionTimeoutModal';

describe('<SessionTimeoutModal />', () => {
	let sessionWrapper;
	beforeEach(() => {
		sessionWrapper = shallow(<SessionTimeoutModal />);
	});
	it('should match snapshot', () => {
		expect(sessionWrapper).toMatchSnapshot();
	});

	it('should test window reload when modal close button is clicked', () => {
		Object.defineProperty(window.location, 'reload', { value: jest.fn(), configurable: true });

		let button = sessionWrapper.find(Button);
		button.props().onClick();
		expect(window.location.reload).toHaveBeenCalled();
	});
});
