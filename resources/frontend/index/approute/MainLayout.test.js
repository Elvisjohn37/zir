import React from 'react';
import { shallow } from 'enzyme';
import MainLayout from './MainLayout';
import * as User from 'frontend/contexts/User';
import * as MediaQuery from 'react-responsive';

jest.mock('frontend/contexts/User');

jest.mock('classnames', () => {
	return classnames => classnames;
});

let ChildProps = () => '';

describe('<MainLayout />', () => {
	let mainLayoutWrapper;
	let loginClasss = {
		header: ['headerLogin'],
		body: ['bodyLogin']
	};
	beforeEach(() => {
		mainLayoutWrapper = shallow(<MainLayout {...ChildProps} />);
		jest.spyOn(MediaQuery, 'setMediaQuery');
	});

	it('should render necessary components when user is not login', () => {
		let header = mainLayoutWrapper
			.dive()
			.find('header')
			.prop('className');
		let body = mainLayoutWrapper
			.dive()
			.find('section')
			.at(1)
			.prop('className');
		let orglinks = mainLayoutWrapper.dive().find('OrgLinks');

		expect(header).toEqual(expect.not.arrayContaining(loginClasss.header));
		expect(body).toEqual(expect.not.arrayContaining(loginClasss.body));
		expect(orglinks).toHaveLength(0);
	});

	it('should render necessary components when user is login', () => {
		User.setUserState({ isLogin: true });

		let header = mainLayoutWrapper
			.dive()
			.find('header')
			.prop('className');
		let body = mainLayoutWrapper
			.dive()
			.find('section')
			.at(1)
			.prop('className');
		let orglinks = mainLayoutWrapper.dive().find('OrgLinks');

		expect(header).toEqual(expect.arrayContaining(loginClasss.header));
		expect(body).toEqual(expect.arrayContaining(loginClasss.body));
		expect(orglinks).toHaveLength(1);
	});

	it('should render desktop when device is desktop view', () => {
		MediaQuery.setMediaQuery(true);
		mainLayoutWrapper.update();

		let mobileHeader = mainLayoutWrapper
			.dive()
			.find('MediaQuery')
			.shallow()
			.find('MobileHeader');
		let desktopHeader = mainLayoutWrapper
			.dive()
			.find('MediaQuery')
			.shallow()
			.find('DesktopHeader');

		expect(mobileHeader).toHaveLength(0);
		expect(desktopHeader).toHaveLength(1);
	});

	it('should render mobile when device is mobile view', () => {
		MediaQuery.setMediaQuery(false);
		mainLayoutWrapper.update();

		let mobileHeader = mainLayoutWrapper
			.dive()
			.find('MediaQuery')
			.shallow()
			.find('MobileHeader');
		let desktopHeader = mainLayoutWrapper
			.dive()
			.find('MediaQuery')
			.shallow()
			.find('DesktopHeader');

		expect(mobileHeader).toHaveLength(1);
		expect(desktopHeader).toHaveLength(0);
	});
});
