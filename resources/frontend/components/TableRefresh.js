import React from 'react';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { KeyboardBackspace, Refresh } from '@mui/icons-material';
import styles from './TableRefresh.module';
import { FormattedMessage } from 'react-intl';

export function DesktopTableRefresh({ onClick, isDisabled, id, values, hasBackButton = true }) {
	return (
		<div className={styles.tableDesktopRefresh}>
			{hasBackButton && (
				<Button
					component={NavLink}
					to="/account/archived-report/statement"
					classes={{ root: styles.backButton }}
				>
					<KeyboardBackspace fontSize="small" />
				</Button>
			)}
			<Button
				component="a"
				onClick={onClick}
				classes={{ root: styles.refreshButton }}
				startIcon={<Refresh />}
				disabled={isDisabled}
			>
				<FormattedMessage id={id} values={values} />
			</Button>
		</div>
	);
}

export function MobileTableRefresh({ onClick, display, isDisabled, hasBackButton = true }) {
	return (
		<div className={styles.tableMobileRefresh}>
			{hasBackButton ? (
				<Button
					component={NavLink}
					to="/account/archived-report/statement"
					classes={{ root: styles.backButton }}
				>
					<KeyboardBackspace fontSize="small" />
				</Button>
			) : (
				<div></div>
			)}
			<Button
				variant="contained"
				color="primary"
				disableElevation
				component="a"
				onClick={onClick}
				classes={{ root: styles.refreshButton }}
				startIcon={<Refresh />}
				disabled={isDisabled}
			>
				{display}
			</Button>
		</div>
	);
}
