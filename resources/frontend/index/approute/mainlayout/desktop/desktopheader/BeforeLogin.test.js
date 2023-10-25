import React from 'react';
import { shallow } from 'enzyme';
import Beforelogin from './BeforeLogin';
import { Tabs, Tab } from '@mui/material';
import * as Language from 'frontend/contexts/Language';
import { setUseRef, useRef } from 'frontend/tests/__mocks__/reactSpyMock';
import { useLocation, setUseLocation } from 'react-router-dom';

jest.mock('frontend/contexts/Language');
jest.mock('react-router-dom');
jest.useFakeTimers();

jest.mock('frontend/components/MenuDataHandlers', () => ({
	getBeforeLoginMenu: () => ({
		en: {
			open_account: `en`,
			about_us: `/about_us`,
			contact_us: `/contact_us`
		},
		zh: {
			open_account: `zh-tw`,
			about_us: `/zh-cn/about_us`,
			contact_us: `/zh-cn/contact_us`
		},
		ko: {
			open_account: `ko-kr`,
			about_us: `/ko-kr/about_us`,
			contact_us: `/ko-kr/contact_us`
		},
		th: {
			open_account: `th-th`,
			about_us: `/th-th/about_us`,
			contact_us: `/th-th/contact_us`
		}
	})
}));

describe('<Beforelogin />', () => {
	let toggleDrawer = jest.fn();
	let BeforeLoginWrapper = shallow(<Beforelogin toggleDrawer={toggleDrawer} />);
	it('should render correctly', () => {
		expect(BeforeLoginWrapper.dive()).toMatchSnapshot();
	});
	it('should set active tab', () => {
		let updateIndicator = jest.fn();
		setUseRef({ current: { updateIndicator: updateIndicator } });

		jest.spyOn(React, 'useRef').mockImplementation(useRef);
		let Wrapper = shallow(<Beforelogin toggleDrawer={toggleDrawer} />);

		setUseLocation({ pathname: 'www.zirconloc.com/games' });
		jest.advanceTimersByTime(100);
		Wrapper.update();

		expect(
			Wrapper.dive()
				.find(Tabs)
				.props().value
		).toBe(`/${useLocation().pathname.split('/')[1]}`);
		expect(updateIndicator).toHaveBeenCalled();
		expect(1).toBe(1);
	});

	it('should render menu url', () => {
		let openAccountEn = BeforeLoginWrapper.dive()
			.find(Tab)
			.at(1)
			.prop('href');
		let aboutUsEn = BeforeLoginWrapper.dive()
			.find(Tab)
			.at(3)
			.prop('href');
		let contactUsEn = BeforeLoginWrapper.dive()
			.find(Tab)
			.at(4)
			.prop('href');

		Language.setLangState({ active: 'zh' });
		BeforeLoginWrapper.update();

		let openAccountZh = BeforeLoginWrapper.dive()
			.find(Tab)
			.at(1)
			.prop('href');
		let aboutUsZh = BeforeLoginWrapper.dive()
			.find(Tab)
			.at(3)
			.prop('href');
		let contactUsZn = BeforeLoginWrapper.dive()
			.find(Tab)
			.at(4)
			.prop('href');

		expect(openAccountEn).toEqual(`${process.env.MENU_OPEN_ACCOUNT}=en`);
		expect(aboutUsEn).toEqual(`https://info.sbobet.com//about_us`);
		expect(contactUsEn).toEqual(`https://info.sbobet.com//contact_us`);

		expect(openAccountZh).toEqual(`${process.env.MENU_OPEN_ACCOUNT}=zh-tw`);
		expect(aboutUsZh).toEqual(`https://info.sbobet.com//zh-cn/about_us`);
		expect(contactUsZn).toEqual(`https://info.sbobet.com//zh-cn/contact_us`);
	});
});
