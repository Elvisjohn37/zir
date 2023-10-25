import React from 'react';
import { createContext, useReducer, getUseReducer } from 'frontend/tests/__mocks__/reactSpyMock';
import * as helper from 'frontend/utils/helper';
import languageReducer from './language/languageReducer';
import { shallow } from 'enzyme';

jest.spyOn(React, 'createContext').mockImplementation(createContext);
jest.spyOn(React, 'useReducer').mockImplementation(useReducer);

let { default: LangProvider, LangConsumer } = require('./Language');

jest.mock('frontend/utils/helper');
jest.mock('./language/languageReducer');

describe('<LangProvider/>', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		helper.resetGetCookie();
	});

	it('should match snapshot', () => {
		let wrapper = shallow(<LangProvider>childComponent</LangProvider>);
		expect(wrapper).toMatchSnapshot();
	});

	it('should get default active language from cookie when available', () => {
		let cookie1 = 'th';
		helper.setGetCookie(cookie1);
		let wrapper1 = shallow(<LangProvider>childComponent</LangProvider>);

		let cookie2 = 'zh';
		helper.setGetCookie(cookie2);
		let wrapper2 = shallow(<LangProvider>childComponent</LangProvider>);

		helper.setGetCookie(undefined);
		let wrapper3 = shallow(<LangProvider>childComponent</LangProvider>);

		expect(wrapper1.props().value.langState.active).toBe(cookie1);
		expect(wrapper2.props().value.langState.active).toBe(cookie2);
		expect(wrapper3.props().value.langState.active).toBe(process.env.LANG_DEFAULT);
	});

	it('should pass language context state and dispatchers to children', () => {
		let wrapper = shallow(<LangProvider>childComponent</LangProvider>);
		let valueProp = wrapper.props().value;
		let useReducerValue = getUseReducer();
		expect(wrapper.find('Provider').shallow().text()).toBe('childComponent');
		expect(valueProp.langState).toBe(useReducerValue.reducerState);
		expect(valueProp.langDispatch).toBe(languageReducer);
	});
});

describe('<LangConsumer/>', () => {
	it('should be equal to language context Consumer component', () => {
		expect(LangConsumer).toBe(createContext().Consumer);
	});
});
