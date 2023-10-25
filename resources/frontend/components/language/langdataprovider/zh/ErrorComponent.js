import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	goToSite: 'GO TO SITE',
	finishGame: 'Play {runningGameName}',
	relogin: 'Re-login',
	refNo: 'Ref. ID',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
