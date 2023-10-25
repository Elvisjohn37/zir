import immer from 'immer';

export default immer((draft, action) => {
	switch (action.type) {
		case 'SET_INIT':
			Object.assign(draft, action.data);
			draft.isLoading = false;
			draft.isError = false;
			break;
		case 'SET_USER_DATA':
			Object.assign(draft, action.data);
			break;
		case 'SET_INIT_ERROR':
			draft.isLoading = false;
			draft.isError = true;
			break;
		case 'LOGIN':
			Object.assign(draft, action.data);
			break;
		case 'LOGOUT':
			draft.isLogin = false;
			break;
	}
});
