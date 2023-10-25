import React from 'react';
import Container from '@mui/material/Container';
import OnPageError from 'frontend/components/OnPageError';

export function ErrorMessageDisplay({ className, response }) {
	return (
		<Container maxWidth="lg" className={className}>
			<OnPageError response={response} />
		</Container>
	);
}
