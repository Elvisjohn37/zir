import React from 'react';
import Grid from '@mui/material/Grid';
import DescriptionIcon from '@mui/icons-material/Description';
import IconButtonLabeled from 'frontend/components/IconButtonLabeled';
import { FormattedMessage } from 'react-intl';
import UpdateIcon from '@mui/icons-material/Update';
import DvrIcon from '@mui/icons-material/Dvr';
import { NavLink } from 'react-router-dom';

export default function MenuArchivedReport() {
	return (
		<Grid container spacing={1}>
			<Grid item xs={4} key="statement">
				<IconButtonLabeled icon={DescriptionIcon} component={NavLink} to="/account/archived-report/statement">
					<FormattedMessage id="statement" />
				</IconButtonLabeled>
			</Grid>
			<Grid item xs={4} key="runningbet">
				<IconButtonLabeled icon={UpdateIcon} component={NavLink} to="/account/archived-report/runningbet">
					<FormattedMessage id="runningbet" />
				</IconButtonLabeled>
			</Grid>
			<Grid item xs={4} key="transactionlog">
				<IconButtonLabeled icon={DvrIcon} component={NavLink} to="/account/archived-report/transactionlog">
					<FormattedMessage id="transactionlog" />
				</IconButtonLabeled>
			</Grid>
		</Grid>
	);
}
