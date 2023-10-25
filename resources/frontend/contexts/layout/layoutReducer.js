import immer from 'immer';

export default immer((draft, action) => {
	switch (action.type) {
		case 'SET_INIT':
			Object.assign(draft, action.data);
			draft.isLoading = false;
			draft.isError = false;
			break;
		case 'SET_CONFIG':
			Object.assign(draft.config, action.data);
			break;
		case 'SET_INIT_ERROR':
			draft.isLoading = false;
			draft.isError = true;
			break;
	}
});
