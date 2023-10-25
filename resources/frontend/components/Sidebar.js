import React from 'react';
import Grid from '@mui/material/Grid';
import styles from './Sidebar.module';
import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import { Description, Update, Dvr } from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ErrorBoundary from './ErrorBoundary';

const SIDEBAR_GROUP = {
	archivedReport: [
		{
			id: 'statement',
			to: '/account/archived-report/statement',
			icon: <Description />,
		},
		{
			id: 'runningbet',
			to: '/account/archived-report/runningbet',
			icon: <Update />,
		},
		{
			id: 'transactionlog',
			to: '/account/archived-report/transactionlog',
			icon: <Dvr />,
		},
	],
};

export function DesktopSidebar({ children, sidebarArray, disabled }) {
	let pathname = useLocation().pathname;

	return disabled ? (
		children
	) : (
		<LangDataProvider category="submenu">
			<div className={styles.root}>
				<Grid container spacing={1}>
					<Grid item xs={3}>
						<List variant="permanent" classes={{ root: styles.desktopSidebar }}>
							{sidebarArray.map((item, index) => (
								<ListItemButton
									component={NavLink}
									key={index}
									dense={true}
									selected={pathname.startsWith(item.to)}
									to={item.to}
									classes={{ selected: styles.selected }}
									className={styles.sidebarItem}
								>
									{item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
									<ListItemText primary={<FormattedMessage id={item.id} />} />
								</ListItemButton>
							))}
						</List>
					</Grid>
					<Grid item xs={9}>
						<div className={styles.desktopContent}>{children}</div>
					</Grid>
				</Grid>
			</div>
		</LangDataProvider>
	);
}

export function MobileSidebar({ children, sidebarArray }) {
	let pathname = useLocation().pathname;
	let [anchorEl, setAnchorEl] = React.useState(null);

	let handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	let handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<LangDataProvider category="submenu">
			<div className={styles.root}>
				<div className={styles.mobileSidebar}>
					<Button
						variant="contained"
						color="primary"
						disableElevation
						onClick={handleClick}
						className={styles.mobileMenuButton}
						component="a"
					>
						<MoreVertIcon className={styles.mobileMenuButtonIcon} />
					</Button>
					<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
						{sidebarArray.map((item, index) => (
							<MenuItem component={NavLink} to={item.to} key={index} selected={pathname.startsWith(item.to)}>
								{item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
								<ListItemText primary={<FormattedMessage id={item.id} />} />
							</MenuItem>
						))}
					</Menu>
				</div>
				<div className={styles.mobileContent}>{children}</div>
			</div>
		</LangDataProvider>
	);
}

export default function Sidebar({ sidebar, sidebarGroup, children, disabled }) {
	let sidebarArray = Array.isArray(sidebar) ? sidebar : SIDEBAR_GROUP[sidebarGroup];

	return disabled ? (
		<div className={styles.disabledSidebarWrapper}>
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	) : (
		<MediaQuery maxDeviceWidth={styles.main_mobile}>
			{(matches) =>
				matches ? (
					<MobileSidebar sidebarArray={sidebarArray}>
						<ErrorBoundary>{children}</ErrorBoundary>
					</MobileSidebar>
				) : (
					<DesktopSidebar sidebarArray={sidebarArray}>
						<ErrorBoundary>{children}</ErrorBoundary>
					</DesktopSidebar>
				)
			}
		</MediaQuery>
	);
}
