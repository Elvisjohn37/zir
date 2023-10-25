import React from 'react';
import { getGame } from 'frontend/ajax/backend';
import { gameParams } from 'frontend/utils/gameHelper';
import { useLocation } from 'react-router-dom';

export default function useGame({ setGameTypes, setGames, isLoading, setIsLoading, setGameError, isMobileDevice }) {
	let params = gameParams(useLocation);

	React.useEffect(() => {
		if (isLoading) {
			getGame({
				isErrorHandled: true,
				isMobileDevice,
				page: params.page,
				success: (response) => {
					setGameTypes(response.data.data.gameTypeNames);
					setGames(response.data.data);
					setIsLoading(false);
				},
				error: ({ data }) => {
					setGameError(data);
					setIsLoading(false);
				},
			});
		}
	}, []);
}
