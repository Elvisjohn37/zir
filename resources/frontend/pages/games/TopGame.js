import React from 'react';
import styles from './TopGame.module';
import { FormattedMessage } from 'react-intl';
import { TopGames as TopGamesIcon } from 'frontend/components/Icons';
import withSuspense from 'frontend/utils/withSuspense';
import { GameThumbnailNoTitleLoader } from 'frontend/components/GameThumbnail';
import MobileQuery from 'frontend/components/MobileQuery';
import classnames from 'classnames';

let DesktopCarousel = withSuspense(
	React.lazy(function () {
		return import('./topgame/DesktopCarousel');
	}),
	<GameThumbnailNoTitleLoader count={3} />
);

let MobileCarousel = withSuspense(
	React.lazy(function () {
		return import('./topgame/MobileCarousel');
	}),
	<GameThumbnailNoTitleLoader count={3} />
);

export default function TopGameWithState(props) {
	return <MobileQuery>{(matches) => <TopGame matches={matches} {...props} />}</MobileQuery>;
}

function TopGame({ games, matches }) {
	let filteredGames = games.list
		.filter((game) => {
			return game.isTop;
		})
		.sort((gameCurrent, gameNext) => {
			return gameCurrent.rank - gameNext.rank;
		});

	return filteredGames.length > 0 ? (
		<div className={classnames([styles.container, matches ? styles.mobile : styles.desktop])}>
			{matches && (
				<div className={styles.mobileBg}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 340.19" preserveAspectRatio="none">
						<g>
							<g>
								<path
									className={styles.svgCls1}
									d="M720,340.19V0q-18.87.83-39.43,2.32C445.07,19.47,292.23,196.24,272.79,213,231.36,248.85,147.68,317.39,0,338.61v1.58Z"
								/>
							</g>
						</g>
					</svg>
				</div>
			)}
			<div className={styles.title}>
				<TopGamesIcon className={styles.icon} />
				<FormattedMessage id={'topTitle'} />
			</div>
			{matches ? (
				<MobileCarousel filteredGames={filteredGames} />
			) : (
				<DesktopCarousel filteredGames={filteredGames} />
			)}
		</div>
	) : null;
}
