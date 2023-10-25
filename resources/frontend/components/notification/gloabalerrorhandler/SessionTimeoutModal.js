import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import { Dialog, DialogActions, DialogContentText, DialogContent, Button } from '@mui/material';
import styles from './SessionTimeoutModal.module';
import { FormattedMessage } from 'react-intl';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { isEmpty } from 'frontend/utils/helper';

export default function SessionTimeoutModal({ errorCode, requestID }) {
	return (
		<LangDataProvider category="errorcomponent">
			<LangDataProvider category="errormessage">
				<Dialog
					open={true}
					fullwidth
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogContent>
						<h2 className={styles.title}>
							<FormattedMessage id={errorCode + '.title'} />
						</h2>
						<DialogContentText classes={{ root: styles.message }}>
							<FormattedMessage id={errorCode + '.message'} />
							{!isEmpty(requestID) && (
								<div className={styles.refNo}>
									<FormattedMessage id="refNo" />: {requestID}
								</div>
							)}
						</DialogContentText>
						<DialogActions>
							<Button
								classes={{ label: styles.action }}
								onClick={() => {
									window.location.reload(true);
								}}
								color="secondary"
								startIcon={<LockOpenIcon />}
							>
								<FormattedMessage id="relogin" />
							</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
			</LangDataProvider>
		</LangDataProvider>
	);
}
