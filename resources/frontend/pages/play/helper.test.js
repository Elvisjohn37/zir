import { postMessageHandler } from './helper';

jest.mock('frontend/utils/helper', () => ({
	__esModule: true,
	windowResponse: () => {
		return { data: { url: 'http://localhost' } };
	},
}));

describe('postMessageHandler()', () => {
	const realLocation = window.location;

	beforeEach(() => {
		delete window.location;
		window.location = {
			href: '',
			host: 'localhost',
		};
	});

	afterEach(() => {
		window.location = realLocation;
	});

	it('should redirect to "/" when closegame is called', () => {
		postMessageHandler({ data: 'closeGame', origin: 'http://localhost' });
		let rootUrl = window.location.href;
		window.location.href = 'test';

		postMessageHandler({ data: 'openGame', origin: 'http://localhost' });
		let defaultUrl1 = window.location.href;
		window.location.href = 'test';

		postMessageHandler({ data: 'closeGame', origin: 'http://338a.com/' });
		let defaultUrl2 = window.location.href;
		window.location.href = 'test';

		expect(rootUrl).toBe('/');
		expect(defaultUrl1).not.toBe('/');
		expect(defaultUrl2).not.toBe('/');
	});
});
