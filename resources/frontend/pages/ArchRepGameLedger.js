import React from 'react';
import Sidebar from 'frontend/components/Sidebar';
import { LangDataProvider } from 'frontend/components/Language';
import MediaQuery from 'react-responsive';
import styles from './ArchRepGameLedger.module';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Grid } from '@mui/material';
import TableIndicator from 'frontend/components/TableIndicator';
import { DateTime } from 'frontend/components/ReportCommonFormatter';
import { FormattedMessage } from 'react-intl';
import Spinner from 'frontend/components/Spinner';
import { reportDateMinMax } from 'frontend/utils/helper';
import MoneyFormat from 'frontend/components/MoneyFormat';
import useGameLedger from './archrepgameledger/useGameLedger';
import { MobileDatePicker, DesktopDatePicker } from 'frontend/pages/archrepgameledger/DatePicker';
import { LayoutConsumer } from 'frontend/contexts/Layout';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function ArchRepGameLedger() {
	var today = new Date();
	today.setMinutes(0, 0, 0);

	let [selectedDate, setSelectedDate] = React.useState(today);

	let [isFetching, setIsFetching] = React.useState(true);

	let [gameLedgerError, setGameLedgerError] = React.useState(false);
	let [activePage, setActivePage] = React.useState(0);

	let [isMounted, setIsMounted] = React.useState(false);
	let [dateRange, setDateRange] = React.useState({
		isLoading: true,
		range: [],
	});

	let gameLedger = useGameLedger({
		isFetching,
		setIsFetching,
		page: activePage + 1,
		date: selectedDate,
		setIsMounted,
		setGameLedgerError,
		setDateRange,
		isMounted,
	});

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<LangDataProvider category="reports">
						<Sidebar sidebarGroup="archivedReport" disabled={layoutState.config.isMobileSite}>
							<div className={styles.tableSection}>
								{dateRange.isLoading ? (
									<Spinner className={styles.datePickerLoader} />
								) : (
									<MediaQuery maxDeviceWidth={styles.main_mobile} className={styles.mediaQueryButton}>
										{(matches) =>
											matches ? (
												<MobileDatePicker
													id="testMobileDatePicker"
													selectedDate={selectedDate}
													setSelectedDate={setSelectedDate}
													setRefresh={() => setIsFetching(true)}
													dateMinMax={reportDateMinMax(dateRange.range)}
												/>
											) : (
												<DesktopDatePicker
													id="testDesktopDatePicker"
													selectedDate={selectedDate}
													setSelectedDate={setSelectedDate}
													setRefresh={() => setIsFetching(true)}
													dateMinMax={reportDateMinMax(dateRange.range)}
												/>
											)
										}
									</MediaQuery>
								)}
								<Grid container justifyContent="center" classes={{ root: styles.logNotice }}>
									<span>
										<FormattedMessage id="logNotice" />
									</span>
								</Grid>
								<Grid container justifyContent="center" classes={{ root: styles.timeZoneNotice }}>
									<span>
										<FormattedMessage id="timeZoneNotice" />
									</span>
								</Grid>
								<div className={styles.date}>
									<TableIndicator
										id="testTableInit"
										isLoading={isFetching}
										isEmpty={gameLedger.content.length == 0}
										isError={gameLedgerError}
										pagination={{
											rowsPerPage: gameLedger.rowsPerPage,
											count: gameLedger.totalRow,
											page: activePage,
											onPageChange: (event, page) => {
												setActivePage(page);
												setIsFetching(true);
											},
										}}
									>
										<TableContainer>
											<Table classes={{ root: styles.table }} size="small" aria-label="a dense table">
												<TableHead>
													<TableRow classes={{ root: styles.row }}>
														<TableCell align="center" className={styles.colHeaderDateTime}>
															Date
														</TableCell>
														<TableCell align="center" className={styles.colHeaderGameDetails}>
															Game
														</TableCell>
														<TableCell align="center" className={styles.colHeaderVersion}>
															Version
														</TableCell>
														<TableCell align="center" className={styles.colHeaderEvent}>
															Event
														</TableCell>
														<TableCell align="center" className={styles.colHeaderDebit}>
															Debit
														</TableCell>
														<TableCell align="center" className={styles.colHeaderCredit}>
															Credit
														</TableCell>
														<TableCell align="center" className={styles.colHeaderPlaybleBalance}>
															Playable Balance
														</TableCell>
													</TableRow>
												</TableHead>

												<TableBody id="testTableBody">
													{gameLedger.content.map((row, index) => {
														return (
															<TableRow key={row + index} classes={{ root: styles.row }} className="testTableRow">
																<TableCell className="testTableCell" align="center">
																	<DateTime className="testTableDateTime" dateTime={row.eventTime} />
																</TableCell>
																<TableCell className="testTableCell" align="center">
																	<div className="testGameName">{row.game}</div>
																	<div className="testBetDetailLink">
																		<a target="_blank" rel="noreferrer" href={row.weblink}>
																			Bet Detail
																		</a>
																	</div>
																	<div className="testGameDetail">{row.detail}</div>
																</TableCell>
																<TableCell className="testTableCell" align="center">
																	{row.ver}
																</TableCell>
																<TableCell className="testTableCell" align="center">
																	{row.event}
																</TableCell>
																<TableCell className="testTableCell" align="center">
																	<MoneyFormat className="testDebit" value={row.debit} />
																</TableCell>
																<TableCell className="testTableCell" align="center">
																	<MoneyFormat className="testCredit" value={row.credit} />
																</TableCell>
																<TableCell className="testTableCell" align="center">
																	<MoneyFormat className="testBalance" value={row.balance} />
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</TableContainer>
									</TableIndicator>
								</div>
							</div>
						</Sidebar>
					</LangDataProvider>
				</LocalizationProvider>
			)}
		</LayoutConsumer>
	);
}
