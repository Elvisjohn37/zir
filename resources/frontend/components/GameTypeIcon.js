import React from 'react';
import Image from 'frontend/components/Image';
import classnames from 'classnames';
import { isEmpty } from 'frontend/utils/helper';
import Button from '@mui/material/Button';
import { LangDataProvider } from 'frontend/components/Language';
import styles from './GameTypeIcon.module';

function GameTypeIcon({ indexKey, activeIndex, iconRef, label, icon, onClick, className, hasNewGame }) {
	let [isLoaded, setIsLoaded] = React.useState(false);

	return (
		<LangDataProvider category="gametypeicon">
			<Button className={classnames(['eventHandlerContainer', className])} onClick={onClick} ref={iconRef}>
				<div className={classnames([styles.menuItem, indexKey == activeIndex && styles.active])}>
					<div
						className={classnames([
							styles.gameTypeBackground,
							isLoaded ? styles.fadein : '',
							hasNewGame && styles.newGameNotif,
						])}
					>
						<Image src={icon} onLoad={() => setIsLoaded(true)} className={styles.image} />
					</div>
					{!isEmpty(label) && <div className={styles.label}>{label}</div>}
				</div>
			</Button>
		</LangDataProvider>
	);
}

export default GameTypeIcon;
