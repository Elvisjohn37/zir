import React, { useEffect } from 'react';
import styles from './ReportStatement.module';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import Sidebar from 'frontend/components/Sidebar';
import MediaQuery from 'react-responsive';
import TableIndicator from 'frontend/components/TableIndicator';
import { Date, GrossRake } from 'frontend/components/ReportCommonFormatter';
import {
	Product,
	Turnover,
	Commission,
	CashBalance,
	Credit,
	DateLink,
} from 'frontend/components/ReportStatementFormatter';
import { DesktopDateRange, MobileDateRange } from './reportstatement/DateRange';
import { getStatementReport } from './reportstatement/helper';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import Spinner from 'frontend/components/Spinner';

export default function ReportStatement() {
	let [statementData, setStatementData] = React.useState({
		content: [],
		footer: [],
	});
	let [statementDataLoading, setStatementDataLoading] = React.useState(true);
	let [statementDataError, setStatementDataError] = React.useState(false);

	let [dateRange, setDateRange] = React.useState({
		isLoading: true,
		range: [],
	});

	let [isMounted, setIsMounted] = React.useState(false);

	const [activeDate, setActiveDate] = React.useState(1);

	useEffect(() => {
		setIsMounted(true);
		getStatementReport(
			isMounted,
			setDateRange,
			activeDate,
			setStatementData,
			setStatementDataLoading,
			setStatementDataError
		);
	}, []);

	const handleChange = (event, activeDateRange) => {
		getStatementReport(
			isMounted,
			setDateRange,
			activeDateRange,
			setStatementData,
			setStatementDataLoading,
			setStatementDataError
		);
		setActiveDate(activeDateRange);
	};

	return (
		<MediaQuery maxDeviceWidth={styles.main_mobile}>
			{(matches) =>
				<LayoutConsumer>
					{({ layoutState }) => (
						<LangDataProvider category="reports" fallback={<Spinner/>}>
							<Sidebar sidebarGroup="archivedReport" disabled={layoutState.config.isMobileSite}>
								<div className={styles.tableSection}>
									<div className={styles.dates}>
										{matches ? (
											<MobileDateRange dateRange={dateRange} onChange={handleChange} activeDate={activeDate} />
										) : (
											<DesktopDateRange dateRange={dateRange} onChange={handleChange} activeDate={activeDate} />
										)}
									</div>

									<div className={styles.tableContent}>
										<TableIndicator
											isLoading={statementDataLoading}
											isEmpty={statementData.content.length == 0}
											isError={statementDataError}
										>
											<TableContainer>
												<Table>
													<TableHead>
														<TableRow classes={{ root: styles.row }}>
															<TableCell align="left" className={styles.colHeaderRowNum}>
																#
															</TableCell>
															<TableCell align="center" className={styles.colHeaderDate}>
																<FormattedMessage id="date" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderType}>
																<FormattedMessage id="type" />
															</TableCell>
															<TableCell align="center" className={styles.colHeaderProduct}>
																<FormattedMessage id="product" />
															</TableCell>
															<TableCell align="right" className={styles.colHeaderTurnover}>
																<FormattedMessage id="turnover" />
															</TableCell>
															<TableCell align="right" className={styles.colHeaderGrossRake}>
																<FormattedMessage id="grossRake" />
															</TableCell>
															<TableCell align="right" className={styles.colHeaderCommission}>
																<FormattedMessage id="commission" />
															</TableCell>
															<TableCell align="right" className={styles.colHeaderCashBalance}>
																<FormattedMessage id="cashBalance" />
															</TableCell>
															<TableCell align="right" className={styles.colHeaderCredit}>
																<FormattedMessage id="credit" />
															</TableCell>
														</TableRow>
													</TableHead>

													<TableBody>
														{statementData.content.map((row) => (
															<TableRow key={row.rowNo}>
																<TableCell align="left" scope="row">
																	{row.rowNo}
																</TableCell>
																<TableCell align="center">
																	<DateLink row={row}>
																		<Date date={row.date} />
																	</DateLink>
																</TableCell>
																<TableCell align="center">{row.type}</TableCell>
																<TableCell align="center">
																	<Product row={row} />
																</TableCell>
																<TableCell align="right">
																	<Turnover row={row} />
																</TableCell>
																<TableCell align="right">
																	<GrossRake row={row} />
																</TableCell>
																<TableCell align="right">
																	<Commission row={row} />
																</TableCell>
																<TableCell align="right">
																	<CashBalance row={row} />
																</TableCell>
																<TableCell align="right">
																	<Credit row={row} />
																</TableCell>
															</TableRow>
														))}
													</TableBody>
													<TableFooter>
														<TableRow>
															<TableCell colSpan={3} />
															<TableCell align="right">
																<FormattedMessage id="total" />
															</TableCell>
															<TableCell align="right">
																<Turnover row={statementData.footer} />
															</TableCell>
															<TableCell align="right">
																<GrossRake row={statementData.footer} />
															</TableCell>
															<TableCell align="right">
																<Commission row={statementData.footer} />
															</TableCell>
															<TableCell align="right">
																<CashBalance row={statementData.footer} />
															</TableCell>
															<TableCell align="right">
																<Credit row={statementData.footer} />
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
					)}
				</LayoutConsumer>
			}
		</MediaQuery>
	);
}
