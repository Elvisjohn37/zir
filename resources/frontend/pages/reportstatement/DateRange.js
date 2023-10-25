import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from 'frontend/components/Skeleton';
import Button from '@mui/material/Button';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { DateRange } from 'frontend/components/ReportCommonFormatter';
import styles from './DateRange.module';

export function DesktopDateRange({ dateRange, onChange, activeDate }) {
	return (
		<>
			{dateRange.isLoading ? (
				<Skeleton count={3} height={20} className={styles.desktopDateRangeLoader} />
			) : (
				<Tabs
					value={activeDate}
					onChange={onChange}
					textColor="secondary"
					indicatorColor="primary"
					variant="fullWidth"
					aria-label="full width tabs example"
					classes={{ indicator: styles.dateTabIndicator }}
				>
					{dateRange.range.map((row) => (
						<Tab
							classes={{ root: styles.dateButton }}
							component="a"
							value={row.number}
							key={row.number}
							// label={row.dateRange}
							label={<DateRange row={row} />}
							color="secondary"
							disableRipple
						/>
					))}
				</Tabs>
			)}
		</>
	);
}

export function MobileDateRange({ dateRange, activeDate, onChange }) {
	let [anchorEl, setAnchorEl] = React.useState(null);

	let handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	let handleClose = () => {
		setAnchorEl(null);
	};

	let activeDateRangeRow = dateRange.range.find((item) => item.number === activeDate);

	return (
		<>
			{dateRange.isLoading ? (
				<Skeleton count={1} height={32} className={styles.mobileDateRangeLoader} />
			) : (
				<>
					<Button
						variant="contained"
						color="primary"
						disableElevation
						className={styles.mobileDateRangeButton}
						onClick={handleClick}
						endIcon={<DateRangeIcon />}
						classes={{ endIcon: styles.mobileDateRangeIcon }}
					>
						<DateRange row={activeDateRangeRow} />
					</Button>
					<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
						{dateRange.range.map((row, index) => (
							<MenuItem
								key={index}
								selected={activeDate == row.number}
								onClick={(e) => {
									onChange(e, row.number);
									handleClose();
								}}
								component="a"
							>
								<ListItemText primary={<DateRange row={row} />} />
							</MenuItem>
						))}
					</Menu>
				</>
			)}
		</>
	);
}
