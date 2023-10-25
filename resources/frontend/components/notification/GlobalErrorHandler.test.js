import React from 'react';
import { shallow } from 'enzyme';
import GlobalErrorHandler from './GlobalErrorHandler';
import * as backend from 'frontend/ajax/backend';
import { setSnackbar } from 'notistack';

jest.mock('frontend/ajax/backend');
jest.mock('react-intl');
jest.mock('notistack');

describe('<GlobalErrorHandler />', () => {
	it('should call subscribe', () => {
		jest.spyOn(backend, 'subscribe');
		shallow(<GlobalErrorHandler />).dive();

		expect(backend.subscribe).toHaveBeenCalled();
	});

	it('should call notistack on  subscribe error -1', () => {
		let enqueueSnackbar = jest.fn();
		setSnackbar({ enqueueSnackbar: enqueueSnackbar });
		shallow(<GlobalErrorHandler />).dive();

		expect(enqueueSnackbar).toHaveBeenCalled();
	});

	it('should return session timeout on  subscribe error -2', () => {
		backend.setError({
			error: { code: '-2', message: 'Your session has been expired. Please re-login to continue.' }
		});

		jest.spyOn(backend, 'subscribe');
		let wrapper = shallow(<GlobalErrorHandler />).dive();

		expect(wrapper.find('SessionTimeoutModal')).toHaveLength(1);
	});
});
