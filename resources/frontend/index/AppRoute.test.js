import React from 'react';
import AppRoute from './AppRoute';
import { shallow } from 'enzyme';

jest.mock('react-router-dom');

describe('<AppRoute />', () => {
	let approuteWrapper;
	beforeEach(() => {
		approuteWrapper = shallow(<AppRoute />);
	});
	it('should match snapshot', () => {
		expect(approuteWrapper).toMatchSnapshot();
	});

	it('should redirect root route to Home when not login', () => {
		let homeRoute = approuteWrapper.find({ path: '/' });
		let Fallback;

		homeRoute.props().wrappers.forEach(item => {
			if ('fallback' in item) {
				Fallback = item.fallback;
				Fallback = shallow(<Fallback />);
			}
		});

		expect(Fallback.find('Home')).toHaveLength(1);
	});

	it('should redirect root route to Games when login', () => {
		let homeRoute = approuteWrapper.find({ path: '/' });
		let GameRoute = homeRoute.props().component;

		expect(shallow(<GameRoute />).find('Games')).toHaveLength(1);
	});

	it('should create route for before login', () => {
		let routeWrap = approuteWrapper.find('RouteWrap');
		let routeBeforeLogin = new Array();

		routeWrap.forEach(element => {
			let noSession = new Array();
			element.props().wrappers.forEach(item => {
				let Component = item.component;
				Component = shallow(<Component />);
				noSession.push(Component.find('SessionBasedRoute').isEmptyRender());
			});
			if (!noSession.includes(false)) routeBeforeLogin.push(element);
		});
		expect(routeBeforeLogin).toMatchSnapshot();
	});

	it('should create route for after login only', () => {
		let routeWrap = approuteWrapper.find('RouteWrap');
		let routeAfterLogin = new Array();

		routeWrap.forEach(element => {
			element.props().wrappers.forEach(item => {
				let Component = item.component;
				Component = shallow(<Component />);
				if (!Component.find('SessionBasedRoute').isEmptyRender()) routeAfterLogin.push(element);
			});
		});
		expect(routeAfterLogin).toMatchSnapshot();
	});

	it('should display 404 if route is not found', () => {
		let NotFound = approuteWrapper.find({ path: '*' }).props().component;
		expect(shallow(<NotFound />).find('NotFound')).toHaveLength(1);
	});
});
