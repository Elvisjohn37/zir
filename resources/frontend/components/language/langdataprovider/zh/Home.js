import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	newGames: 'New Games',
	content1: 'Try out new and exciting games.',
	content2: 'Spend time for fun!',
	letsPlay: "Let's play",
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
