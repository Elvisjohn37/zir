import { lowerCase } from 'lodash';
import { toCamelcase, isMobileDevice } from 'frontend/utils/helper';

export function gameOnClick(gameID, target = '_self') {
	let url = '/play?gameID=' + gameID;

	if (isMobileDevice()) {
		url += '&mobile=1';
	}

	window.open(url, target);
}

export function gameParams(useLocation) {
	let pathname = useLocation().pathname;
	let paths = pathname.split('/');
	let params = { page: null, gameType: null };

	if (paths.length > 2) {
		params.page = paths[1];
		params.gameType = paths[2];
	} else {
		params.page = paths.length > 1 && paths[1] != '' ? paths[1] : 'games';
		params.gameType = null;
	}

	return params;
}

export function gameTypeUrl(page, type) {
	return '/' + page + '/' + type.replace(/\s+/g, '-').toLowerCase();
}

export function gameTypeTitle(type) {
	return toCamelcase(type) + 'Title';
}

export function gameFilter(games, type) {
	let recentGamesCacheRaw;
	let recentGamesCache;
	let recentGameLength;
	let recentGames;

	switch (lowerCase(type)) {
		case 'recent':
			recentGames = [];

			recentGamesCacheRaw = games.recentGames;
			if (recentGamesCacheRaw != '') {
				recentGamesCache = recentGamesCacheRaw.split(';');
				recentGameLength = recentGamesCache.length;

				for (var i = 0; i < recentGameLength; i++) {
					let recentGameID = recentGamesCache[i];

					if (recentGameID != '') {
						let recentGameDetails = games.list.find((game) => {
							return game.gameID == recentGameID;
						});

						if (recentGameDetails) {
							recentGames.push(recentGameDetails);
						}
					}
				}
			}
			return recentGames;
		case 'top':
			return games.list
				.filter((game) => {
					return game.isTop;
				})
				.sort((gameCurrent, gameNext) => {
					return gameCurrent.rank - gameNext.rank;
				});
		default:
			return games.list
				.filter((game) => {
					if (lowerCase(game.gameTypeName) == lowerCase(type)) {
						return true;
					} else {
						return false;
					}
				})
				.sort((gameTypeRankCurrent, gameTypeRankNext) => {
					return gameTypeRankCurrent.gameTypeRank - gameTypeRankNext.gameTypeRank;
				});
	}
}
