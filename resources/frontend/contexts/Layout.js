import React, { useState, useEffect } from 'react';
import layoutReducer from './layout/layoutReducer';
import { getLayoutConfig } from 'frontend/ajax/backend';

let LayoutContext = React.createContext();
const LAYOUT_DEFAULT = {
	isLoading: true,
	isError: false,
	config: {},
};

export default function LayoutProvider({ children, type }) {
	let [layoutState, layoutDispatch] = React.useReducer(layoutReducer, LAYOUT_DEFAULT);
	let [isMounted, set_isMounted] = useState(false);

	useEffect(() => {
		if (isMounted === false) {
			set_isMounted(true);
			getLayoutConfig(
				type,
				(response) => {
					layoutDispatch({
						type: 'SET_CONFIG',
						data: response.data.data,
					});
					layoutDispatch({ type: 'SET_INIT' });
				},
				() => {
					layoutDispatch({ type: 'SET_INIT_ERROR' });
				}
			);
		}
	});

	return <LayoutContext.Provider value={{ layoutState, layoutDispatch }}>{children}</LayoutContext.Provider>;
}

export let LayoutConsumer = LayoutContext.Consumer;
