import React from 'react';
import { FormControl as MuiFormControl, FormLabel, InputLabel, FormHelperText } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function FormControl({
	children,
	formLabel,
	inputLabel,
	error,
	formLabelProps,
	inputLabelProps,
	formHelperTextProps,
	margin,
	...otherProps
}) {
	return (
		<MuiFormControl error={error && error.message && true} margin={margin || 'dense'} {...otherProps}>
			{formLabel && (
				<FormLabel {...formLabelProps}>
					<FormattedMessage id={formLabel} />
				</FormLabel>
			)}
			{inputLabel && (
				<InputLabel {...inputLabelProps}>
					<FormattedMessage id={inputLabel} />
				</InputLabel>
			)}
			{children}
			{error && error.message && (
				<FormHelperText {...formHelperTextProps}>
					<FormattedMessage id={error.message} />
				</FormHelperText>
			)}
		</MuiFormControl>
	);
}

FormControl.defaultProps = {
	formLabelProps: {},
	inputLabelProps: {},
	formHelperTextProps: {}
};
