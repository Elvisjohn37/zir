import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	username: 'ชื่อผู้ใช้',
	password: 'รหัสผ่าน',
	sign_in: 'เข้าระบบ',
	logout: 'ออก จาก ระบบ'
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
