import immer from 'immer';

export default immer((draft, action) => {
	switch (action.type) {
		case 'SET_LANGUAGE':
			draft.active = action.lang;
			break;
	}
});
