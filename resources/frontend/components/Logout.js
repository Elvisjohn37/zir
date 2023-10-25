import React from 'react';
import { Button } from '@mui/material';
import styles from './Logout.module';
import { ExitToApp } from '@mui/icons-material';
import classnames from 'classnames';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import { UserConsumer } from 'frontend/contexts/User';
import { ListItemText } from '@mui/material';
import { logout } from 'frontend/ajax/backend';
import Skeleton from 'frontend/components/Skeleton';

export default function Logout({ disableRipple, sideBar, buttonType, onClick }) {
	function logoutOnClick() {
		logout(() => {
			onClick && onClick();
			window.location = '/';
		});
	}
	return (
		<LangDataProvider category="loginlogoutform" fallback={<Skeleton count={1} width={70} />}>
			<UserConsumer>
				{() =>
					buttonType == 'listItem' ? (
						<>
							<ListItemText onClick={logoutOnClick} primary={<FormattedMessage id="logout" />} />
							<ExitToApp />
						</>
					) : (
						<Button
							disableRipple={disableRipple}
							component="a"
							classes={{ root: classnames([styles.logoutBtn, sideBar && styles.sideBarLogout]) }}
							onClick={logoutOnClick}
							variant="contained"
						>
							<ExitToApp /> <FormattedMessage id="logout" />
						</Button>
					)
				}
			</UserConsumer>
		</LangDataProvider>
	);
}
