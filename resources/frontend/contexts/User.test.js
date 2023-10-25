import React from 'react';
import { createContext, useReducer, getUseReducer } from 'frontend/tests/__mocks__/reactSpyMock';
import { shallow } from 'enzyme';
import userReducer from './user/userReducer';
import * as backend from 'frontend/ajax/backend';

jest.spyOn(React, 'createContext').mockImplementation(createContext);
jest.spyOn(React, 'useReducer').mockImplementation(useReducer);

let { default: UserProvider, UserConsumer } = require('./User');

jest.mock('./user/userReducer');
jest.mock('frontend/ajax/backend');

function shallowUserProvider() {
	return shallow(<UserProvider>childComponent</UserProvider>);
}

describe('<UserProvider />', () => {
	beforeEach(() => {
		backend.resetGetSession();
		jest.clearAllMocks();
	});

	it('should match snapshot', () => {
		expect(shallowUserProvider()).toMatchSnapshot();
	});

	it('should set default user data', () => {
		shallowUserProvider();
		expect(React.useReducer).toHaveBeenCalledWith(
			userReducer,
			expect.objectContaining({ isLoading: true, isError: false })
		);
	});

	it('should initialize user data from backend on mount', () => {
		jest.spyOn(backend, 'getSession');

		shallowUserProvider();

		backend.setGetSession(true, { isLogin: false });
		shallowUserProvider();

		expect(backend.getSession).toHaveBeenCalledTimes(2);
		expect(userReducer).toHaveBeenCalledTimes(2);
		expect(userReducer).toHaveBeenNthCalledWith(1, {
			type: 'SET_INIT',
			data: {
				isLogin: true,
				userName: 'test'
			}
		});
		expect(userReducer).toHaveBeenNthCalledWith(2, {
			type: 'SET_INIT',
			data: { isLogin: false }
		});
	});

	it('should set user state to error when data initilization from backend failed', () => {
		jest.spyOn(backend, 'getSession');

		backend.setGetSession(false);
		shallowUserProvider();

		expect(backend.getSession).toHaveBeenCalledTimes(1);
		expect(userReducer).toHaveBeenCalledWith({
			type: 'SET_INIT_ERROR'
		});
	});

	it('should pass user context state and dispatchers to children', () => {
		let wrapper = shallowUserProvider();
		let valueProp = wrapper.props().value;
		let useReducerValue = getUseReducer();

		expect(
			wrapper
				.find('Provider')
				.shallow()
				.text()
		).toBe('childComponent');
		expect(valueProp.userState).toBe(useReducerValue.reducerState);
		expect(valueProp.userDispatch).toBe(userReducer);
	});
});

describe('<UserConsumer />', () => {
	it('should be equal to user context Consumer component', () => {
		expect(UserConsumer).toBe(createContext().Consumer);
	});
});
