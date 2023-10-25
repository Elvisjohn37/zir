import React, { useEffect, useState } from 'react';
import styles from './PopUp.module';
import { isEmpty, getCookie, putCookie, isValidMin } from 'frontend/utils/helper';
import Image from 'frontend/components/Image';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { FormattedMessage } from 'react-intl';
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function PopUp({ announcements, update, clientID, viewType, updateNumber, config }) {
	let [activeIndex, setActiveIndex] = useState(null);
	let [isModalOpen, setIsModalOpen] = useState(false);
	let [displayedAnnouncements, setDisplayedAnnouncements] = useState([]);
	let [validAnnouncements, setValidAnnouncements] = useState(filterAnnouncement());
	let [isTriggerModalEventOnClose, setIsTriggerModalEventOnClose] = useState(false);
	let [isDontShowAgain, setIsDontShowAgain] = useState(false);
	let cookieName = config.hideCookie + '_' + viewType + '_' + clientID;
	let cookie = getCookie(cookieName);

	useEffect(() => {
		setNewActiveIndex(0);
	}, [updateNumber]);

	// trigger events when modal change state close/open
	useEffect(() => {
		let modalTimeOut;

		if (!isEmpty(config.popupDurations)) {
			if (isModalOpen) {
				setIsTriggerModalEventOnClose(true);
				modalTimeOut = setTimeout(() => {
					setIsModalOpen(false);
				}, parseInt(config.popupDurations));
			} else {
				isTriggerModalEventOnClose && modalClosed();
				setIsTriggerModalEventOnClose(false);
			}
		}

		return () => modalTimeOut && clearTimeout(modalTimeOut);
	}, [isModalOpen, config.popupDurations]);

	function modalClosed() {
		// add to displayed announcement the current active first
		activeIndex !== null &&
			validAnnouncements[activeIndex] &&
			setDisplayedAnnouncements([
				...displayedAnnouncements,
				...[validAnnouncements[activeIndex].playerAnnouncementID],
			]);

		// add to dont show again cookie if checkbox is checked
		if (isDontShowAgain) {
			setIsDontShowAgain(false);

			let cookieAnnouncement = {
				aID: validAnnouncements[activeIndex].playerAnnouncementID,
				startDateTime: new Date(),
			};

			if (isEmpty(cookie)) {
				putCookie(cookieName, JSON.stringify([cookieAnnouncement]));
			} else {
				let jsonFormat = JSON.parse(cookie).filter((cookieDetail) =>
					isValidMin(cookieDetail.startDateTime, parseInt(config.hideValidMin))
				);
				putCookie(cookieName, JSON.stringify([...jsonFormat, cookieAnnouncement]));
			}
		}

		setNewActiveIndex(activeIndex + 1);
	}

	function setNewActiveIndex(nextActiveIndex) {
		if (nextActiveIndex > validAnnouncements.length - 1) {
			update();
		} else {
			// filter if next index will start to 0 again
			nextActiveIndex == 0 && setValidAnnouncements(filterAnnouncement());
			// set to next active index
			setActiveIndex(nextActiveIndex);
			setIsModalOpen(true);
		}
	}

	function filterAnnouncement() {
		let jsonFormat = !isEmpty(cookie) ? JSON.parse(cookie) : [];

		return announcements.filter((announcement) => {
			return (
				(new Date(announcement.dateTimeExpire) > new Date() || announcement.dateTimeExpire == null) &&
				jsonFormat.find((cookieDetail) => {
					return (
						announcement.playerAnnouncementID == cookieDetail.aID &&
						isValidMin(cookieDetail.startDateTime, parseInt(config.hideValidMin))
					);
				}) === undefined &&
				!displayedAnnouncements.includes(announcement.playerAnnouncementID)
			);
		});
	}

	return (
		!isEmpty(validAnnouncements) &&
		activeIndex != null && (
			<Dialog
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				closeAfterTransition
				className={styles.popUpAnnouncement}
				classes={{
					paper:
						validAnnouncements[activeIndex].announcementType == 2
							? styles.popupAnnouncementContainer
							: styles.runningAnnouncementContainer,
				}}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<div className={styles.modalTitle}>
					<IconButton aria-label="close" onClick={() => setIsModalOpen(false)} className={styles.closeButton}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className={styles.modalBody}>
					<div className={styles.popupAnnouncementContent}>
						{!isEmpty(validAnnouncements[activeIndex].content) && validAnnouncements[activeIndex].content}
						{!isEmpty(validAnnouncements[activeIndex].picture) && (
							<Image src={config.rsoUrl + validAnnouncements[activeIndex].picture} />
						)}
						{!isEmpty(validAnnouncements[activeIndex].buttonText) ? (
							<Button
								variant="contained"
								color="secondary"
								className={
									styles['buttonAnnouncement' + validAnnouncements[activeIndex].buttonAlignment]
								}
								href={validAnnouncements[activeIndex].buttonUrl || ''}
								size="small"
							>
								{validAnnouncements[activeIndex].buttonText}
							</Button>
						) : null}
						{validAnnouncements[activeIndex].announcementType == 2 && (
							<div className={styles.dontShowAgainContainer}>
								<div className={styles.dontShowAgainContent}>
									<Checkbox
										className={styles.dontShowAgain}
										color="primary"
										inputProps={{ 'aria-label': 'secondary checkbox' }}
										onChange={(event) => {
											return setIsDontShowAgain(event.target.checked);
										}}
									/>
									<FormattedMessage id="dontShowAgain" />
								</div>
							</div>
						)}
					</div>
				</div>
			</Dialog>
		)
	);
}
