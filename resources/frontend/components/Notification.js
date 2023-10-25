import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import { SnackbarProvider } from 'notistack';
import GlobalErrorHandler from './notification/GlobalErrorHandler';

function NotificationProvider({ children }) {
	return (
		<SnackbarProvider
			maxSnack={3}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
		>
			<LangDataProvider category="errormessage">
				<GlobalErrorHandler />
			</LangDataProvider>
			{children}
		</SnackbarProvider>
	);
}

export { NotificationProvider };
