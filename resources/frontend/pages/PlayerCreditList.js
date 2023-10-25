import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import { Date, DateTime } from 'frontend/components/ReportCommonFormatter';
import Sidebar from 'frontend/components/Sidebar';
import MediaQuery from 'react-responsive';
import { MobileTableRefresh, DesktopTableRefresh } from 'frontend/components/TableRefresh';
import styles from './PlayerCreditList.module';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableIndicator from 'frontend/components/TableIndicator';
import {
	Description,
	CreditLimit,
	PlayerTotalBalance,
	PlayableBalance,
} from 'frontend/components/ReportCreditFormatter';
import { UserConsumer } from 'frontend/contexts/User';
import usePlayerCreditList from './playercreditlist/usePlayerCreditList';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import Spinner from 'frontend/components/Spinner';

export default function PlayerCreditList(props) {
	let params = props.match.params;

	let [isFetching, setIsFetching] = React.useState(true);
	let [activePage, setActivePage] = React.useState(0);
	let [creditListError, setCreditListError] = React.useState(false);
	let playerCreditList = usePlayerCreditList({
		isFetching,
		setIsFetching,
		date: params.date,
		page: activePage + 1,
		setCreditListError,
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
									isEmpty={playerCreditList.content.length == 0}
									isError={creditListError}
									pagination={{
										count: playerCreditList.totalRow,
										page: activePage,
										rowsPerPage: playerCreditList.rowsPerPage,
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
													<TableCell align="center" className={styles.colCreditLimit}>
														<FormattedMessage id="creditLimit" />
													</TableCell>
													<TableCell align="right" className={styles.colHeaderPlayerTotalBalance}>
														<FormattedMessage id="playerTotalBalance" />
													</TableCell>
													<TableCell align="right" className={styles.colHeaderPlayableBalance}>
														<FormattedMessage id="playableBalance" />
													</TableCell>
												</TableRow>
											</TableHead>
											<UserConsumer>
												{({ userState }) => (
													<TableBody>
														{playerCreditList.content.map((row, index) => {
															let rowNo = playerCreditList.rowsPerPage * activePage + index + 1;
															return (
																<TableRow key={rowNo} classes={{ root: styles.row }} className="testTableRow">
																	<TableCell className="testTableCell" align="center" scope="row">
																		{rowNo}
																	</TableCell>
																	<TableCell className="testTableCell" align="center">
																		<DateTime className="testTableDateTime" dateTime={row.dateTime} newLine={true} />
																	</TableCell>
																	<TableCell className="testTableCell" align="center">
																		<Description className="testDescription" agentUsername={userState.user.parent} />
																	</TableCell>
																	<TableCell className="testTableCell" align="right">
																		<CreditLimit className="testCreditLimit" row={row} />
																	</TableCell>
																	<TableCell className="testTableCell" align="right">
																		<PlayerTotalBalance className="testPlayerTotalBalance" row={row} />
																	</TableCell>
																	<TableCell className="testTableCell" align="right">
																		<PlayableBalance className="testPlayableBalance" row={row} />
																	</TableCell>
																</TableRow>
															);
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
			)}
		</LayoutConsumer>
	);
}
