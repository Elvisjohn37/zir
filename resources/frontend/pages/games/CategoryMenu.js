import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { AllGamesOutline, SlotGames, CardGames, TableGames, Multiplayer } from 'frontend/components/Icons';
import { toCamelcase } from 'frontend/utils/helper';
import { toLower } from 'lodash';
import { gameTypeUrl } from 'frontend/utils/gameHelper';
import styles from './CategoryMenu.module';

const GAMETYPE_ICONS = {
	superSlot: <SlotGames />,
	cardGames: <CardGames />,
	tableGames: <TableGames />,
	multiplayer: <Multiplayer />,
};

export default function CategoryMenu({ selectedGameType, gameTypes, params }) {
	return (
		<Tabs
			value={selectedGameType}
			textColor="primary"
			variant="scrollable"
			scrollButtons="auto"
			aria-label="scrollable auto tabs"
			className={styles.submenuTabs}
			classes={{ indicator: styles.subMenuIndicator }}
		>
			<Tab
				label={
					<span>
						<FormattedMessage id="allGames" />
					</span>
				}
				component={NavLink}
				to={'./'}
				value="all"
				className={styles.submenuTab}
				icon={<AllGamesOutline />}
				iconPosition="start"
				classes={{ selected: styles.selected }}
			/>
			{gameTypes.map((type, index) => (
				<Tab
					key={index}
					component={NavLink}
					label={<span>{type}</span>}
					to={gameTypeUrl(params.page, type)}
					value={toLower(type)}
					className={styles.submenuTab}
					icon={GAMETYPE_ICONS[toCamelcase(type)]}
					iconPosition="start"
					classes={{ selected: styles.selected }}
				/>
			))}
		</Tabs>
	);
}
