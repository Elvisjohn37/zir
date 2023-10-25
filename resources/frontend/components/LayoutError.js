import React from 'react';
import { ErrorPage } from 'frontend/components/OnPageError';
import { LangProvider } from 'frontend/components/Language';

export default function LayoutError() {
	return (
		<LangProvider config={{ default: 'en' }}>
			<ErrorPage
				response={{
					result: false,
					error: {
						code: 'ERR_00001',
					},
				}}
			/>
		</LangProvider>
	);
}
