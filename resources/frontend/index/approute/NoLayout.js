import React from 'react';
import LayoutError from 'frontend/components/LayoutError';
import LayoutProvider, { LayoutConsumer } from 'frontend/contexts/Layout';
import { NotificationProvider } from 'frontend/components/Notification';
import Spinner from 'frontend/components/Spinner';
import { LangProvider } from 'frontend/components/Language';

export default function NoLayout({ children }) {
	return (
		<LayoutProvider type="noLayout">
			<LayoutConsumer>
				{({ layoutState }) =>
					layoutState.isLoading ? (
						<Spinner />
					) : layoutState.isError ? (
						<LayoutError />
					) : (
						<LangProvider config={layoutState.config.lang}>
							<NotificationProvider>{children}</NotificationProvider>
						</LangProvider>
					)
				}
			</LayoutConsumer>
		</LayoutProvider>
	);
}
