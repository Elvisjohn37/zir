import * as backend from 'frontend/ajax/__mocks__/backend';

let gameData;
let isBlockedLoading;

export default function useGames({ setGameTypes, setGames, isLoading, setIsLoading, setGameError, isMobileDevice }) {
	if (!isBlockedLoading && isLoading) {
		if (gameData.data.result) {
			setGameTypes(gameData.data.data.gameTypeNames);
			setGames(gameData.data.data);
		} else {
			setGameError(gameData);
		}

		setIsLoading(false);
	}
}

export function getUseGames(newUsedGamesData) {
	return gameData;
}

export function setUseGames(newUsedGamesData) {
	gameData = newUsedGamesData;
}

export function resetUseGames() {
	gameData = backend.getGameData();
}

resetUseGames();

export function blockUseGames() {
	isBlockedLoading = true;
}

export function unblockUseGames() {
	isBlockedLoading = false;
}
