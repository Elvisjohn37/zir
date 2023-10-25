import React from 'react';
import GameRulesProvider from 'frontend/contexts/GameRules';

export default function GameRulesProviderWrap({ children }) {
	return <GameRulesProvider>{children}</GameRulesProvider>;
}
