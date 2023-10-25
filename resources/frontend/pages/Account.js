import React from 'react';
import styles from './Account.module';
import Button from '@mui/material/Button';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { openAccountWindow } from './account/helper';
import { UserConsumer } from 'frontend/contexts/User';

import { AccountBalanceWallet, SwapHoriz, PanTool, RemoveCircle, Archive } from '@mui/icons-material';

export default function Account() {
	return (
		<LangDataProvider category="submenu">
			<UserConsumer>
				{({ userState }) => {
					return (
						<div className={styles.account}>
							<div className={styles.menuContainer}>
								<Grid container spacing={parseInt(styles.account_menuSpacing)} alignItems="center">
									{userState.user.isWalkIn === 1 && (
										<Grid item md={6} xs={6} lg={4}>
											<Button
												className={styles.label}
												onClick={() => {
													openAccountWindow('/account/transferfunds');
												}}
												classes={{ root: styles.accMenuBtn }}
												variant="contained"
												disableElevation
												color="primary"
											>
												<SwapHoriz fontSize="large" />
												<FormattedMessage id="transferfunds" />
											</Button>
										</Grid>
									)}
									<Grid item md={6} xs={6} lg={4}>
										<Button
											className={styles.label}
											onClick={() => {
												openAccountWindow('/account/balance');
											}}
											classes={{ root: styles.accMenuBtn, label: styles.label }}
											variant="contained"
											disableElevation
											color="primary"
										>
											<AccountBalanceWallet fontSize="large" />
											<FormattedMessage id="balance" />
										</Button>
									</Grid>
									<Grid item md={6} xs={6} lg={4}>
										<Button
											className={styles.label}
											component={Link}
											to="/account/archived-report"
											classes={{ root: styles.accMenuBtn, label: styles.label }}
											variant="contained"
											disableElevation
											color="primary"
										>
											<Archive fontSize="large" />
											<FormattedMessage id="archivedReport" />
										</Button>
									</Grid>
									<Grid item md={6} xs={6} lg={4}>
										<Button
											className={styles.label}
											onClick={() => {
												openAccountWindow('/account/limitadjust');
											}}
											classes={{ root: styles.accMenuBtn, label: styles.label }}
											variant="contained"
											disableElevation
											color="primary"
										>
											<RemoveCircle fontSize="large" />
											<FormattedMessage id="limitadjust" />
										</Button>
									</Grid>
									<Grid item md={6} xs={6} lg={4}>
										<Button
											className={styles.label}
											onClick={() => {
												openAccountWindow('/account/selfexclusion');
											}}
											classes={{ root: styles.accMenuBtn, label: styles.label }}
											variant="contained"
											disableElevation
											color="primary"
										>
											<PanTool fontSize="large" />
											<FormattedMessage id="selfexclusion" />
										</Button>
									</Grid>
								</Grid>
							</div>
						</div>
					);
				}}
			</UserConsumer>
		</LangDataProvider>
	);
}
