import ErrorPage from './ErrorPage';
import { ErrorPage as OnPageError } from 'frontend/components/OnPageError';

jest.mock('frontend/components/OnPageError');

describe('</ErrorPage>', () => {
	it('should use ErrorPage component', () => {
		expect(ErrorPage).toEqual(OnPageError);
	});
});
