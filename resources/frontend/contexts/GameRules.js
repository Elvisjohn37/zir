import React, { useEffect, useState } from 'react';
import gameRulesReducer from './gamerules/gameRulesReducer';
import { LangConsumer } from 'frontend/contexts/Language';
import { getGameGuide } from 'frontend/ajax/backend';

let GameRulesContext = React.createContext();

export function GameRulesProviderRaw({ children, lang }) {
	let [gameRulesState, gameRulesDispatch] = React.useReducer(gameRulesReducer, {
		isLoading: true,
		gameRulesList: [],
		isError: false,
		config: {},
	});
	let [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true);
			getGameGuide({
				isErrorHandled: true,
				lang: lang,
				success: (response) => {
					gameRulesDispatch({
						type: 'SET_LIST',
						data: response.data.data,
					});
				},
				error: () => {
					gameRulesDispatch({
						type: 'SET_ISERROR',
						isError: true,
					});
				},
			});
		}
	}, [isMounted]);

	return (
		<GameRulesContext.Provider
			value={{
				gameRulesState,
				gameRulesDispatch,
			}}
		>
			{children}
		</GameRulesContext.Provider>
	);
}

export default function GameRulesProvider({ children }) {
	return (
		<LangConsumer>
			{({ langState }) => <GameRulesProviderRaw lang={langState.active}>{children}</GameRulesProviderRaw>}
		</LangConsumer>
	);
}

export let GameRulesConsumer = GameRulesContext.Consumer;
