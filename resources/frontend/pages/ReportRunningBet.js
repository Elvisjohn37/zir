import React, { useEffect } from 'react';
import styles from './ReportRunningBet.module';
import { LangDataProvider } from 'frontend/components/Language';
import Sidebar from 'frontend/components/Sidebar';
import { FormattedMessage } from 'react-intl';
import TableIndicator from 'frontend/components/TableIndicator';
import { getRunningBets } from 'frontend/ajax/backend';
import MoneyFormat from 'frontend/components/MoneyFormat';
import Skeleton from 'frontend/components/Skeleton';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import MediaQuery from 'react-responsive';
import { MobileTableRefresh, DesktopTableRefresh } from 'frontend/components/TableRefresh';
import { DateTime } from 'frontend/components/ReportCommonFormatter';
import { GameDetails, GameResult, StakeTurnover } from 'frontend/components/ReportBetFormatter';
import classnames from 'classnames';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import Spinner from 'frontend/components/Spinner';

export default function ReportRunningBet() {
	let [runningBets, setRunningBets] = React.useState({
		content: [],
		totalRunningBets: 0,
		totalRow: [],
		rowsPerPage: 0,
	});
	let [totalRunningBetsError, setTotalRunningBetsError] = React.useState(false);
	let [activePage, setActivePage] = React.useState(0);

	let [isFetching, setIsFetching] = React.useState(true);

	useEffect(() => {
		if (isFetching) {
			setIsFetching(true);
			getRunningBets({
				page: activePage + 1,
				success: (response) => {
					setIsFetching(false);

					setRunningBets(response.data.data);
				},
				error: () => {
					setTotalRunningBetsError(true);
					setIsFetching(false);
				},
			});
		}
	}, [isFetching]);

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LangDataProvider category="reports" fallback={<Spinner />}>
					<Sidebar sidebarGroup="archivedReport" disabled={layoutState.config.isMobileSite}>
						<div className={styles.tableSection}>
							<MediaQuery maxDeviceWidth={styles.main_mobile}>
								{(matches) =>
									matches ? (
										<MobileTableRefresh
											onClick={() => setIsFetching(true)}
											isDisabled={isFetching}
											display={<FormattedMessage id="runningBets" />}
											hasBackButton={false}
										/>
									) : (
										<DesktopTableRefresh
											onClick={() => setIsFetching(true)}
											isDisabled={isFetching}
											id="runningBetRefresh"
											values={{ product: <FormattedMessage id="runningBets" /> }}
											hasBackButton={false}
										/>
									)
								}
							</MediaQuery>
							<div className={classnames(styles.totalRunningBets)}>
								<FormattedMessage
									id="totalRunningBets"
									values={{
										amount: isFetching ? (
											<Skeleton height={10} width={30} className={styles.loader} />
										) : (
											<MoneyFormat value={runningBets.totalRunningBets} />
										),
									}}
								/>
							</div>
							<div>
								<TableIndicator
									id="testTableInit"
									isLoading={isFetching}
									isEmpty={runningBets.content.length == 0}
									isError={totalRunningBetsError}
									pagination={{
										count: runningBets.totalRow,
										page: activePage,
										rowsPerPage: runningBets.rowsPerPage,
										onPageChange: (event, page) => {
											setActivePage(page);
											setIsFetching(true);
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
														<FormattedMessage id="date" /> &amp;{' '}
														<FormattedMessage id="time" />
													</TableCell>
													<TableCell align="center" className={styles.colGameDetails}>
														<FormattedMessage id="gameDetails" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderTurnover}>
														<FormattedMessage id="stakeTurnover" />
													</TableCell>
													<TableCell align="center" className={styles.colstatus}>
														<FormattedMessage id="status" />
													</TableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{runningBets.content.map((row, index) => (
													<TableRow key={runningBets.rowsPerPage * activePage + index + 1}>
														<TableCell align="left" scope="row">
															{runningBets.rowsPerPage * activePage + index + 1}
														</TableCell>
														<TableCell align="center">
															<DateTime dateTime={row.dateTime} newLine={true} />
														</TableCell>
														<TableCell align="center">
															<GameDetails row={row} />
														</TableCell>
														<TableCell align="right">
															<StakeTurnover row={row} />
														</TableCell>
														<TableCell align="center">
															<GameResult row={row} />
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</TableIndicator>
							</div>
						</div>
					</Sidebar>
				</LangDataProvider>
			)}
		</LayoutConsumer>
	);
}
