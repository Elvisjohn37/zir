import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	new: 'NEW',
	notAvailable: 'Not available',
	cardGames: 'Card Games',
	superSlot: 'Super Slot',
	tableGames: 'Table Games',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
