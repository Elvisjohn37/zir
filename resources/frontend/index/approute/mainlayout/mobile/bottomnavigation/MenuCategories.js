import React from 'react';
import Grid from '@mui/material/Grid';
import { Loader } from 'frontend/components/IconButtonLabeled';
import { LangDataProvider } from 'frontend/components/Language';
import { NavLink } from 'react-router-dom';
import { gameTypeUrl, gameTypeTitle } from 'frontend/utils/gameHelper';
import { FormattedMessage } from 'react-intl';
import IconButtonLabeled from 'frontend/components/IconButtonLabeled';
import { toCamelcase } from 'frontend/utils/helper';
import { CardGames, SlotGames, TableGames, Multiplayer } from 'frontend/components/Icons';

const GAMETYPE_ICONS = {
	superSlot: SlotGames,
	tableGames: TableGames,
	cardGames: CardGames,
	multiplayer: Multiplayer,
};

export default function MenuCategories({ gameCategories, product }) {
	return (
		<LangDataProvider category="gamelobby">
			<Grid container spacing={1}>
				{gameCategories === false ? (
					<>
						<Grid item xs={4} key="load1">
							<Loader />
						</Grid>
						<Grid item xs={4} key="load2">
							<Loader />
						</Grid>
						<Grid item xs={4} key="load3"></Grid>
						<Grid item xs={4} key="load4">
							<Loader />
						</Grid>
						<Grid item xs={4} key="load5">
							<Loader />
						</Grid>
						<Grid item xs={4} key="load6">
							<Loader />
						</Grid>
					</>
				) : (
					<>
						{gameCategories.gameTypes.map((type) => (
							<Grid item xs={4} key={type}>
								<IconButtonLabeled
									icon={GAMETYPE_ICONS[toCamelcase(type)]}
									component={NavLink}
									to={gameTypeUrl(product, type)}
								>
									<FormattedMessage id={gameTypeTitle(type)} />
								</IconButtonLabeled>
							</Grid>
						))}
					</>
				)}
			</Grid>
		</LangDataProvider>
	);
}
