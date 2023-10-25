import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Spinner.module';
import classnames from 'classnames';

export default function Spinner({ color = 'secondary', className }) {
	return (
		<div className={classnames([className, styles.spinnerWrap])}>
			<div className={styles.spinnerArea}>
				<CircularProgress color={color} />
			</div>
		</div>
	);
}
