let gameRulesState;

export function setGameRulesState(state) {
	Object.assign(gameRulesState, state);
}

export function resetGameRulesState() {
	gameRulesState = {
		config: {
			liveDealerGameLink: 'http://info.sbobet.com/article/AA-00363/41/',
		},
		gameRulesList: [
			{
				gameName: 'Dice Wars (Mobile)',
				productName: 'Games',
				gameTypeName: 'Table Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
			{
				gameName: 'Djap Go (Mobile)',
				productName: 'Games',
				gameTypeName: 'Table Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 1,
			},
			{
				gameName: 'Sedie (Mobile)',
				productName: 'Games',
				gameTypeName: 'Table Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
			{
				gameName: 'Three Stars Blessing (Mobile)',
				productName: 'Games',
				gameTypeName: 'Table Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 1,
			},
			{
				gameName: "Whack d' Mole (Mobile)",
				productName: 'Games',
				gameTypeName: 'Table Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
			{
				gameName: 'Three Card Poker (Mobile)',
				productName: 'Multiplayer',
				gameTypeName: 'Card Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
			{
				gameName: 'Dragon Tiger (Mobile)',
				productName: 'Games',
				gameTypeName: 'Card Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
			{
				gameName: '3 Faces Baccarat (Mobile)',
				productName: 'Multiplayer',
				gameTypeName: 'Card Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 1,
			},
			{
				gameName: 'Mystic Cards (Mobile)',
				productName: 'Games',
				gameTypeName: 'Card Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
			{
				gameName: 'Yin Yang Treasure (Mobile)',
				productName: 'Games',
				gameTypeName: 'Table Games',
				url: 'https://docs.google.com/document/d/e/2PACX-1vRV0Y-UzPEwdj_2ebm7a_Laiq-B7C4PbIMCjNYYdFPsZOWSc-cofIdL_T49p13_sAVHlAJJmh1slDxM/pub?embedded=true',
				isNew: 0,
			},
		],
		isError: false,
		isLoading: false,
	};
}

resetGameRulesState();

export function getGameRulesState() {
	return gameRulesState;
}
