import React from 'react';
import styles from './PlayerTransferList.module';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import { Date, DateTime } from 'frontend/components/ReportCommonFormatter';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Sidebar from 'frontend/components/Sidebar';
import TableIndicator from 'frontend/components/TableIndicator';
import { Description, Amount, OutstandingBalance, PlayableBalance } from 'frontend/components/ReportTransferFormatter';
import { UserConsumer } from 'frontend/contexts/User';
import { MobileTableRefresh, DesktopTableRefresh } from 'frontend/components/TableRefresh';
import MediaQuery from 'react-responsive';
import usePlayerTransferList from './playertransferlist/usePlayerTransferList';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import Spinner from 'frontend/components/Spinner';

export default function PlayerTransferList(props) {
	let params = props.match.params;

	let [isFetching, setIsFetching] = React.useState(true);
	let [activePage, setActivePage] = React.useState(0);

	let [transferListError, setTransferListError] = React.useState(false);
	let playerTransferList = usePlayerTransferList({
		isFetching,
		setIsFetching,
		date: params.date,
		page: activePage + 1,
		setTransferListError,
	});

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LangDataProvider category="reports" fallback={<Spinner/>}>
					<Sidebar sidebarGroup="archivedReport" disabled={layoutState.config.isMobileSite}>
						<div className={styles.tableSection}>
							<MediaQuery maxDeviceWidth={styles.main_mobile} className={styles.mediaQueryButton}>
								{(matches) =>
									matches ? (
										<MobileTableRefresh
											onClick={() => setIsFetching(true)}
											isDisabled={isFetching}
											display={<Date date={params.date} />}
										/>
									) : (
										<DesktopTableRefresh
											onClick={() => setIsFetching(true)}
											isDisabled={isFetching}
											id="creditDetailRefresh"
											values={{ date: <Date date={params.date} /> }}
										/>
									)
								}
							</MediaQuery>

							<div>
								<TableIndicator
									id="testTableInit"
									isLoading={isFetching}
									isEmpty={playerTransferList.content.length == 0}
									isError={transferListError}
									pagination={{
										count: playerTransferList.totalRow,
										page: activePage,
										rowsPerPage: playerTransferList.rowsPerPage,
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
														<FormattedMessage id="date" /> &amp; <FormattedMessage id="time" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderDescription}>
														<FormattedMessage id="details" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderAmount}>
														<FormattedMessage id="amount" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderOutstandingBalance}>
														<FormattedMessage id="outstandingBalance" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderPlayableBalance}>
														<FormattedMessage id="playableBalance" />
													</TableCell>
												</TableRow>
											</TableHead>
											<UserConsumer>
												{({ userState }) => {
													return (
														<TableBody id="testTableBody">
															{playerTransferList.content.map((row) => (
																<TableRow key={row.rowNo} classes={{ root: styles.row }} className="testTableRow">
																	<TableCell className="testTableCell" align="center" scope="row">
																		{row.rowNo}
																	</TableCell>
																	<TableCell className="testTableCell" align="center">
																		<DateTime dateTime={row.dateTime} newLine={true} className="testTableDateTime" />
																	</TableCell>
																	<TableCell className="testTableCell" align="center">
																		<Description
																			className="testDescription"
																			row={row}
																			agentUsername={userState.user.parent}
																		/>
																	</TableCell>
																	<TableCell className="testTableCell" align="right">
																		<Amount row={row} className="testAmount" />
																	</TableCell>
																	<TableCell className="testTableCell" align="right">
																		<OutstandingBalance row={row} className="testOutstandingBalance" />
																	</TableCell>
																	<TableCell className="testTableCell" align="right">
																		<PlayableBalance row={row} className="testPlayableBalance" />
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													);
												}}
											</UserConsumer>
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
