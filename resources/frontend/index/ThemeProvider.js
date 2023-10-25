import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import styles from './ThemeProvider.module';

const THEME = createTheme({
	spacing: parseInt(styles.main_standardSpace),
	breakpoints: {
		// Define custom breakpoint values.
		// These will apply to Material-UI components that use responsive
		// breakpoints, such as `Grid` and `Hidden`. You can also use the
		// theme breakpoint functions `up`, `down`, and `between` to create
		// media queries for these breakpoints
		values: {
			xs: 0,
			sm: parseInt(styles.main_mobile),
			md: parseInt(styles.main_tablet),
			lg: parseInt(styles.main_desktop),
			xl: parseInt(styles.main_bigDesktop),
		},
	},
	typography: {
		htmlFontSize: 10,
	},
	palette: {
		secondary: {
			light: styles.colors_spLight,
			main: styles.colors_secondary,
			dark: styles.colors_sDark,
			contrastText: styles.colors_sText,
		},
		primary: {
			light: styles.colors_pLight,
			main: styles.colors_primary,
			dark: styles.colors_pDark,
			contrastText: styles.colors_pText,
		},
		background: {
			default: 'rgba(0,0,0,0)',
		},
		text: {
			primary: styles.colors_pText,
			secondary: styles.colors_sText,
		},
	},
	components: {
		MuiLink: { color: 'secondary' },
		MuiListItemButton: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						background: styles.colors_primary,
					},
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						background: styles.colors_primary,
					},
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					padding: styles.themeProvider_tabPadding,
					'&.Mui-selected': {
						color: styles.colors_secondary,
					},
				},
			},
		},
		MuiCalendarPicker: {
			styleOverrides: {
				root: {
					'.MuiTypography-root': {
						color: styles.colors_secondary,
					},
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					minHeight: '0px',
				},
				indicator: {
					height: '100%',
					backgroundColor: styles.themeProvider_tabIndicator,
				},
			},
		},
		MuiTable: {
			styleOverrides: {
				root: {
					tableLayout: 'fixed',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					backgroundColor: styles.colors_secondary,
					color: styles.colors_sText,
					fontWeight: '700',
					lineHeight: '1.5rem',
				},
				footer: {
					color: styles.colors_pText,
					fontWeight: '700',
				},
				root: {
					fontSize: styles.themeProvider_tableFontSize,
					lineHeight: styles.themeProvider_tableLineHeight,
				},
				sizeSmall: {
					padding: styles.themeProvider_tableSmallPadding,
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: styles.themeProvider_formLabelDefaultColor,
				},
			},
			color: 'secondary',
		},
		MuiBackdrop: {
			styleOverrides: {
				root: {
					backgroundColor: styles.themeProvider_dialogBg,
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					'.MuiSvgIcon-root': {
						fontSize: parseInt(styles.main_fontSize) * 2,
					},
				},
			},
		},
		MuiDialogContentText: {
			styleOverrides: {
				root: {
					color: styles.colors_pText,
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					fontWeight: 'bold',
				},
			},
		},
	},
});

export default function ThemeProvider({ children }) {
	return (
		<MuiThemeProvider theme={THEME}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	);
}
