import React, { useState, useEffect } from 'react';
import styles from './BottomNavigation.module';
import MuiBottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import Drawer from '@mui/material/Drawer';
import { NavLink, useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import MenuCategories from './bottomnavigation/MenuCategories';
import MenuArchivedReport from './bottomnavigation/MenuArchivedReport';
import { getGameCategories } from 'frontend/ajax/backend';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import classnames from 'classnames';
import { defaultScrollTopVisibility } from 'frontend/utils/helper';
import { AllGamesOutline, Categories, Report } from 'frontend/components/Icons';

export default function BottomNavigation() {
	let [bottomNav, setBottomNav] = useState(null);
	let [openBottomDrawer, setOpenBottomDrawer] = useState(false);
	let [gameCategories, setGameCategories] = useState(false);
	let [isFetchGameCategories, setIsFetchGameCategories] = useState(false);
	let [isMounted, setIsMouted] = useState(false);
	let pathname = useLocation().pathname;
	let [isScrollUpVisible, setIsScrollUpVisible] = useState(false);

	function close() {
		setBottomNav(null);
		setOpenBottomDrawer(false);
	}

	function scrollUpVisible() {
		let scrolled = document.body.scrollTop;
		setIsScrollUpVisible(scrolled > defaultScrollTopVisibility());
	}

	function scrollToTop() {
		document.body.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}

	useEffect(() => {
		window.addEventListener('scroll', scrollUpVisible, true);
		return () => window.removeEventListener('scroll', scrollUpVisible);
	});

	useEffect(() => {
		if (isMounted) {
			close();
		} else {
			setIsMouted(true);
		}
	}, [pathname]);

	useEffect(() => {
		if (isFetchGameCategories) {
			getGameCategories('games', (response) => {
				setGameCategories(response.data.data);
			});
		}
	}, [isFetchGameCategories]);

	return (
		<>
			<LangDataProvider category="menu">
				<LangDataProvider category="submenu">
					<div className={classnames([styles.goToTop, isScrollUpVisible && styles.isVisible])}>
						<IconButton color="primary" className={styles.goToTopButton} onClick={scrollToTop}>
							<KeyboardArrowUpIcon />
						</IconButton>
					</div>
					<Drawer
						anchor="bottom"
						open={openBottomDrawer}
						onClose={close}
						classes={{ paper: styles.bottomNavMenuContainer, root: styles.bottomNavMenuRoot }}
					>
						<div className={styles.bottomNavMenu}>
							<div className={styles.closeButtonContainer}>
								<IconButton color="primary" onClick={close}>
									<KeyboardArrowDownIcon />
								</IconButton>
							</div>
							<div className={styles.bottomNavMenuItems}>
								{bottomNav == 1 ? (
									<MenuCategories gameCategories={gameCategories} product="games" />
								) : (
									bottomNav == 2 && <MenuArchivedReport />
								)}
							</div>
						</div>
					</Drawer>
					<Paper className={styles.bottomNavContainer} elevation={3}>
						<MuiBottomNavigation
							value={bottomNav}
							onChange={(event, newValue) => {
								if (newValue != 0) {
									setBottomNav(newValue);
									setOpenBottomDrawer(true);
									if (!isFetchGameCategories && newValue == 1) {
										setIsFetchGameCategories(true);
									}
								} else {
									close();
								}
							}}
							className={styles.bottomNav}
							showLabels
						>
							<BottomNavigationAction
								component={NavLink}
								to="/"
								classes={{ selected: styles.bottomNavSelected, label: styles.bottomNavLabel }}
								className={styles.bottomNavItem}
								label={<FormattedMessage id="allGames" />}
								icon={<AllGamesOutline />}
							/>
							<BottomNavigationAction
								classes={{ selected: styles.bottomNavSelected, label: styles.bottomNavLabel }}
								className={styles.bottomNavItem}
								label={<FormattedMessage id="categories" />}
								icon={<Categories />}
							/>
							<BottomNavigationAction
								classes={{ selected: styles.bottomNavSelected, label: styles.bottomNavLabel }}
								className={styles.bottomNavItem}
								label={<FormattedMessage id="archivedReport" />}
								icon={<Report />}
							/>
						</MuiBottomNavigation>
					</Paper>
				</LangDataProvider>
			</LangDataProvider>
		</>
	);
}
