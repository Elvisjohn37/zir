import React from 'react';
import { injectIntl, IntlProvider } from 'react-intl';
import flatten from 'flat';

/**
 * Merges previous and current messages
 * See: https://github.com/yahoo/react-intl/issues/1109
 */
const NestedIntlProvider = injectIntl(({ intl, messages, children, ...props }) => {
	const nestedMessages = {
		...intl.messages,
		...flatten(messages)
	};

	return (
		<IntlProvider messages={nestedMessages} {...props}>
			{children}
		</IntlProvider>
	);
});

export default NestedIntlProvider;
