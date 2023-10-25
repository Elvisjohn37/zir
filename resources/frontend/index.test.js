import React from 'react';
import { shallow } from 'enzyme';
import { Index } from './index';

// jest.mock('typeface-roboto');
jest.mock('react-intl');

describe('<Index />', () => {
	it('should match snapshot',() => {
	expect(shallow(<Index />)).toMatchSnapshot();

	});

	it('should Approute under Notification Provider', () => {
		
	let NotificationProvider = shallow(<Index />).find('NotificationProvider');

	expect(NotificationProvider.find('AppRoute')).toHaveLength(1);
	});
});