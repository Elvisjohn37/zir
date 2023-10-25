import React, { useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { LangConsumer } from 'frontend/contexts/Language';
import dataHandlers, { menuPathName } from 'frontend/utils/menuDataHandlers';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import styles from './BeforeLogin.module';

export default function BeforeLogin() {
	let pathname = menuPathName(useLocation);
	let tabRef = React.useRef();
	useEffect(() => {
		setTimeout(() => {
			tabRef.current.updateIndicator();
		}, 100);
	});

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LangConsumer>
					{({ langState }) => {
						const MENU_LINK = dataHandlers.getBeforeLoginMenu(layoutState);

						var activePath = Object.values(MENU_LINK[langState.active]).includes(pathname)
							? pathname
							: false;

						return (
							<Tabs
								value={activePath}
								//indicatorColor="secondary"
								textColor="primary"
								variant="scrollable"
								scrollButtons="auto"
								aria-label="scrollable auto tabs"
								action={tabRef}
								className={styles.menuTabs}
							>
								<Tab
									component={NavLink}
									to="/"
									label={<FormattedMessage id="home" />}
									value="/"
									className={styles.menuTab}
								/>
								<Tab
									href={layoutState.config.menuSportsBSI}
									target="_blank"
									label={<FormattedMessage id="sports" />}
									value="/sports"
									className={styles.menuTab}
								/>
								<Tab
									component="a"
									href={MENU_LINK[langState.active].open_account}
									target="_blank"
									label={<FormattedMessage id="openaccount" />}
									className={styles.menuTab}
								/>
								<Tab
									component={NavLink}
									to="/gamerules"
									label={<FormattedMessage id="gamerules" />}
									value="/gamerules"
									className={styles.menuTab}
								/>
								<Tab
									href={MENU_LINK[langState.active].about_us}
									label={<FormattedMessage id="aboutus" />}
									value="/aboutus"
									target="_blank"
									className={styles.menuTab}
								/>
								<Tab
									href={MENU_LINK[langState.active].contact_us}
									label={<FormattedMessage id="contactus" />}
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
