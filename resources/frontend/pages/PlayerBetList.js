import React from 'react';
import styles from './PlayerBetList.module';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import { DateTime, GrossRake } from 'frontend/components/ReportCommonFormatter';
import { GameDetails, GameResult, StakeTurnover, MembersWLCommision } from 'frontend/components/ReportBetFormatter';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Sidebar from 'frontend/components/Sidebar';
import TableIndicator from 'frontend/components/TableIndicator';
import { MobileTableRefresh, DesktopTableRefresh } from 'frontend/components/TableRefresh';
import MediaQuery from 'react-responsive';
import usePlayerBetList from './playerbetlist/usePlayerBetList';
import { LayoutConsumer } from 'frontend/contexts/Layout';
import Spinner from 'frontend/components/Spinner';

export default function PlayerBetList(props) {
	let params = props.match.params;

	let [activePage, setActivePage] = React.useState(0);

	let [isPromoBettingListError, setIsPromoBettingListError] = React.useState(false);
	let [isFetching, setIsFetching] = React.useState(true);

	let playerPromoBetList = usePlayerBetList({
		isFetching,
		setIsFetching,
		date: params.date,
		page: activePage + 1,
		productID: params.productID,
		setIsPromoBettingListError,
		type: params.type,
	});

	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<LangDataProvider category="reports"  fallback={<Spinner/>}>
					<Sidebar sidebarGroup="archivedReport" disabled={layoutState.config.isMobileSite}>
						<div className={styles.tableSection}>
							<MediaQuery maxDeviceWidth={styles.main_mobile} className={styles.mediaQueryButton}>
								{(matches) =>
									matches ? (
										<MobileTableRefresh
											onClick={() => setIsFetching(true)}
											isDisabled={isFetching}
											display={playerPromoBetList.product}
										/>
									) : (
										<DesktopTableRefresh
											onClick={() => setIsFetching(true)}
											isDisabled={isFetching}
											id="betDetailRefresh"
											values={{ product: playerPromoBetList.product }}
										/>
									)
								}
							</MediaQuery>

							<div>
								<TableIndicator
									id="testTableInit"
									isLoading={isFetching}
									isEmpty={playerPromoBetList.content.length == 0}
									isError={isPromoBettingListError}
									pagination={{
										count: playerPromoBetList.totalRow,
										page: activePage,
										rowsPerPage: playerPromoBetList.rowsPerPage,
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
														{/*55 */}
														<FormattedMessage id="date" /> &amp; <FormattedMessage id="time" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderGameDetails}>
														{/*55 */}
														<FormattedMessage id="gameDetails" />
													</TableCell>
													<TableCell align="center" className={styles.colHeaderGameResult}>
														<FormattedMessage id="gameResult" />
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
												</TableRow>
											</TableHead>

											<TableBody>
												{playerPromoBetList.content.map((row) => {
													return (
														<TableRow key={row.rowNo} classes={{ root: styles.row }} className="testTableRow">
															<TableCell className="testTableCell" align="center" scope="row">
																{row.rowNo}
															</TableCell>
															<TableCell className="testTableCell" align="center">
																<DateTime className="testTableDateTime" dateTime={row.dateTime} newLine={true} />
															</TableCell>
															<TableCell className="testTableCell" align="center">
																<GameDetails className="testGameDetails" row={row} />
															</TableCell>
															<TableCell className="testTableCell" align="center">
																<GameResult className="testGameResult" row={row} />
															</TableCell>
															<TableCell className="testTableCell" align="right">
																<StakeTurnover className="testStakeTurnover" row={row} />
															</TableCell>
															<TableCell className="testTableCell" align="right">
																<GrossRake className="testGrossRake" row={row} />
															</TableCell>
															<TableCell className="testTableCell" align="right">
																<MembersWLCommision className="testMembersWLCommision" row={row} />
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
			)}
		</LayoutConsumer>
	);
}
