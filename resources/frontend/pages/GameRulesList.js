import React from 'react';
import { GameRulesConsumer } from 'frontend/contexts/GameRules';
import { LangDataProvider } from 'frontend/components/Language';
import GameRulesListRaw from './gameruleslist/GameRulesListRaw';

export default function GameRulesList() {
	return (
		<LangDataProvider category="gamerulescontent">
			<GameRulesConsumer>
				{({ gameRulesState }) => <GameRulesListRaw gameRulesState={gameRulesState} />}
			</GameRulesConsumer>
		</LangDataProvider>
	);
}
