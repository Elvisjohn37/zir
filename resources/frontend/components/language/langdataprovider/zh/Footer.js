import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	copyright: '© {footerLink}. 版权所有.',
	pagcor: 'Pagcor',
	iomCrest: 'Isle of man',
	gamcare: 'Gamcare',
	eightenplus: '18 plus only',
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
