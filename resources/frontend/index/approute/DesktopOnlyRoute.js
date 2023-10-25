import React from 'react';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import Spinner from 'frontend/components/Spinner';
import { Redirect } from 'react-router-dom';

export default function DesktopOnlyRoute({ children }) {
	return (
		<LayoutConsumer>
			{({ layoutState }) =>
				layoutState.isLoading ? (
					<Spinner />
				) : layoutState.config.isMobileSite ? (
					<Redirect to="/error/notfound" />
				) : (
					children
				)
			}
		</LayoutConsumer>
	);
}
