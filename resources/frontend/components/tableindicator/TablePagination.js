import React from 'react';
import {TablePagination as MuiTablePagination} from '@mui/material';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import { Pagination } from '@mui/material';
import styles from './TablePagination.module';
import MediaQuery from 'react-responsive';

function PaginationActions({ count, page, rowsPerPage, onPageChange }) {
	let pageCountInt = parseInt(count / rowsPerPage);
	let hasRamainingRows = count % rowsPerPage > 0;
	let pageCountTotal = pageCountInt + hasRamainingRows;

	return (
		<MediaQuery maxDeviceWidth={styles.main_mobile}>
			{(matches) => (
				<Pagination
					count={pageCountTotal}
					page={page + 1}
					onChange={(event, value) => {
						onPageChange(event, value - 1);
					}}
					classes={{ ul: styles.paginationActionsUl }}
					className={styles.paginationActions}
					showFirstButton={matches}
					showLastButton={matches}
				/>
			)}
		</MediaQuery>
	);
}

function CustomLabelDisplayedRows({ from, to, count }) {
	return (
		<span className={styles.labelDisplayedRows}>
			<FormattedMessage
				id="labelDisplayedRows"
				values={{
					from,
					to,
					count: count !== -1 ? count : <FormattedMessage id="moreThanTo" values={{ to }} />,
				}}
			/>
		</span>
	);
}

function TablePagination({ rowsPerPageOptions, labelDisplayedRows, rowsPerPage, ActionsComponent, ...props }) {
	return (
		<LangDataProvider category="table">
			<MuiTablePagination
				{...props}
				component="div"
				rowsPerPageOptions={rowsPerPageOptions || []}
				rowsPerPage={rowsPerPage}
				ActionsComponent={ActionsComponent || PaginationActions}
				labelDisplayedRows={labelDisplayedRows || CustomLabelDisplayedRows}
			/>
		</LangDataProvider>
	);
}

export default TablePagination;
