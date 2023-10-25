import React from 'react';
import { GameRulesConsumer } from 'frontend/contexts/GameRules';
import { LangDataProvider } from 'frontend/components/Language';
import GameRulesContentRaw from './gamerulescontent/GameRulesContentRaw';

export default function GameRulesContent() {
	return (
		<LangDataProvider category="gamerulescontent">
			<GameRulesConsumer>
				{({ gameRulesState }) => <GameRulesContentRaw gameRulesState={gameRulesState} />}
			</GameRulesConsumer>
		</LangDataProvider>
	);
}
