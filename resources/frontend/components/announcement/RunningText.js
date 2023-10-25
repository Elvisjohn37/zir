import React, { useEffect, useState } from 'react';
import styles from './RunningText.module';
import { isEmpty } from 'frontend/utils/helper';
import classnames from 'classnames';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';

export default function RunningText({ announcements, isUpdate, update, classes }) {
	let [activeIndex, setActiveIndex] = useState(null);
	let [isAnimationRunning, setIsAnimationRunning] = useState(true);
	let [isClosedAnnouncements, setIsClosedAnnouncements] = useState(false);
	let [validAnnouncements, setValidAnnouncements] = useState([]);
	let [updateNumber, setUpdateNumber] = useState(0);
	classes = classes || {};

	function filterAnnouncement() {
		setValidAnnouncements(
			announcements.filter((announcement) => {
				return (
					isClosedAnnouncements == false &&
					(new Date(announcement.dateTimeExpire) > new Date() || announcement.dateTimeExpire == null)
				);
			})
		);
	}

	function setNewActiveIndex(nextActiveIndex) {
		if (nextActiveIndex === 0 || validAnnouncements.length == nextActiveIndex) {
			if (isUpdate) {
				update();
			}
			filterAnnouncement();
			setActiveIndex(0);
		} else {
			setActiveIndex(nextActiveIndex);
		}
	}

	useEffect(() => {
		setNewActiveIndex(0);

		document.addEventListener('visibilitychange', changeAnimationState);

		return () => {
			document.removeEventListener('visibilitychange', changeAnimationState);
		};
	}, []);

	function changeAnimationState() {
		if (document.visibilityState === 'visible') {
			setIsAnimationRunning(true);
		} else {
			setIsAnimationRunning(false);
		}
	}

	return (
		!isEmpty(validAnnouncements) &&
		!isClosedAnnouncements && (
			<LangDataProvider category="announcement">
				<div className={classnames([styles.runningTextAnnouncement, classes.runningTextAnnouncement])}>
					<div className={classnames([styles.announcementContainer, classes.announcementContainer])}>
						<div className={classnames([styles.label, classes.label])}>
							<FormattedMessage id="announcement" />
						</div>
						<div
							key={validAnnouncements[activeIndex].playerAnnouncementID + updateNumber}
							className={classnames(
								styles.announcementContent,
								styles.animateRunningTextAnnouncement,
								classes.content
							)}
							onAnimationEnd={() => {
								setNewActiveIndex((activeIndex += 1));
								setUpdateNumber((updateNumber += 1));
							}}
							style={{
								animationDuration:
									validAnnouncements[activeIndex].content.split(' ').length * 0.3 * 2 + 5 + 's',
								animationPlayState: isAnimationRunning ? 'running' : 'paused',
							}}
						>
							{validAnnouncements[activeIndex].content}
						</div>
						<div
							className={classnames([styles.closeRunningAnnouncement, classes.closeRunningAnnouncement])}
						>
							<IconButton aria-label="delete" onClick={() => setIsClosedAnnouncements(true)} size="small">
								<CloseIcon className={classnames([styles.closeIcon, classes.closeIcon])} />
							</IconButton>
						</div>
					</div>
				</div>
			</LangDataProvider>
		)
	);
}
