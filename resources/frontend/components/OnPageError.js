import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
// import PanToolIcon from '@mui/icons-material/PanTool';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Button from '@mui/material/Button';
import styles from './OnPageError.module';
import { isObject, isEmpty, isPopup } from 'frontend/utils/helper';
import { NavLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import flatten from 'flat';
import { gameOnClick } from 'frontend/utils/gameHelper';
import Container from '@mui/material/Container';
import Image from 'frontend/components/Image';
import * as backend from 'frontend/ajax/backend';
import ReportIcon from '@mui/icons-material/Report';

function getStatus(response) {
	let hasResponse = isObject(response) && !isEmpty(response);

	if (hasResponse) {
		return isEmpty(response.status) ? '200' : response.status;
	} else {
		return '200';
	}
}

function getData(response) {
	let hasResponse = isObject(response) && !isEmpty(response);

	if (hasResponse) {
		return isEmpty(response.data) ? {} : flatten(response.data);
	} else {
		return {};
	}
}

function goToSite(e) {
	if (isPopup()) {
		e.preventDefault();
		window.close();
	}
}

function ErrorIcon({ status }) {
	switch (status) {
		case '404':
			return <BrokenImageIcon />;
		case '401':
		case '403':
			return <ReportIcon />;
		default:
			return <RemoveCircleIcon />;
	}
}

function settleRunningGame(gameID) {
	backend.settleRunningGame({
		success: () => {
			gameOnClick(gameID);
		},
	});
}

function ErrorButton({ errorCode, values, useDefaultButton }) {
	switch (errorCode) {
		case 'ERR_00027':
			// running game
			return (
				<>
					<Button
						component={NavLink}
						variant="outlined"
						to="/"
						onClick={goToSite}
						startIcon={<ArrowBackIcon />}
						color="secondary"
					>
						<FormattedMessage id="goToSite" />
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							gameOnClick(values.runningGameID);
						}}
						endIcon={<ArrowForwardIcon />}
						color="secondary"
					>
						<FormattedMessage id="finishGame" values={values} />
					</Button>
				</>
			);
		case '-2':
			//session timeout
			return (
				<Button
					color="secondary"
					component={'a'}
					variant="contained"
					href="/"
					onClick={goToSite}
					startIcon={<LockOpenIcon />}
				>
					<FormattedMessage id="relogin" />
				</Button>
			);
		case 'ERR_00028':
			return '';
		case 'ERR_00017':
			return <ConfirmationButton onSettle={() => settleRunningGame(values.gameID)} />;
		case 'ERR_00018':
			return <ConfirmationButton onSettle={() => settleRunningGame(values.gameID)} />;
		default:
			return useDefaultButton ? (
				<Button
					component={'a'}
					variant="contained"
					href="/"
					onClick={goToSite}
					endIcon={<ArrowForwardIcon />}
					color="secondary"
				>
					<FormattedMessage id="goToSite" />
				</Button>
			) : null;
	}
}

function ConfirmationButton({ onSettle }) {
	return (
		<>
			<Button
				component={NavLink}
				variant="contained"
				to="/"
				onClick={goToSite}
				startIcon={<ArrowBackIcon />}
				color="secondary"
			>
				<FormattedMessage id="no" />
			</Button>
			<Button variant="contained" onClick={onSettle} endIcon={<ArrowForwardIcon />} color="secondary">
				<FormattedMessage id="yes" />
			</Button>
		</>
	);
}

export default function OnPageError({ response, useDefaultButton }) {
	let errorCode = response.error.code;
	let errorPage = require('frontend/externals/ErrorPage/zircon_404.png');
	let statusCode = getStatus(response);

	const ERROR_STATUS_CODE = 404;

	return statusCode == ERROR_STATUS_CODE ? (
		<Image className={styles.errorPage} src={errorPage} />
	) : (
		<LangDataProvider category="errorcomponent">
			<LangDataProvider category="errormessage">
				<Alert
					severity="error"
					icon={
						<div className={styles.errorIcon}>
							<ErrorIcon status={statusCode} />
						</div>
					}
					classes={{ message: styles.message }}
					className={styles.alertContainer}
				>
					<AlertTitle className={styles.title}>
						<FormattedMessage id={`${errorCode}.title`} values={getData(response)} />
					</AlertTitle>
					<FormattedMessage id={`${errorCode}.message`} values={getData(response)} />
					{response.requestID && (
						<div className={styles.refNo}>
							<FormattedMessage id="refNo" />: {response.requestID}
						</div>
					)}
					<div className={styles.buttons}>
						<ErrorButton errorCode={errorCode} values={getData(response)} useDefaultButton={useDefaultButton} />
					</div>
				</Alert>
			</LangDataProvider>
		</LangDataProvider>
	);
}

function getWindowErrorCode(response) {
	response = response || window.response;
	let hasResponse = isObject(response) && !isEmpty(response);

	if (hasResponse) {
		if (response.result === true) {
			return null;
		} else {
			let hasErrorCode = isObject(response.error) && !isEmpty(response.error.code);

			return hasErrorCode ? response.error.code : false;
		}
	} else {
		return false;
	}
}

export function ErrorPage({ fallback, response, useDefaultButton }) {
	response = response || window.response;
	useDefaultButton = useDefaultButton !== undefined ? useDefaultButton : true;
	let errorCode = getWindowErrorCode(response);

	if (!errorCode) {
		if (!fallback) {
			window.location = '/error/notfound';
		} else {
			return fallback;
		}
	} else {
		return (
			<div className={styles.parent}>
				<Container className={styles.container} maxWidth="sm">
					<OnPageError response={response} useDefaultButton={useDefaultButton} />
				</Container>
			</div>
		);
	}
}

export function ErrorLight({ icon: Icon, errorCode, buttons }) {
	return (
		<LangDataProvider category="errormessage">
			<div className={styles.errorLight}>
				<div className={styles.errorLightIconContainer}>
					<Icon className={styles.errorLightIcon} />
				</div>
				<div className={styles.errorLightMessageContainer}>
					<FormattedMessage id={`${errorCode}.message`} />
				</div>
				{buttons && <div className={styles.errorLightButtonsContainer}>{buttons}</div>}
			</div>
		</LangDataProvider>
	);
}
