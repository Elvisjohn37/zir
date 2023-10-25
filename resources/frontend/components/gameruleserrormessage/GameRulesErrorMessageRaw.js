import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import Container from '@mui/material/Container';
import { LangDataProvider } from 'frontend/components/Language';

export default function GameRulesErrorMessageRaw({ className }) {
	return (
		<LangDataProvider category="errormessage">
			<Container maxWidth="lg" className={className}>
				<Alert severity="error" variant="filled">
					<AlertTitle>
						<FormattedMessage id="ERR_00032.title" />
					</AlertTitle>
					<FormattedMessage id="ERR_00032.message" />
				</Alert>
			</Container>
		</LangDataProvider>
	);
}
