import languageReducer from './languageReducer';

jest.mock('immer');

describe('languageReducer()', () => {
	it('should set current active language when action.type is SET_LANGUAGE', () => {
		let draft = {};
		let action = {
			type: 'SET_LANGUAGE',
			lang: 'en'
		};
		languageReducer(draft, action);
		let enLang = draft.active;

		action.lang = 'zh';
		languageReducer(draft, action);
		let zhLang = draft.active;

		action.type = 'OTHER_TYPE';
		languageReducer(draft, action);
		let otherTypeLang = draft.active;

		expect(enLang).toBe('en');
		expect(zhLang).toBe('zh');
		expect(otherTypeLang).toBe('zh');
	});
});
