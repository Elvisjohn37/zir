import React from 'react';
import { shallow } from 'enzyme';
import AfterLogin from './AfterLogin';
import { Tabs, Tab } from '@mui/material';
import * as Language from 'frontend/contexts/Language';
import { setUseRef, useRef } from 'frontend/tests/__mocks__/reactSpyMock';
import { useLocation, setUseLocation } from 'react-router-dom';

jest.mock('frontend/contexts/Language');
jest.mock('react-router-dom');

jest.useFakeTimers();

jest.mock('frontend/components/MenuDataHandlers', () => ({
	getAfterLoginMenu: () => ({
		en: {
			about_us: `/about_us`,
			contact_us: `/contact_us`
		},
		zh: {
			about_us: `/zh-cn/about_us`,
			contact_us: `/zh-cn/contact_us`
		},
		ko: {
			about_us: `/ko-kr/about_us`,
			contact_us: `/ko-kr/contact_us`
		},
		th: {
			about_us: `/th-th/about_us`,
			contact_us: `/th-th/contact_us`
		}
	})
}));

describe('<AfterLogin />', () => {
	let toggleDrawer = jest.fn();
	let AfterLoginWrapper = shallow(<AfterLogin toggleDrawer={toggleDrawer} />);

	it('should render correctly', () => {
		expect(AfterLoginWrapper.dive()).toMatchSnapshot();
	});
	it('should set active tab', () => {
		let updateIndicator = jest.fn();
		setUseRef({ current: { updateIndicator: updateIndicator } });

		jest.spyOn(React, 'useRef').mockImplementation(useRef);
		let Wrapper = shallow(<AfterLogin toggleDrawer={toggleDrawer} />);

		setUseLocation({ pathname: 'www.zirconloc.com/games' });
		jest.advanceTimersByTime(100);
		Wrapper.update();

		expect(
			Wrapper.dive()
				.find(Tabs)
				.props().value
		).toBe(`/${useLocation().pathname.split('/')[1]}`);
		expect(updateIndicator).toHaveBeenCalled();
	});

	it('should render menu url', () => {
		let aboutUsEn = AfterLoginWrapper.dive()
			.find(Tab)
			.at(3)
			.prop('href');
		let contactUsEn = AfterLoginWrapper.dive()
			.find(Tab)
			.at(4)
			.prop('href');

		Language.setLangState({ active: 'zh' });
		AfterLoginWrapper.update();

		let aboutUsZh = AfterLoginWrapper.dive()
			.find(Tab)
			.at(3)
			.prop('href');
		let contactUsZn = AfterLoginWrapper.dive()
			.find(Tab)
			.at(4)
			.prop('href');

		expect(aboutUsEn).toEqual(`https://info.sbobet.com//about_us`);
		expect(contactUsEn).toEqual(`https://info.sbobet.com//contact_us`);

		expect(aboutUsZh).toEqual(`https://info.sbobet.com//zh-cn/about_us`);
		expect(contactUsZn).toEqual(`https://info.sbobet.com//zh-cn/contact_us`);
	});
});
