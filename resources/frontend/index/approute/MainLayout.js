import React from 'react';
import LayoutError from 'frontend/components/LayoutError';
import { UserConsumer } from 'frontend/contexts/User';
import LayoutProvider, { LayoutConsumer } from 'frontend/contexts/Layout';
import { NotificationProvider } from 'frontend/components/Notification';
import { LangProvider } from 'frontend/components/Language';
import withSuspense from 'frontend/utils/withSuspense';
import MediaQuery from 'react-responsive';
import styles from './MainLayout.module';

let DesktopLoader = withSuspense(
	React.lazy(function () {
		return import('./mainlayout/DesktopLoader');
	})
);

let Desktop = withSuspense(
	React.lazy(function () {
		return import('./mainlayout/Desktop');
	})
);

let Mobile = withSuspense(
	React.lazy(function () {
		return import('./mainlayout/Mobile');
	})
);

let CookiePolicy = withSuspense(
	React.lazy(function () {
		return import('./mainlayout/CookiePolicy');
	})
);

let MobileLoader = withSuspense(
	React.lazy(function () {
		return import('./mainlayout/MobileLoader');
	})
);

export default function MainLayout({ children }) {
	return (
		<LayoutProvider type="main">
			<LayoutConsumer>
				{({ layoutState }) => (
					<UserConsumer>
						{({ userState }) =>
							userState.isLoading || layoutState.isLoading ? (
								<MediaQuery minDeviceWidth={styles.main_tablet}>
									{(matches) => (matches ? <DesktopLoader /> : <MobileLoader />)}
								</MediaQuery>
							) : userState.isError || layoutState.isError ? (
								<LayoutError />
							) : (
								<LangProvider config={layoutState.config.lang}>
									<NotificationProvider>
										{layoutState.config.isMobileSite ? (
											<Mobile userState={userState}>{children}</Mobile>
										) : (
											<Desktop userState={userState}>{children}</Desktop>
										)}
										<CookiePolicy />
									</NotificationProvider>
								</LangProvider>
							)
						}
					</UserConsumer>
				)}
			</LayoutConsumer>
		</LayoutProvider>
	);
}
