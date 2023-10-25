import React from 'react';
import Search from '@mui/icons-material/Search';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import styles from './DatePicker.module';
import { isArrowDisabled, navigateTime } from './datepicker/helper';
import { FormattedMessage } from 'react-intl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@mui/icons-material/Event';

const VIEW = ['month', 'day', 'hours'];

function DesktopDatePicker({ transactionLogLoading, selectedDate, setSelectedDate, refresh, dateMinMax }) {
	let [prevArrow, setPrevArrow] = React.useState(isArrowDisabled('prev', selectedDate.getHours()));
	let [nextArrow, setNextArrow] = React.useState(isArrowDisabled('next', selectedDate.getHours()));

	return (
		<Grid container alignItems="center" classes={{ root: styles.dateTimePickerContainer }}>
			<span className={styles.dateLabel}>
				<FormattedMessage id="chooseDate" />
			</span>
			<DateTimePicker
				disableCloseOnSelect
				classes={{ root: styles.datePicker }}
				color="primary"
				views={VIEW}
				error={false}
				renderInput={(props) => <TextField {...props} variant="standard" classes={{ root: styles.datePicker }} />}
				variant="inline"
				format="MM/dd/yyyy h:mm a"
				value={new Date(selectedDate)}
				onChange={(date) => {
					if (date.getHours() != selectedDate.getHours()) {
						setPrevArrow(isArrowDisabled('prev', date.getHours()));
						setNextArrow(isArrowDisabled('next', date.getHours()));
					}
					setSelectedDate(date);
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
				classes={{ root: styles.searchBtn }}
				className={styles.searchBtnIdt}
				disabled={transactionLogLoading}
				onClick={() => {
					refresh();
				}}
			>
				<Search />
				<FormattedMessage id="search" />
			</Button>
			<Button
				classes={{ root: styles.prevBtn }}
				className={styles.prevBtnIdt}
				variant="outlined"
				color="secondary"
				size="small"
				disabled={transactionLogLoading ? transactionLogLoading : prevArrow}
				onClick={() => {
					navigateTime(selectedDate, setSelectedDate, setPrevArrow, setNextArrow, refresh, 'sub');
				}}
			>
				<NavigateBefore />
				<span className={styles.btnLabel}>
					<FormattedMessage id="previous" />
				</span>
			</Button>
			<Button
				classes={{ root: styles.nextBtn }}
				className={styles.nextBtnIdt}
				variant="outlined"
				color="secondary"
				size="small"
				disabled={transactionLogLoading ? transactionLogLoading : nextArrow}
				onClick={() => {
					navigateTime(selectedDate, setSelectedDate, setPrevArrow, setNextArrow, refresh, 'add');
				}}
			>
				<span className={styles.btnLabel}>
					<FormattedMessage id="next" />
				</span>
				<NavigateNext />
			</Button>
		</Grid>
	);
}

function MobileDatePicker({ transactionLogLoading, selectedDate, setSelectedDate, refresh, dateMinMax }) {
	let [prevArrow, setPrevArrow] = React.useState(isArrowDisabled('prev', selectedDate.getHours()));
	let [nextArrow, setNextArrow] = React.useState(isArrowDisabled('next', selectedDate.getHours()));
	let [isArrowClicked, setArrowClicked] = React.useState(false);

	return (
		<Grid container justify="flex-end" className={styles.mobileDatePicker}>
			<MobileDateTimePicker
				disableCloseOnSelect
				showToolbar={false}
				renderInput={(props) => (
					<TextField
						{...props}
						variant="standard"
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
				value={new Date(selectedDate)}
				onChange={(date) => {
					if (date.getHours() != selectedDate.getHours()) {
						setPrevArrow(isArrowDisabled('prev', date.getHours()));
						setNextArrow(isArrowDisabled('next', date.getHours()));
					}
					setSelectedDate(date);
					isArrowClicked && setArrowClicked(false) && refresh();
				}}
				onClose={() => {
					setSelectedDate(selectedDate);
					refresh();
				}}
				maxDate={new Date(dateMinMax.maxDate)}
				minDate={new Date(dateMinMax.minDate)}
				minutesStep={0}
				hideTabs
			/>

			<Button
				classes={{ root: styles.prevBtn }}
				component="a"
				className={styles.prevBtnIdt}
				variant="outlined"
				size="small"
				disabled={transactionLogLoading ? transactionLogLoading : prevArrow}
				onClick={() => {
					setArrowClicked(true);
					navigateTime(selectedDate, setSelectedDate, setPrevArrow, setNextArrow, refresh, 'sub');
				}}
			>
				<NavigateBefore />
			</Button>
			<Button
				classes={{ root: styles.nextBtn }}
				component="a"
				className={styles.nextBtnIdt}
				variant="outlined"
				size="small"
				disabled={transactionLogLoading ? transactionLogLoading : nextArrow}
				onClick={() => {
					setArrowClicked(true);
					navigateTime(selectedDate, setSelectedDate, setPrevArrow, setNextArrow, refresh, 'add');
				}}
			>
				<NavigateNext />
			</Button>
		</Grid>
	);
}

export { DesktopDatePicker, MobileDatePicker };
