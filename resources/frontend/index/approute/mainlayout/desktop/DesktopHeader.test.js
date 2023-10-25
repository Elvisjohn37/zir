import React from 'react';
import { shallow } from 'enzyme';
import DesktopHeader from './DesktopHeader';
import * as User from 'frontend/contexts/User';

jest.mock('frontend/contexts/User');

describe('<DesktopHeader />', () => {
	let desktopHeader;
	beforeEach(() => {
		desktopHeader = shallow(<DesktopHeader />);
		User.resetUserState();
	});
	test('should render components when user is login or not login', () => {
		expect(desktopHeader).toMatchSnapshot();
	});

	test('should render components correctly when user is not login', () => {
		let headerLoginForm = desktopHeader.find('.headerLoginForm').find('ErrorBoundary');
		let LoginForm = headerLoginForm
			.dive()
			.dive()
			.find('LoginForm');
		let Logout = headerLoginForm
			.dive()
			.dive()
			.find('Logout');

		expect(Logout).toHaveLength(0);
		expect(LoginForm).toHaveLength(1);
	});

	test('should render components correctly when user is login', () => {
		User.setUserState({ isLogin: true });
		let headerLoginForm = desktopHeader.find('.headerLoginForm').find('ErrorBoundary');
		let Logout = headerLoginForm
			.dive()
			.dive()
			.find('Logout');
		let LoginForm = headerLoginForm
			.dive()
			.dive()
			.find('LoginForm');

		expect(Logout).toHaveLength(1);
		expect(LoginForm).toHaveLength(0);
	});
});
