import React from 'react';
import styles from './Loader.module';
import Grid from '@mui/material/Grid';
import Skeleton from 'frontend/components/Skeleton';
import lodash from 'lodash';

export default function Loader({ className }) {
	return (
		<Grid container spacing={1} className={className}>
			{lodash.range(9).map((item, index) => (
				<Grid item md={6} xs={12} lg={4} key={index}>
					<Skeleton count={1} height={36} className={styles.content} />
				</Grid>
			))}
		</Grid>
	);
}
