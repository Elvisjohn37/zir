import immer from 'immer';

export default immer((draft, action) => {
	switch (action.type) {
		case 'SET_LIST':
			draft.gameRulesList = action.data.gameGuideList;
			draft.config = action.data.config;
			draft.isLoading = false;
			draft.isError = false;
			break;
		case 'SET_ISLOADING':
			draft.isLoading = action.isLoading;
			break;
		case 'SET_ISERROR':
			draft.isError = action.isError;
			draft.isLoading = false;
			break;
	}
});
