import React from 'react';
import styles from './TableIndicator.module';
import Grid from '@mui/material/Grid';
import Skeleton from 'frontend/components/Skeleton';
import Spinner from 'frontend/components/Spinner';
import lodash from 'lodash';
import Zoom from '@mui/material/Zoom';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Paper from '@mui/material/Paper';
import TablePagination from './tableindicator/TablePagination';
import { ErrorLight } from 'frontend/components/OnPageError';

function LoadingIndicatorBig() {
	let skeletonColNumbers = 4;
	let skeletonHeader = lodash.range(skeletonColNumbers);
	let skeletonRow = lodash.range(skeletonColNumbers * 3);
	return (
		<Grid container spacing={1}>
			{skeletonHeader.map((number) => (
				<Grid item xs={3} key={number}>
					<Skeleton height={30} className={styles.loadingSkeleton} />
				</Grid>
			))}
			{skeletonRow.map((number) => (
				<Grid item xs={3} key={number}>
					<Skeleton className={styles.loadingSkeleton} />
				</Grid>
			))}
		</Grid>
	);
}

function LoadingIndicatorSmall() {
	return (
		<Zoom in={true} timeout={{ enter: 300 }} mountOnEnter unmountOnExit>
			<div className={styles.loadingSpinner}>
				<Spinner />
			</div>
		</Zoom>
	);
}

export default function TableIndicator({ isLoading, isEmpty, isError, children, pagination }) {
	return (
		<div className={styles.tableIndicator}>
			{isError ? (
				<ErrorLight icon={ErrorOutlineIcon} errorCode="ERR_00001" />
			) : isLoading && isEmpty ? (
				<LoadingIndicatorBig />
			) : !isLoading && isEmpty ? (
				<ErrorLight icon={SearchIcon} errorCode="ERR_00030" />
			) : (
				<Paper className={styles.tablePaperContainer}>
					{isLoading && !isEmpty && <LoadingIndicatorSmall />}
					{children}
					{pagination && <TablePagination {...pagination} />}
				</Paper>
			)}
		</div>
	);
}
