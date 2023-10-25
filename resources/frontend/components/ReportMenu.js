import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './ReportMenu.module';
import { Description, Update, Dvr } from '@mui/icons-material';

export default function ReportMenu() {
	let pathname = `/${useLocation().pathname.split('/').pop()}`;
	const [selectedItem, setSelectedItem] = React.useState(pathname);

	return (
		<LangDataProvider category="submenu">
			<List variant="permanent">
				<ListItem
					selected={selectedItem === '/statement'}
					classes={{ root: styles.item }}
					component={NavLink}
					to="/account/reports/statement"
					onClick={() => setSelectedItem('/statement')}
				>
					<ListItemText classes={{ root: styles.textItem }} primary={<FormattedMessage id="statement" />} />
					<ListItemIcon classes={{ root: styles.iconItem }}>
						<Description />
					</ListItemIcon>
				</ListItem>
				<ListItem
					selected={selectedItem === '/runningbet'}
					classes={{ root: styles.item }}
					component={NavLink}
					to="/account/reports/runningbet"
					onClick={() => setSelectedItem('/runningbet')}
				>
					<ListItemText classes={{ root: styles.textItem }} primary={<FormattedMessage id="runningbet" />} />
					<ListItemIcon classes={{ root: styles.iconItem }}>
						<Update />
					</ListItemIcon>
				</ListItem>
				<ListItem
					selected={selectedItem === '/transactionlog'}
					classes={{ root: styles.item }}
					component={NavLink}
					to="/account/reports/transactionlog"
					onClick={() => setSelectedItem('/transactionlog')}
				>
					<ListItemText
						classes={{ root: styles.textItem }}
						primary={<FormattedMessage id="transactionlog" />}
					/>
					<ListItemIcon classes={{ root: styles.iconItem }}>
						<Dvr />
					</ListItemIcon>
				</ListItem>
			</List>
		</LangDataProvider>
	);
}
