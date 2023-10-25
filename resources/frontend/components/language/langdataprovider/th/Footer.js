import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	copyright: 'ลิขสิทธิ์ © {footerLink}. สงวนลิขสิทธิ์.',
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
