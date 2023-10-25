import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	cookiePolicy:
		"We use cookies to collect and analyze information on site performance and usage and to enhance and customize content and advertisements. You can change your Cookie Settings at any time. Otherwise, we'll assume you're OK to continue.",
	acceptAndClose: 'Accept & Close',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
