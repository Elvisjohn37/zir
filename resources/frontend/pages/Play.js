import React, { useState, useEffect } from 'react';
import { ErrorPage } from 'frontend/components/OnPageError';
import styles from './Play.module';
import AccountBalance from 'frontend/components/AccountBalance';
import { MoneyFormatToggle } from 'frontend/components/MoneyFormat';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import RunningDateTime from './play/RunningDateTime';
import { UserConsumer } from 'frontend/contexts/User';
import Spinner from 'frontend/components/Spinner';
import classnames from 'classnames';
import Announcement from 'frontend/components/Announcement';
import { postMessageHandler, windowResponse } from './play/helper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { isEmpty } from 'frontend/utils/helper';

export default function Play() {
	let [isLoading, setIsLoading] = useState(true);
	let isMobile = windowResponse().data.isMobile;
	let balanceInfo = windowResponse().data.balanceInfo;
	let playableBalance = isEmpty(balanceInfo) ? 0 : balanceInfo.playableBalance;
	let [isZeroBalancePopup, setIsZeroBalancePopup] = useState(playableBalance <= 0);

	useEffect(() => {
		window.addEventListener('message', postMessageHandler, false);

		return () => {
			window.removeEventListener('message', postMessageHandler);
		};
	});

	return windowResponse().result === true ? (
		<LangDataProvider category="gamewindow">
			<UserConsumer>
				{({ userState }) => (
					<>
						{isMobile ? (
							<Announcement viewType={windowResponse().data.productID} isMobile={isMobile} />
						) : (
							<div className={styles.header}>
								{/* <div className={styles.logoContainer}>
										<Image src={logo} className={styles.logoImage} />
									</div> */}
								<div className={styles.headerContent}>
									<div className={styles.topContainer}>
										<div className={styles.runningDateTime}>
											<RunningDateTime className="testRunningDateTime" />
										</div>
									</div>
									<div className={styles.bottomContainer}>
										<div className={styles.announcementWrapper}>
											<Announcement
												className="testAnnouncement"
												viewType={windowResponse().data.productID}
												isMobile={false}
											/>
										</div>
										<div className={styles.balancesWrapper}>
											<div className={styles.maxPayoutWrapper}>
												<div className={styles.maxPayout}>
													<div className={styles.amountText}>
														<span className={styles.amountFigure}>
															<FormattedMessage id="maxPayoutPerBet" />
															{`${userState.currencyCode} `}
															<MoneyFormatToggle
																value={windowResponse().data.maxPayout}
																compactStart={100000000}
															/>
														</span>
													</div>
												</div>
											</div>
											<AccountBalance
												format="{currencyCode} {balance}"
												className={styles.accountBalance}
												withRefreshButton={true}
												isAutoUpdate={true}
												compactStart={100000000}
												initialBalanceInfo={balanceInfo}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
						<div className={classnames([styles.body, isMobile && styles.mobileBody])}>
							<div className={styles.content}>
								{isLoading && <Spinner color="primary" className={styles.iframeSpinner} />}
								{!isZeroBalancePopup && (
									<iframe
										className={styles.gameIframe}
										src={windowResponse().data.url}
										onLoad={() => setIsLoading(false)}
									/>
								)}
							</div>
						</div>
						<Dialog open={isZeroBalancePopup} maxWidth="xs">
							<DialogContent>
								<DialogContentText classes={{ root: styles.zeroBalanceMessage }}>
									<FormattedMessage id="zeroBalance" />
								</DialogContentText>
								<DialogActions>
									<Button
										onClick={() => {
											setIsZeroBalancePopup(false);
										}}
										color="secondary"
										variant="contained"
									>
										<FormattedMessage id="ok" />
									</Button>
								</DialogActions>
							</DialogContent>
						</Dialog>
					</>
				)}
			</UserConsumer>
		</LangDataProvider>
	) : (
		<ErrorPage />
	);
}
