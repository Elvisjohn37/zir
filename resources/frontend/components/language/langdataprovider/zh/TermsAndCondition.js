import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	terms_condition: 'Terms and Conditions',
	description:
		'You may view the Terms & Conditions ' +
		'after signing in to your SBOBET account, ' +
		'by clicking the “Sports” button at the top left of the page.',
	content1: 'Asian interface: Click on Terms & Conditions at the betting page footer',
	content2: 'European Interface: Click on Terms & Conditions under the left Service Menu',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
