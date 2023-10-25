import React from 'react';
import { shallow } from 'enzyme';
import Orglinks from './OrgLinks';
import Button from '@mui/material/Button';

jest.mock('./orglinks/orgDataHandlers', () => ({
	getOrganizations: () => [
		{
			name: 'pagcor',
			img: 'pagcor_image',
			url: '//pagcor.ph',
			scaleWidth: 1,
			scaleHeight: 1
		},
		{
			name: 'gamcare',
			img: 'gamcare_image',
			url: '//www.gamcare.org.uk',
			scaleWidth: 95,
			scaleHeight: 102
		}
	]
}));

describe('<OrgLinks />', () => {
	let OrglinkWrapper = shallow(<Orglinks />);

	it('should render correct', () => {
		expect(OrglinkWrapper).toMatchSnapshot();
	});

	it('should render Organization link', () => {
		let pagcorLink = OrglinkWrapper.find(Button)
			.at(0)
			.prop('href');
		let gamcareLink = OrglinkWrapper.find(Button)
			.at(1)
			.prop('href');

		expect(pagcorLink).toEqual('//pagcor.ph');
		expect(gamcareLink).toEqual('//www.gamcare.org.uk');
	});

	it('should render image source', () => {
		let pagcorImage = OrglinkWrapper.find('Image')
			.at(0)
			.prop('src');
		let gamcareImage = OrglinkWrapper.find('Image')
			.at(1)
			.prop('src');

		expect(pagcorImage).toEqual('pagcor_image');
		expect(gamcareImage).toEqual('gamcare_image');
	});
});
