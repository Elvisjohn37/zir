import React, { useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { LangConsumer } from 'frontend/contexts/Language';
import dataHandlers, { menuPathName } from 'frontend/utils/menuDataHandlers';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import styles from './AfterLogin.module';

export default function AfterLogin() {
	let pathname = menuPathName(useLocation);
	let tabRef = React.useRef();

	useEffect(() => {
		setTimeout(() => {
			tabRef.current.updateIndicator();
		});
	});

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LangConsumer>
					{({ langState }) => {
						const MENU_LINK = dataHandlers.getAfterLoginMenu(layoutState);

						var activePath = Object.values(MENU_LINK[langState.active]).includes(pathname)
							? pathname
							: false;

						return (
							<Tabs
								value={activePath}
								// indicatorColor="secondary"
								textColor="secondary"
								variant="scrollable"
								scrollButtons="auto"
								aria-label="scrollable auto tabs"
								action={tabRef}
								className={styles.menuTabs}
							>
								<Tab
									component={NavLink}
									to="/"
									label={
										<span>
											<FormattedMessage id="games" />
										</span>
									}
									value="/"
									className={styles.menuTab}
								/>
								<Tab
									component={NavLink}
									to="/account"
									label={
										<span>
											<FormattedMessage id="account" />
										</span>
									}
									value="/account"
									className={styles.menuTab}
								/>
								<Tab
									component={NavLink}
									to="/gamerules"
									label={
										<span>
											<FormattedMessage id="gamerules" />
										</span>
									}
									value="/gamerules"
									className={styles.menuTab}
								/>
								<Tab
									href={MENU_LINK[langState.active].about_us}
									label={
										<span>
											<FormattedMessage id="aboutus" />
										</span>
									}
									value="/aboutus"
									target="_blank"
									className={styles.menuTab}
								/>
								<Tab
									href={MENU_LINK[langState.active].contact_us}
									label={
										<span>
											<FormattedMessage id="contactus" />
										</span>
									}
									value="/contactus"
									target="_blank"
									className={styles.menuTab}
								/>
							</Tabs>
						);
					}}
				</LangConsumer>
			)}
		</LayoutConsumer>
	);
}
