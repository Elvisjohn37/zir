import React from 'react';
import { LangSelector, LangDataProvider as LangDataProviderRef } from './Language';
import LangDataProviderReal from './language/LangDataProvider';
import * as LangContext from 'frontend/contexts/Language';
import * as helper from 'frontend/utils/helper';
import { shallow } from 'enzyme';

jest.mock('./language/LangDataProvider');
jest.mock('frontend/contexts/Language');
jest.mock('frontend/utils/helper');
jest.mock('classnames');

describe('<LangSelector/>', () => {
	let wrapper;
	let wrapperDive;

	beforeEach(() => {
		wrapper = shallow(<LangSelector />);
		wrapperDive = wrapper.dive().dive();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		LangContext.resetLangState();
	});

	it('should match snapshot', () => {
		expect(wrapperDive).toMatchSnapshot();
	});

	it('should display language icons', () => {
		let availableLanguages1 = [...LangContext.getLangState().available];
		let languageIcons1 = wrapperDive.find('.imageWrapper');

		LangContext.setLangState({
			available: ['en', 'th'],
		});
		wrapper.update();
		let availableLanguages2 = [...LangContext.getLangState().available];
		let languageIcons2 = wrapper.dive().dive().find('.imageWrapper');

		expect(wrapper.find('LangDataProvider').props().category).toBe('langselector');

		expect(languageIcons1.length).toBe(4);
		languageIcons1.forEach((icon, index) => {
			let image = icon.find('Image').props().src;
			let text = icon.find('FormattedMessage').props().id;

			expect(image).toBe(`langselector/${availableLanguages1[index]}.png`);
			expect(text).toBe(availableLanguages1[index]);
		});

		expect(languageIcons2.length).toBe(2);
		languageIcons2.forEach((icon, index) => {
			let image = icon.find('Image').props().src;
			let text = icon.find('FormattedMessage').props().id;

			expect(image).toBe(`langselector/${availableLanguages2[index]}.png`);
			expect(text).toBe(availableLanguages2[index]);
		});
	});

	it('should update active language when non disabled language icon is clicked', () => {
		jest.spyOn(LangContext, 'langDispatch');
		jest.spyOn(helper, 'putCookie');

		let availableLanguages = [...LangContext.getLangState().available];
		let languageIcons = wrapperDive.find('.imageWrapper');

		languageIcons.at(1).props().onClick();
		languageIcons.at(3).props().onClick();

		expect(LangContext.langDispatch).toHaveBeenCalledTimes(1);
		expect(LangContext.langDispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'SET_LANGUAGE',
				lang: availableLanguages[1],
			})
		);
		expect(helper.putCookie).toHaveBeenCalledTimes(1);
		expect(helper.putCookie).toHaveBeenNthCalledWith(1, process.env.LANG_KEY, availableLanguages[1]);
	});
});

describe('<LangDataProvider/>', () => {
	it('should reference ./language/LangDataProvider module', () => {
		jest.restoreAllMocks();

		expect(LangDataProviderRef).toBe(LangDataProviderReal);
	});
});
