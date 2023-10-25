import React from 'react';
import { shallow } from 'enzyme';
import RouteWrap from './RouteWrap';

let routeProps = {
	exact: true,
	path: '/test',
	wrappers: [{ component: 'component one' }],
	component: 'ChildProps'
};
describe('<RouteWrap />', () => {
	let wrapperRoute;
	beforeEach(() => {
		wrapperRoute = shallow(<RouteWrap {...routeProps} />);
	});
	it('should match snapshot', () => {
		expect(wrapperRoute).toMatchSnapshot();
	});

	it('should render route path', () => {
		expect(wrapperRoute.prop('path')).toEqual('/test');
	});

	it('should defined wrappers props and child component', () => {
		let Render = wrapperRoute.props().render;
		Render = shallow(<Render />);

		expect(Render.props().wrappers).toBeDefined();
		expect(Render.find('ChildProps')).toBeDefined();
	});
});
