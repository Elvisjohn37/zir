import React from 'react';
import ThemeProvider from './ThemeProvider';
import { shallow } from 'enzyme';

jest.mock('@material-ui/core/styles/createMuiTheme');
jest.mock('@material-ui/core/styles');

describe('AppRoute', () => {
	it('should match snapshot', () => {
		let themeWrapper = shallow(<ThemeProvider />);
		expect(themeWrapper).toMatchSnapshot();
	});

	it('should create custom theme', () => {
		let themeWrapper = shallow(<ThemeProvider />);
		expect(themeWrapper.prop('theme')).toBe('THEME');
	});
});
