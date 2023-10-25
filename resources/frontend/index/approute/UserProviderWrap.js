import React from 'react';
import UserProvider from 'frontend/contexts/User';

export default function UserProviderWrap({ children }) {
	return <UserProvider>{children}</UserProvider>;
}
