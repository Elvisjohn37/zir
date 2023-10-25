import React from 'react';
import Image from 'frontend/components/Image';
import GameCertifiedDialog from 'frontend/components/GameCertifiedDialog';
import styles from './BannerRedirect.module';
import { gameOnClick } from 'frontend/utils/gameHelper';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { UserConsumer } from 'frontend/contexts/User';

let BannerRedirect = ({ gameID, isCertified, isNewTab, ...props }) => {
	let [isNotCertPopup, setIsNotCertPopup] = React.useState(false);

	function openGame(userJurisdiction) {
		if (userJurisdiction == 'IOM' && !isCertified) {
			setIsNotCertPopup(true);
		} else {
			gameOnClick(gameID, isNewTab ? '_blank' : '_self');
		}
	}

	return (
		<UserConsumer>
			{({ userState }) => (
				<>
					<Button
						className={styles.bannerImg}
						component={NavLink}
						onClick={() => openGame(userState.user.jurisdiction)}
						color="primary"
						to=""
					>
						<Image {...props} />
					</Button>
					{userState.user.jurisdiction == 'IOM' && (
						<GameCertifiedDialog gameID={gameID} isNotCertPopup={isNotCertPopup} />
					)}
				</>
			)}
		</UserConsumer>
	);
};

export default BannerRedirect;
