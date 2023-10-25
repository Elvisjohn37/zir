import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	en: 'English',
	zh: 'Chinese',
	ko: 'Korean',
	th: 'Thai',
	enshort: 'EN',
	zhshort: 'ZH',
	koshort: 'KO',
	thshort: 'TH',
	idshort: 'ID',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
