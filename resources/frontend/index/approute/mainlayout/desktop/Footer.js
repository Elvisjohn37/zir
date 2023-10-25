import React from 'react';
import styles from './Footer.module';
import { Link as ReactRouteLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import { UserConsumer } from 'frontend/contexts/User';
import { LangConsumer } from 'frontend/contexts/Language';
import dataHandlers from './footer/footerDataHandlers';
import { LayoutConsumer } from 'frontend/contexts/Layout';

export default function Footer() {
	return (
		<LayoutConsumer>
			{({ layoutState }) => {
				const FOOTER_LINK = dataHandlers.getFooterLink(layoutState);

				return (
					<LangDataProvider category="submenu">
						<LangDataProvider category="footer">
							<div className={styles.container}>
								<div className={styles.links}>
									<UserConsumer>
										{({ userState }) => (
											<>
												{userState.isLogin ? (
													<Link component={ReactRouteLink} to="/termsandcondition">
														<FormattedMessage id="termsandcondition" />
													</Link>
												) : (
													<Link component="a" href={layoutState.config.sboTermsAndConditionUrl} target="_blank">
														<FormattedMessage id="termsandcondition" />
													</Link>
												)}
											</>
										)}
									</UserConsumer>
									<LangConsumer>
										{({ langState }) => (
											<>
												<Link
													classes={{ root: styles.separator }}
													component="a"
													href={FOOTER_LINK[langState.active].privacyPolicy}
													target="_blank"
												>
													<FormattedMessage id="privacyPolicy" />
												</Link>
												<Link
													classes={{ root: styles.separator }}
													component="a"
													href={FOOTER_LINK[langState.active].responsibleGamblingPolicy}
													target="_blank"
												>
													<FormattedMessage id="responsibleGambling" />
												</Link>
												<Link
													classes={{ root: styles.separator }}
													component="a"
													href={FOOTER_LINK[langState.active].help}
													target="_blank"
												>
													<FormattedMessage id="help" />
												</Link>
											</>
										)}
									</LangConsumer>
								</div>
								<div className={styles.copyright}>
									<FormattedMessage
										id="copyright"
										values={{
											footerLink: layoutState.config.footerLink,
										}}
									/>
								</div>
							</div>
						</LangDataProvider>
					</LangDataProvider>
				);
			}}
		</LayoutConsumer>
	);
}
