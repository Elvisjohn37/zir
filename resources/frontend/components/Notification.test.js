import React from 'react';
import { shallow } from 'enzyme';
import { NotificationProvider } from './Notification';

describe('<Notification />', () => {
	it('Snapshot NotificationProvider', () => {
		let wrapper = shallow(<NotificationProvider />);
		expect(wrapper).toMatchSnapshot();
	});
});
