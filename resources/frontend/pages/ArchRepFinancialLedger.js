import React from 'react';
import styles from './ArchRepFinancialLedger.module';
import { LangDataProvider } from 'frontend/components/Language';
import Sidebar from 'frontend/components/Sidebar';
import MediaQuery from 'react-responsive';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormattedMessage } from 'react-intl';
import { getArcFinLedReport } from 'frontend/ajax/backend';
import { getDateTime, reportDateMinMax } from 'frontend/utils/helper';
import TableIndicator from 'frontend/components/TableIndicator';
import { TableContainer, Table, TableHead, TableRow, TableFooter, TableBody, TableCell, Grid } from '@mui/material';
import MoneyFormat from 'frontend/components/MoneyFormat';
import Spinner from 'frontend/components/Spinner';
import { MobileDatePicker, DesktopDatePicker } from 'frontend/pages/archrepfinancialledger/DatePicker';
import { LayoutConsumer } from 'frontend/contexts/Layout';

function ArchRepFinancialLedger() {
	var today = new Date();
	today.setMinutes(0, 0, 0);

	let [selectedDate, setSelectedDate] = React.useState(today);
	let [totalTransaction, setTotalTransaction] = React.useState({
		debit: 0,
		credit: 0,
		currentBalance: 0,
	});

	let [dateRange, setDateRange] = React.useState({
		isLoading: true,
		range: [],
	});
	let [financialLedgerLoading, setFinancialLedgeLoading] = React.useState(true);
	let [isErrorFetch, setIsErrorFetch] = React.useState(false);
	let [financialLedger, setFinancialLedger] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
		gmt: [],
	});

	let [activePage, setActivePage] = React.useState(0);

	let [isMounted, setIsMounted] = React.useState(false);
	let [refresh, setRefresh] = React.useState(true);

	React.useEffect(() => {
		if (refresh) {
			setFinancialLedgeLoading(true);
			getArcFinLedReport({
				data: {
					date: getDateTime(selectedDate, true),
					page: activePage + 1,
					showConfig: !isMounted,
				},
				success: (response) => {
					let data = response.data.data;
					let debit = 0;
					let credit = 0;
					data.content.forEach((item) => {
						debit = parseFloat(item.Debit) + parseFloat(debit);
						credit = parseFloat(item.Credit) + parseFloat(credit);
						setTotalTransaction({
							debit: debit,
							credit: credit,
							currentBalance: item.AccountBalance,
						});
					});
					setFinancialLedger({
						content: data.content,
						totalRow: data.totalRow,
						rowsPerPage: data.rowsPerPage,
						gmt: data.gmt,
					});
					setFinancialLedgeLoading(false);
					setIsErrorFetch(false);
					if (!isMounted) {
						setDateRange({
							isLoading: false,
							range: response.data.data.dateRange,
						});
					}
				},
				error: () => {
					setFinancialLedgeLoading(false);
					setIsErrorFetch(true);
				},
			});

			setRefresh(false);
		}
		setIsMounted(true);
	}, [refresh]);

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<div className={styles.financialLedger}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<LangDataProvider category="reports">
							<Sidebar sidebarGroup="archivedReport" disabled={layoutState.config.isMobileSite}>
								<div className={styles.tableSection}>
									{dateRange.isLoading ? (
										<Spinner className={styles.datePickerLoader} />
									) : (
										<MediaQuery maxDeviceWidth={styles.main_mobile}>
											{(matches) =>
												matches ? (
													<MobileDatePicker
														selectedDate={selectedDate}
														setSelectedDate={setSelectedDate}
														dateMinMax={reportDateMinMax(dateRange.range)}
														setRefresh={() => setRefresh(true)}
													/>
												) : (
													<DesktopDatePicker
														selectedDate={selectedDate}
														setSelectedDate={setSelectedDate}
														dateMinMax={reportDateMinMax(dateRange.range)}
														setRefresh={() => setRefresh(true)}
														isDataLoading={financialLedgerLoading}
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
									<div className={styles.reports}>
										<TableIndicator
											isLoading={financialLedgerLoading}
											isEmpty={financialLedger.content.length == 0}
											isError={isErrorFetch}
											pagination={{
												rowsPerPage: financialLedger.rowsPerPage,
												count: financialLedger.totalRow,
												page: activePage,
												onPageChange: (event, page) => {
													setActivePage(page);
													setRefresh(true);
												},
											}}
										>
											<TableContainer>
												<Table classes={{ root: styles.table }} size="small" aria-label="a dense table">
													<TableHead>
														<TableRow classes={{ root: styles.row }}>
															<TableCell align="center" className={styles.colHeaderDateTime}>
																<FormattedMessage id="date" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderGameDetails}>
																<FormattedMessage id="transacGame" />
															</TableCell>
															<TableCell align="center" className={styles.colHeadertransactionID}>
																<FormattedMessage id="transactionID" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderEvent}>
																<FormattedMessage id="event" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderDebit}>
																<FormattedMessage id="debit" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderCredit}>
																<FormattedMessage id="credit" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderCurrentBalance}>
																<FormattedMessage id="curBalance" />
															</TableCell>
														</TableRow>
													</TableHead>

													<TableBody>
														{financialLedger.content.map((row, index) => {
															return (
																<TableRow key={index} classes={{ root: styles.row }}>
																	<TableCell align="center">{getDateTime(row.EventTime)}</TableCell>
																	<TableCell align="center">{row.Game}</TableCell>
																	<TableCell align="center">
																		<div>{row.ClientId}</div>
																	</TableCell>
																	<TableCell align="center">
																		<div>{row.Event}</div>
																	</TableCell>
																	<TableCell align="center">
																		{row.Debit > 0 && <MoneyFormat value={row.Debit} />}
																	</TableCell>
																	<TableCell align="center">
																		{row.Credit > 0 && <MoneyFormat value={row.Credit} />}
																	</TableCell>
																	<TableCell align="center">
																		<MoneyFormat value={row.AccountBalance} />
																	</TableCell>
																</TableRow>
															);
														})}
													</TableBody>
													<TableFooter>
														<TableRow className={styles.totalTransaction}>
															<TableCell colSpan={4}>
																<FormattedMessage id="curBalance" />
															</TableCell>
															<TableCell align="center">
																<MoneyFormat value={totalTransaction.debit} />
															</TableCell>
															<TableCell align="center">
																<MoneyFormat value={totalTransaction.credit} />
															</TableCell>
															<TableCell align="center">
																<MoneyFormat value={totalTransaction.currentBalance} />
															</TableCell>
														</TableRow>
													</TableFooter>
												</Table>
											</TableContainer>
										</TableIndicator>
									</div>
								</div>
							</Sidebar>
						</LangDataProvider>
					</LocalizationProvider>
				</div>
			)}
		</LayoutConsumer>
	);
}

export default ArchRepFinancialLedger;
