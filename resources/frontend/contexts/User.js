import React, { useState, useEffect } from 'react';
import userReducer from './user/userReducer';
import { getSession } from 'frontend/ajax/backend';

let UserContext = React.createContext();
const USER_DEFAULT = {
	isLoading: true,
	isLogin: false,
	isError: false,
	user: {},
};

export default function UserProvider({ children }) {
	let [userState, userDispatch] = React.useReducer(userReducer, USER_DEFAULT);

	let [isMounted, set_isMounted] = useState(false);

	useEffect(() => {
		if (isMounted === false) {
			set_isMounted(true);
			getSession(
				(response) => {
					userDispatch({
						type: 'LOGIN',
						data: response.data.data,
					});
					userDispatch({ type: 'SET_INIT' });
				},
				() => {
					userDispatch({ type: 'SET_INIT_ERROR' });
				}
			);
		}
	});

	return <UserContext.Provider value={{ userState, userDispatch }}>{children}</UserContext.Provider>;
}

export let UserConsumer = UserContext.Consumer;
