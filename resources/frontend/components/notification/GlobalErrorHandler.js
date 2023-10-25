import React, { useEffect, useState } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { useSnackbar } from 'notistack';
import { subscribe, unsubscribe } from 'frontend/ajax/backend';
import SessionTimeoutModal from './gloabalerrorhandler/SessionTimeoutModal';
import { isEmpty } from 'frontend/utils/helper';
import styles from './GlobalErrorHandler.module';

let GlobalErrorHandler = injectIntl(({ intl }) => {
	const { enqueueSnackbar } = useSnackbar();
	let [errorCode, setErrorCode] = useState({});
	let [requestID, setRequestID] = useState(null);

	useEffect(() => {
		let errorID = subscribe('error', (response) => {
			if (response.data.error && !response.config.isErrorHandled) {
				let codeProps = response.data.error.code;
				let responseData = response.data.data ? response.data.data : {};
				let error = defineMessages({
					message: {
						id: 'message',
						defaultMessage: intl.messages[codeProps + '.message'],
					},
				});

				if (codeProps == '-2') {
					setErrorCode(codeProps);
					setRequestID(response.data.requestID);
				} else {
					enqueueSnackbar(
						<div className={styles.messageContainer}>
							{intl.formatMessage(error.message, responseData)}
							<div className={styles.refNo}>Ref no: {response.data.requestID}</div>
						</div>,
						{
							variant: 'error',
							preventDuplicate: true,
						}
					);
				}
			}
		});
		return () => {
			unsubscribe('error', errorID);
		};
	}, [errorCode]);
	return !isEmpty(errorCode) && <SessionTimeoutModal errorCode={errorCode} requestID={requestID} />;
});

export default GlobalErrorHandler;
