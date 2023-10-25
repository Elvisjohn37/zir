import userReducer from './userReducer';

jest.mock('immer');

describe('userReducer()', () => {
	it('should set initial state when action.type is SET_INIT', () => {
		let draft = {
			isLoading: true,
			isError: true
		};

		userReducer(draft, {
			type: 'SET_INIT',
			data: {
				isLogin: true,
				testData: 'test'
			}
		});

		expect(draft).toEqual({
			isLoading: false,
			isError: false,
			isLogin: true,
			testData: 'test'
		});
	});
	it('should update user state to any data passed in action.data when action.type is SET_USER_DATA', () => {
		let draft = {
			isLoading: true,
			isError: true
		};

		userReducer(draft, {
			type: 'SET_USER_DATA',
			data: {
				isError: false,
				testData: 'test'
			}
		});

		expect(draft).toEqual({
			isLoading: true,
			isError: false,
			testData: 'test'
		});
	});

	it('should set state to error when action.type is SET_INIT_ERROR', () => {
		let draft = {
			isLoading: true,
			isError: false
		};

		userReducer(draft, {
			type: 'SET_INIT_ERROR'
		});

		expect(draft).toEqual({
			isLoading: false,
			isError: true
		});
	});

	it('should set state for login user when action.type is LOGIN', () => {
		let draft = {
			isLogin: false
		};

		userReducer(draft, {
			type: 'LOGIN'
		});

		expect(draft).toEqual({
			isLogin: true
		});
	});

	it('should set state for non login when action.type is LOGOUT', () => {
		let draft = {
			isLogin: true
		};

		userReducer(draft, {
			type: 'LOGOUT'
		});

		expect(draft).toEqual({
			isLogin: false
		});
	});
});
