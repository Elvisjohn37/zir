import React from 'react';
import { Route } from 'react-router-dom';
import { Wrapper } from './routewrap/Wrapper';

export default function RouteWrap({ component: Component, wrappers, ...otherProps }) {
	return (
		<Route
			{...otherProps}
			render={props => (
				<Wrapper wrappers={wrappers}>
					<Component {...props} />
				</Wrapper>
			)}
		/>
	);
}
