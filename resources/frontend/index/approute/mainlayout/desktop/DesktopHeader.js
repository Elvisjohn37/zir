import React, { Suspense, lazy } from 'react';
import logo from 'frontend/assets/images/layout/logo.svg';
import styles from './DesktopHeader.module';
import ErrorBoundary from 'frontend/components/ErrorBoundary';
import MenuContent from 'frontend/components/Menu';
import { UserConsumer } from 'frontend/contexts/User';
import { AppBar } from '@mui/material';
import Skeleton from 'frontend/components/Skeleton';
import { LoginSkeleton } from 'frontend/components/LoginForm';
import AccountBalance from 'frontend/components/AccountBalance';
import { LangDropdown } from 'frontend/components/Language';
import Announcement from 'frontend/components/Announcement';
import MediaQuery from 'react-responsive';

let HeaderLoginForm = lazy(() => import('frontend/components/LoginForm'));
let HeaderLogout = lazy(() => import('frontend/components/Logout'));
let AfterLogin = lazy(() => import('./desktopheader/AfterLogin'));
let BeforeLogin = lazy(() => import('./desktopheader/BeforeLogin'));

export default function DesktopHeader() {
	return (
		<>
			<div className={styles.container}>
				<AppBar component="div" elevation={0} classes={{ root: styles.appBar }} position="relative">
					<div className={styles.logoContainer}>
						<img src={logo} />
					</div>
					<div className={styles.menuContainer}>
						<div className={styles.menuContent}>
							<div className={styles.loginBar}>
								<div className={styles.headerLoginForm}>
									<ErrorBoundary>
										<MediaQuery maxWidth={999}>
											{(matches) => (
												<UserConsumer>
													{({ userState, userDispatch }) =>
														userState.isLogin ? (
															<>
																<div className={styles.announcementAfterLogin}>
																	<Announcement
																		viewType="playerSite"
																		isMobile={matches}
																		classes={{
																			announcementContainer:
																				styles.announcementContainer,
																			label: styles.announcementLabel,
																			closeRunningAnnouncement:
																				styles.closeRunningAnnouncement,
																			announcementContent:
																				styles.announcementContent,
																		}}
																	/>
																</div>
																<div className={styles.logoutButton}>
																	<AccountBalance
																		userState={userState}
																		userDispatch={userDispatch}
																		className={styles.accountBalance}
																	/>
																	<Suspense
																		fallback={<Skeleton count={1} width={70} />}
																	>
																		<HeaderLogout
																			disableRipple={false}
																			sideBar={false}
																		/>
																	</Suspense>
																</div>
															</>
														) : (
															<>
																<div className={styles.announcementBeforeLogin}>
																	<Announcement
																		viewType="playerSite"
																		isMobile={matches}
																		classes={{
																			announcementContainer:
																				styles.announcementContainer,
																			label: styles.announcementLabel,
																			closeRunningAnnouncement:
																				styles.closeRunningAnnouncement,
																			announcementContent:
																				styles.announcementContent,
																		}}
																	/>
																</div>
																<div className={styles.loginForm}>
																	<Suspense fallback={<LoginSkeleton />}>
																		<HeaderLoginForm />
																	</Suspense>
																</div>
															</>
														)
													}
												</UserConsumer>
											)}
										</MediaQuery>
									</ErrorBoundary>
								</div>
							</div>
							<div className={styles.menuBar}>
								<div className={styles.menuLinks}>
									<ErrorBoundary>
										<MenuContent beforeLogin={BeforeLogin} afterLogin={AfterLogin} />
									</ErrorBoundary>
								</div>
								<div className={styles.langContainer}>
									<LangDropdown className={styles.langDropDown} />
								</div>
							</div>
						</div>
					</div>
				</AppBar>
			</div>
		</>
	);
}
