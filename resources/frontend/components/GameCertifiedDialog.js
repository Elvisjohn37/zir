import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { gameOnClick } from 'frontend/utils/gameHelper';
import { FormattedMessage } from 'react-intl';
import Button from '@mui/material/Button';

let GameCertifiedDialog = ({ gameID, isNotCertPopup }) => {
	return (
		<Dialog open={isNotCertPopup} maxWidth="xs">
			<DialogTitle>
				<FormattedMessage id={'notice'} />
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<FormattedMessage id="notCertified" />
				</DialogContentText>
				<DialogActions>
					<Button
						onClick={() => {
							gameOnClick(gameID);
						}}
						color="secondary"
						variant="contained"
					>
						<FormattedMessage id="ok" />
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default GameCertifiedDialog;
