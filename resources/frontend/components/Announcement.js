import React, { useEffect, useState } from 'react';
import styles from './Announcement.module';
import { getAnnouncement } from 'frontend/ajax/backend';
import MediaQuery from 'react-responsive';
import { LangDataProvider } from 'frontend/components/Language';
import RunningText from './announcement/RunningText.js';
import { isEmpty } from 'frontend/utils/helper';
import PopUp from './announcement/PopUp.js';
import { subscribe, unsubscribe } from 'frontend/ajax/backend';

export default function Announcement({ viewType, ...props }) {
	let [runningTextAnnouncement, setRunningTextAnnouncement] = useState([]);
	let [popupAnnouncement, setPopupAnnouncement] = useState([]);
	let [isRunningDone, setIsRunningDone] = useState(true);
	let [isPopupDone, setIsPopupDone] = useState(true);
	let [clientID, setClientID] = useState(null);
	let [isUpdate, setIsUpdate] = useState(true);
	let [updateNumber, setUpdateNumber] = useState(0);
	let [config, setConfig] = useState({});
	let [isSessionTimeout, setIsSessionTimeout] = useState(false);

	function fetchAnnouncements() {
		getAnnouncement({
			success: (response) => {
				let data = response.data.data;
				setClientID(data.clientID);
				let announcements = data.announcements;

				data.config && setConfig(data.config);

				let filteredRunning = announcements.filter((announcement) => announcement.announcementType == 1);
				setRunningTextAnnouncement(filteredRunning);
				isEmpty(filteredRunning) && setIsRunningDone(true);

				let filteredPopup = announcements.filter((announcement) => announcement.announcementType == 2);
				setPopupAnnouncement(filteredPopup);
				isEmpty(filteredPopup) && setIsPopupDone(true);

				setUpdateNumber(updateNumber + 1);
			},
			error: () => {
				setIsRunningDone(true);
				setIsPopupDone(true);
			},
			viewType,
			showConfig: updateNumber == 0,
		});
	}

	function setUpdateTrue() {
		document.visibilityState === 'visible' && setIsUpdate(true);
	}

	useEffect(() => {
		let errorID = subscribe('error', (response) => {
			let codeProps = response.data.error.code;

			if (codeProps == '-2') {
				setIsSessionTimeout(true);
			}
		});

		document.addEventListener('visibilitychange', setUpdateTrue);
		return () => {
			unsubscribe('error', errorID);
			document.removeEventListener('visibilitychange', setUpdateTrue);
		};
	});

	useEffect(() => {
		if (isRunningDone && isPopupDone && isUpdate && isSessionTimeout === false) {
			setIsRunningDone(false);
			setIsPopupDone(false);
			setIsUpdate(false);
			fetchAnnouncements();
		}
	}, [isRunningDone, isPopupDone, isUpdate]);

	return (
		<LangDataProvider category="announcement">
			<MediaQuery maxDeviceWidth={styles.main_mobile}>
				{(matches) =>
					(!('isMobile' in props) && matches) || ('isMobile' in props && props.isMobile) ? (
						(!isEmpty(runningTextAnnouncement) || !isEmpty(popupAnnouncement)) && (
							<PopUp
								config={config}
								announcements={[...runningTextAnnouncement, ...popupAnnouncement]}
								clientID={clientID}
								update={() => {
									setIsRunningDone(true);
									setIsPopupDone(true);
								}}
								viewType={viewType}
								updateNumber={updateNumber}
							/>
						)
					) : (
						<>
							{!isEmpty(runningTextAnnouncement) && (
								<RunningText
									announcements={runningTextAnnouncement}
									isUpdate={isUpdate}
									update={() => {
										setIsRunningDone(true);
									}}
									key={`running_${updateNumber}`}
									classes={props.classes}
								/>
							)}
							{!isEmpty(popupAnnouncement) && !isEmpty(config) && (
								<PopUp
									config={config}
									announcements={popupAnnouncement}
									clientID={clientID}
									update={() => {
										setIsPopupDone(true);
									}}
									viewType={viewType}
									updateNumber={updateNumber}
								/>
							)}
						</>
					)
				}
			</MediaQuery>
		</LangDataProvider>
	);
}
