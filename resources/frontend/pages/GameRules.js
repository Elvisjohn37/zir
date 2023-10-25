import React from 'react';
import Link from '@mui/material/Link';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import styles from './GameRules.module';
import { GameRulesConsumer } from 'frontend/contexts/GameRules';
import GameRulesLoader from 'frontend/components/GameRulesLoader';
import lodash from 'lodash';
import { extractProductGameType } from './gamerules/helper';
import GameRulesErrorMessage from 'frontend/components/GameRulesErrorMessage';

export default function GameRules() {
	return (
		<div className={styles.gameRules}>
			<GameRulesConsumer>
				{({ gameRulesState }) =>
					gameRulesState.isLoading ? (
						<GameRulesLoader />
					) : gameRulesState.isError ? (
						<GameRulesErrorMessage />
					) : (
						<LangDataProvider category="gamerules" className="testGamingRules">
							<div className={styles.gamingRules}>
								<h3>
									<FormattedMessage id="applicability.title" />
								</h3>
								<div className={styles.content}>
									<FormattedMessage id="applicability.description1" />
									<Link href="/" className="testHomePage">
										<FormattedMessage id="applicability.description2" />
									</Link>
									<FormattedMessage id="applicability.description3" />
								</div>
								<h3>
									<FormattedMessage id="generalRules" />
								</h3>
								<ol>
									<h3>
										<li>
											<FormattedMessage id="liability.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="liability.description" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="playForFun.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="playForFun.description" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="personalUse.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="personalUse.description" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="malfunctions.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="malfunctions.description" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="smartPlayer.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="smartPlayer.description" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="complaintsRng.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="complaintsRng.description1" />
										<Link href="mailto:support@sbobet.com">
											<FormattedMessage id="complaintsRng.description2" />
										</Link>
										<FormattedMessage id="complaintsRng.description3" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="complaintsLg.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="complaintsLg.description1" />
										<br />
										<br />
										<FormattedMessage id="complaintsLg.description2" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="maxWin.title" />
										</li>
									</h3>
									<div className={styles.content}>
										<FormattedMessage id="maxWin.description" />
									</div>
									<h3>
										<li>
											<FormattedMessage id="liveCasinoGames.title" />
										</li>
									</h3>

									<div className={styles.content}>
										<FormattedMessage id="liveCasinoGames.description1" />
										<br />
										<br />
										<FormattedMessage id="liveCasinoGames.description2" />
										<br />
										<br />

										<ol>
											<li>
												<Link
													href={gameRulesState.config.liveDealerGameLink + '#BACCARAT'}
													target="_blank"
													className={styles.liveCasinoLink}
												>
													<FormattedMessage id="casinoGames.live_dealer_baccarat" />
												</Link>
											</li>
											<li>
												<Link
													href={gameRulesState.config.liveDealerGameLink + '#ROULETTE'}
													target="_blank"
													className={styles.liveCasinoLink}
												>
													<FormattedMessage id="casinoGames.live_dealer_roulette" />
												</Link>
											</li>
											<li>
												<Link
													href={gameRulesState.config.liveDealerGameLink + '#SICBO'}
													target="_blank"
													className={styles.liveCasinoLink}
												>
													<FormattedMessage id="casinoGames.live_dealer_sicbo" />
												</Link>
											</li>
											<li>
												<Link
													href={gameRulesState.config.liveDealerGameLink + '#BLACKJACK'}
													target="_blank"
													className={styles.liveCasinoLink}
												>
													<FormattedMessage id="casinoGames.live_dealer_blackjack" />
												</Link>
											</li>
											{extractProductGameType(gameRulesState.gameRulesList).map((item, index) => (
												<li key={index} className={styles.gameRulesProduct}>
													<FormattedMessage
														id={`casinoGames.${lodash.camelCase(item.productName)}`}
														defaultMessage={item.productName.toUpperCase()}
													/>
													<ol>
														{item.gameTypes.map((gameTypeItem, gameTypeIndex) => (
															<li key={`gameType${gameTypeIndex}`} className={styles.gameRulesGameType}>
																<Link
																	component={NavLink}
																	to={`/gamerules/${lodash.kebabCase(item.productName)}/${lodash.kebabCase(
																		gameTypeItem
																	)}`}
																>
																	<FormattedMessage
																		id={`casinoGames.${lodash.camelCase(gameTypeItem)}`}
																		defaultMessage={gameTypeItem}
																	/>
																</Link>
															</li>
														))}
													</ol>
												</li>
											))}
										</ol>
									</div>
								</ol>
							</div>
						</LangDataProvider>
					)
				}
			</GameRulesConsumer>
		</div>
	);
}
