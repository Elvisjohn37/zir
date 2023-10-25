import React from 'react';
import SessionBasedRoute from './SessionBasedRoute';
import { shallow } from 'enzyme';
import Spinner from 'frontend/components/Spinner';
import * as User from 'frontend/contexts/User';
import { Redirect } from 'react-router-dom';

jest.mock('react-router-dom');

jest.mock('frontend/contexts/User');
let FallBack = () => '';

describe('<SessionBasedRoute />', () => {
	beforeEach(() => {
		User.resetUserState();
	});

	it('should render spinner only when loading', () => {
		User.setUserState({ isLoading: true });
		let sessionWrapper = shallow(<SessionBasedRoute />);
		let spinner = sessionWrapper.dive().find(Spinner);
		let redirect = sessionWrapper.dive().find('Redirect');
		let fallback = sessionWrapper.dive().find(FallBack);

		expect(spinner).toHaveLength(1);
		expect(redirect).toHaveLength(0);
		expect(fallback).toHaveLength(0);
	});

	it('should render redirect when user is not login and fallback is undefined', () => {
		User.setUserState({ isLoading: false });

		let sessionWrapper = shallow(<SessionBasedRoute />);
		let spinner = sessionWrapper.dive().find(Spinner);
		let redirect = sessionWrapper.dive().find(Redirect);
		let fallback = sessionWrapper.dive().find(FallBack);

		expect(sessionWrapper.dive()).toMatchSnapshot();

		expect(spinner).toHaveLength(0);
		expect(redirect).toHaveLength(1);
		expect(fallback).toHaveLength(0);
	});

	it('should render fallback when user is not login and fallback is defined', () => {
		User.setUserState({ isLoading: false });
		let props = {
			fallback: FallBack,
			isLogin: true
		};
		let sessionWrapper = shallow(<SessionBasedRoute {...props} />);
		let spinner = sessionWrapper.dive().find(Spinner);
		let redirect = sessionWrapper.dive().find(Redirect);
		let fallback = sessionWrapper.dive().find(FallBack);

		expect(spinner).toHaveLength(0);
		expect(redirect).toHaveLength(0);
		expect(fallback).toHaveLength(1);
	});

	it('should render children when user is already login', () => {
		User.setUserState({ isLoading: false, isLogin: true });
		let props = {
			isLogin: true,
			children: <h1>return child component</h1>
		};
		let sessionWrapper = shallow(<SessionBasedRoute {...props} />);
		let childcomponent = sessionWrapper
			.dive()
			.find('h1')
			.text();

		expect(childcomponent).toEqual('return child component');
	});
});
