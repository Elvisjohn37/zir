import React from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import classnames from 'classnames';
import styles from './MovingArrow.module';

let MovingArrow = ({ direction = 'left', onClick = () => null, className }) => {
	return (
		<div className={classnames([styles.movingArrow, styles[direction], className])} onClick={onClick}>
			<ArrowBackIosNewRoundedIcon className={styles.arrow} />
			<ArrowBackIosNewRoundedIcon className={styles.arrow} />
		</div>
	);
};

export default MovingArrow;
