import React from 'react';
import { Redirect } from 'react-router-dom';
import { UserConsumer } from 'frontend/contexts/User';
import Spinner from 'frontend/components/Spinner';

export default function SessionBasedRoute({ fallback: Fallback, isLogin, children }) {
	let finalIsLogin = isLogin === undefined ? true : isLogin;

	return (
		<UserConsumer>
			{({ userState }) => (
				<>
					{userState.isLoading ? (
						<Spinner />
					) : finalIsLogin === userState.isLogin ? (
						children
					) : Fallback === undefined ? (
						<Redirect to="/" />
					) : (
						<Fallback />
					)}
				</>
			)}
		</UserConsumer>
	);
}
