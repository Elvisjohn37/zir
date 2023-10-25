import React, { useState } from 'react';
import styles from './CookiePolicy.module';
import { LangDataProvider } from 'frontend/components/Language';
import Grid from '@mui/material/Grid';
import { FormattedMessage } from 'react-intl';
import Button from '@mui/material/Button';
import { getCookie, putCookie } from 'frontend/utils/helper';

export default function CookiePolicy() {
	let acceptCookie = getCookie('zip_cpAccepted');
	let [isAccepted, setIsAccepted] = useState(parseInt(acceptCookie) == 1);

	let handleAccept = function () {
		setIsAccepted(true);
		putCookie('zip_cpAccepted', 1);
	};

	return isAccepted ? null : (
		<LangDataProvider category="cookiepolicy">
			<div className={styles.container}>
				<div className={styles.content}>
					<Grid container spacing={2}>
						<Grid item xs={12} lg={9} className={styles.text}>
							<FormattedMessage id="cookiePolicy" />
						</Grid>
						<Grid item xs={12} lg={3} className={styles.button}>
							<Button variant="contained" color="secondary" className={styles.buttonContent} onClick={handleAccept}>
								<FormattedMessage id="acceptAndClose" />
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		</LangDataProvider>
	);
}
