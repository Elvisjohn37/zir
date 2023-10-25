import React, { useEffect } from 'react';
import styles from './ReportTransactionLog.module';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import Sidebar from 'frontend/components/Sidebar';
import TableIndicator from 'frontend/components/TableIndicator';
import { getTransactionLog } from 'frontend/ajax/backend';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Grid';
import MediaQuery from 'react-responsive';
import { UserConsumer } from 'frontend/contexts/User';
import { DateTime, GrossRake } from 'frontend/components/ReportCommonFormatter';
import { TypeProduct, Amount, CashBalanceGame } from 'frontend/components/ReportTransactionLogFormatter';
import { GameDetails, GameResult, StakeTurnover, MembersWLCommision } from 'frontend/components/ReportBetFormatter';
import Spinner from 'frontend/components/Spinner';
import { Description as TransferDescription } from 'frontend/components/ReportTransferFormatter';
import { Description as CreditDescription } from 'frontend/components/ReportCreditFormatter';
import { toDateTimeString, reportDateMinMax } from 'frontend/utils/helper';
import { DesktopDatePicker, MobileDatePicker } from './reporttransactionlog/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LayoutConsumer } from 'frontend/contexts/Layout';

export default function ReportTransactionLog() {
	var today = new Date();
	today.setMinutes(0, 0, 0);

	let [selectedDate, setSelectedDate] = React.useState(today);

	let [transactionLog, setTransactionLog] = React.useState({
		content: [],
		totalRow: [],
		rowsPerPage: 0,
	});

	let [transactionLogError, setTransactionLogError] = React.useState(false);
	let [transactionLogLoading, setTransactionLogLoading] = React.useState(true);
	let [refresh, setRefresh] = React.useState(true);
	let [activePage, setActivePage] = React.useState(0);

	let [isMounted, setIsMounted] = React.useState(false);
	let [dateRange, setDateRange] = React.useState({
		isLoading: true,
		range: [],
	});

	useEffect(() => {
		if (refresh) {
			setTransactionLogLoading(true);
			getTransactionLog({
				date: toDateTimeString(selectedDate),
				page: activePage + 1,
				showConfig: !isMounted,
				success: (response) => {
					setTransactionLogLoading(false);
					setTransactionLogError(false);
					setTransactionLog(response.data.data);
					if (!isMounted) {
						setDateRange({
							isLoading: false,
							range: response.data.data.dateRange,
						});
					}
				},
				error: () => {
					setTransactionLogError(true);
					setTransactionLogLoading(false);
				},
			});

			setRefresh(false);
		}

		setIsMounted(true);
	}, [refresh]);

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<LangDataProvider category="reports" fallback={<Spinner/>}>
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
													refresh={() => setRefresh(true)}
													dateMinMax={reportDateMinMax(dateRange.range)}
												/>
											) : (
												<DesktopDatePicker
													selectedDate={selectedDate}
													setSelectedDate={setSelectedDate}
													refresh={() => setRefresh(true)}
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
								<div className={styles.date}>
									<TableIndicator
										isLoading={transactionLogLoading}
										isEmpty={transactionLog.content.length == 0}
										isError={transactionLogError}
										pagination={{
											rowsPerPage: transactionLog.rowsPerPage,
											count: transactionLog.totalRow,
											page: activePage,
											onPageChange: (event, page) => {
												setActivePage(page);
												setRefresh(true);
											},
										}}
									>
										<TableContainer>
											<Table classes={{ root: styles.table }}>
												<TableHead>
													<TableRow classes={{ root: styles.row }}>
														<TableCell align="center" className={styles.colHeaderRowNum}>
															#
														</TableCell>
														<TableCell align="center" className={styles.colHeaderDateTime}>
															<FormattedMessage id="time" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderType}>
															<FormattedMessage id="product" />
															<br />
															<FormattedMessage id="type" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderGameDetails}>
															<FormattedMessage id="details" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderGameResult}>
															<FormattedMessage id="result" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderStakeTurnover}>
															<FormattedMessage id="amount" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderStakeTurnover}>
															<FormattedMessage id="stakeTurnover" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderGrossRake}>
															<FormattedMessage id="grossRake" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderMemWLCommission}>
															<FormattedMessage id="memWLCommission" />
														</TableCell>
														<TableCell align="center" className={styles.colHeaderCashBalanceGame}>
															<FormattedMessage id="cashBalanceGame" />
														</TableCell>
													</TableRow>
												</TableHead>
												<UserConsumer>
													{({ userState }) => (
														<TableBody>
															{transactionLog.content.map((row) => {
																switch ('promotion') {
																	case 'betting':
																		return <React.Fragment key={row.rowNo}></React.Fragment>;
																	case 'promotion':
																		return (
																			<TableRow
																				className={styles.testTableRow}
																				key={row.rowNo}
																				classes={{ root: styles.row }}
																			>
																				<TableCell scope="row">{row.rowNo}</TableCell>
																				<TableCell align="center">
																					<DateTime dateTime={row.dateTime} newLine={true} />
																				</TableCell>
																				<TableCell align="center">
																					<TypeProduct row={row} />
																				</TableCell>
																				<TableCell align="center">
																					<GameDetails row={row} />
																				</TableCell>
																				<TableCell align="center">
																					<GameResult row={row} />
																				</TableCell>
																				<TableCell align="center">
																					<Amount row={row} />
																				</TableCell>
																				<TableCell align="center">
																					<StakeTurnover row={row} />
																				</TableCell>
																				<TableCell align="right">
																					<GrossRake row={row} />
																				</TableCell>
																				<TableCell align="right">
																					<MembersWLCommision row={row} />
																				</TableCell>
																				<TableCell align="right">
																					<CashBalanceGame row={row} />
																				</TableCell>
																			</TableRow>
																		);

																	case 'credit':
																		return (
																			<TableRow
																				className={styles.testTableRow}
																				key={row.rowNo}
																				classes={{ root: styles.row }}
																			>
																				<TableCell scope="row">{row.rowNo}</TableCell>
																				<TableCell align="center">
																					<DateTime dateTime={row.dateTime} newLine={true} />
																				</TableCell>
																				<TableCell align="center">
																					<TypeProduct row={row} />
																				</TableCell>
																				<TableCell align="center">
																					<CreditDescription agentUsername={userState.user.parent} />
																				</TableCell>
																				<TableCell />
																				<TableCell align="center">
																					<Amount row={row} />
																				</TableCell>
																				<TableCell />
																				<TableCell />
																				<TableCell />
																				<TableCell align="right">
																					<CashBalanceGame row={row} />
																				</TableCell>
																			</TableRow>
																		);
																	case 'transfer':
																		return (
																			<TableRow
																				className={styles.testTableRow}
																				key={row.rowNo}
																				classes={{ root: styles.row }}
																			>
																				<TableCell scope="row">{row.rowNo}</TableCell>
																				<TableCell align="center">
																					<DateTime dateTime={row.dateTime} newLine={true} />
																				</TableCell>
																				<TableCell align="center">
																					<TypeProduct row={row} />
																				</TableCell>
																				<TableCell align="center">
																					<TransferDescription row={row} agentUsername={userState.user.parent} />
																				</TableCell>
																				<TableCell />
																				<TableCell align="center">
																					<Amount row={row} />
																				</TableCell>
																				<TableCell />
																				<TableCell />
																				<TableCell />
																				<TableCell align="right">
																					<CashBalanceGame row={row} />
																				</TableCell>
																			</TableRow>
																		);
																}
															})}
														</TableBody>
													)}
												</UserConsumer>
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
