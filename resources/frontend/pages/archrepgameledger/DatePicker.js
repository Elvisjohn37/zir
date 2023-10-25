import React from 'react';
import { Search } from '@mui/icons-material';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { Button, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './DatePicker.module';
import TextField from '@mui/material/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@mui/icons-material/Event';

const VIEW = ['month', 'day', 'hours'];

export function MobileDatePicker({ selectedDate, setSelectedDate, setRefresh, dateMinMax }) {
	return (
		<Grid container justify="flex-end" className={styles.mobileDatePicker}>
			<MobileDateTimePicker
				disableCloseOnSelect
				showToolbar={false}
				renderInput={(props) => (
					<TextField
						{...props}
						variant="standard"
						classes={{ root: styles.datePicker }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<EventIcon />
								</InputAdornment>
							),
						}}
					/>
				)}
				views={VIEW}
				cancelText={
					<Button component="a" className={styles.buttonAction}>
						<FormattedMessage id="cancel" />
					</Button>
				}
				okText={
					<Button component="a" className={styles.buttonAction}>
						<FormattedMessage id="ok" />
					</Button>
				}
				variant="dialog"
				ampm={true}
				format="MM/dd/yyyy h:mm a"
				value={selectedDate}
				onChange={(date) => {
					setSelectedDate(date);
				}}
				onClose={() => {
					setSelectedDate(selectedDate);
					setRefresh();
				}}
				maxDate={new Date(dateMinMax.maxDate)}
				minDate={new Date(dateMinMax.minDate)}
				minutesStep={0}
				hideTabs
			/>
		</Grid>
	);
}

export function DesktopDatePicker({ selectedDate, setSelectedDate, setRefresh, dateMinMax }) {
	return (
		<Grid container alignItems="center" classes={{ root: styles.dateTimePickerContainer }}>
			<span className={styles.dateLabel}>
				<FormattedMessage id="chooseDate" />
			</span>
			<DateTimePicker
				disableCloseOnSelect
				classes={{ root: styles.datePicker }}
				renderInput={(props) => <TextField {...props} variant="standard" classes={{ root: styles.datePicker }} />}
				color="primary"
				views={VIEW}
				error={false}
				helperText={null}
				variant="inline"
				format="MM/dd/yyyy h:mm a"
				value={new Date(selectedDate)}
				onChange={(date) => {
					setSelectedDate(date);
				}}
				onClose={() => {
					setSelectedDate(selectedDate);
				}}
				maxDate={new Date(dateMinMax.maxDate)}
				minDate={new Date(dateMinMax.minDate)}
				minutesStep={0}
				hideTabs
			/>
			<Button
				variant="contained"
				color="secondary"
				size="small"
				className={styles.searchBtnIdt}
				classes={{ root: styles.searchBtn }}
				onClick={() => {
					setRefresh();
				}}
			>
				<Search />
				<FormattedMessage id="search" />
			</Button>
		</Grid>
	);
}
