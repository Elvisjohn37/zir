import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';
import { Link } from '@mui/material';

describe('<Footer />', () => {
	let footerWrapper;

	beforeEach(() => {
		footerWrapper = shallow(<Footer />);
	});
	it('should match snapshot', () => {
		expect(footerWrapper).toMatchSnapshot();
	});

	it('should render correct link', () => {
		let termsCondLink = footerWrapper
			.find(Link)
			.at(0)
			.prop('to');
		let policyLink = footerWrapper
			.find(Link)
			.at(1)
			.prop('to');
		let responsiblePolicyLink = footerWrapper
			.find(Link)
			.at(2)
			.prop('to');

		expect(termsCondLink).toEqual('/termsandcondition');
		expect(policyLink).toEqual('/privacypolicy');
		expect(responsiblePolicyLink).toEqual('/responsiblegamblingpolicy');
	});
});
