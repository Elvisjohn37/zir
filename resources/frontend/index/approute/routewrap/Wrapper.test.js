import React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from './Wrapper';

let ChildProps = () => <h1>this will return child props</h1>;

describe('<Wrapper />', () => {
	it('should match snapshot', () => {
		let wrapper = shallow(
			<Wrapper wrappers={[{ component: 'ComponentOne' }]}>
				<ChildProps />
			</Wrapper>
		);

		expect(wrapper).toMatchSnapshot();
	});
	it('should render children when wrapper prop is empty', () => {
		let wrapper = shallow(
			<Wrapper wrappers={[{ component: 'ComponentOne' }]}>
				<ChildProps />
			</Wrapper>
		);

		expect(wrapper.find(ChildProps)).toHaveLength(1);
	});

	it('should render wrapper when wrapper prop is not empty', () => {
		let wrapper = shallow(
			<Wrapper wrappers={[{ component: 'ComponentOne' }, { component: 'ComponentTwo' }]}>
				<ChildProps />
			</Wrapper>
		);

		expect(wrapper.find(Wrapper)).toHaveLength(1);
	});
});
