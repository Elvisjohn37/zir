import React from 'react';
import Image from 'frontend/components/Image';
import { IntlProvider } from 'react-intl';
import LangContextProvider, { LangConsumer } from 'frontend/contexts/Language';
import styles from './Language.module';
import Box from '@mui/material/Box';
import { FormattedMessage } from 'react-intl';
import LangDataProvider from './language/LangDataProvider';
import { putCookie } from 'frontend/utils/helper';
import Skeleton from 'frontend/components/Skeleton';
import classnames from 'classnames';
import { Menu, MenuItem, ListItemText, Button, ListItemIcon } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export function LangSelector() {
	return (
		<LangDataProvider
			category="langselector"
			fallback={<Skeleton height={30} width={30} count={4} className={styles.loader} />}
		>
			<LangConsumer>
				{({ langState, langDispatch }) => (
					<>
						{langState.available.map((lang, index) => (
							<a
								key={index}
								className={classnames([
									styles.imageWrapper,
									langState.disabled.includes(lang) && styles.disabled,
								])}
								onClick={() => {
									onLangChange(lang, langState, langDispatch);
								}}
							>
								<Box borderRadius="50%" boxShadow={3} key={index} className={styles.imageBox}>
									<Image
										scaleRatio={{ width: 1, height: 1 }}
										src={require(`frontend/assets/images/langselector/${lang}.png`)}
										className={styles.image}
									/>
								</Box>
								<div className={styles.text}>
									<FormattedMessage id={`${lang}`} />
								</div>
							</a>
						))}
					</>
				)}
			</LangConsumer>
		</LangDataProvider>
	);
}

export function LangDropdown({ className }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<LangDataProvider
				category="langselector"
				fallback={<Skeleton className={styles.dropdownLoader} height={20} width={100} count={1} />}
			>
				<LangConsumer>
					{({ langState, langDispatch }) => (
						<div className={classnames([styles.langDropdown, className])}>
							<Button
								onClick={handleClick}
								className={styles.langDropdownButton}
								endIcon={<KeyboardArrowDownIcon />}
								classes={{ label: styles.buttonLabel }}
							>
								<ListItemIcon className={styles.dropdownIcon}>
									<Image
										scaleRatio={{ width: 1, height: 1 }}
										src={require(`frontend/assets/images/langselector/${langState.active}.png`)}
										className={styles.imageDropDown}
									/>
								</ListItemIcon>
								<ListItemText
									classes={{ root: styles.langText }}
									primary={<FormattedMessage id={`${langState.active}short`} />}
								/>
							</Button>
							<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
								{langState.available.map((lang, index) => (
									<MenuItem
										key={index}
										value={lang}
										onClick={() => {
											onLangChange(lang, langState, langDispatch);
										}}
										disabled={langState.disabled.includes(lang)}
									>
										<ListItemIcon className={styles.dropdownIcon}>
											<Image
												scaleRatio={{ width: 1, height: 1 }}
												src={require(`frontend/assets/images/langselector/${lang}.png`)}
												className={styles.imageDropDown}
											/>
										</ListItemIcon>
										<ListItemText primary={<FormattedMessage id={`${lang}short`} />} />
									</MenuItem>
								))}
							</Menu>
						</div>
					)}
				</LangConsumer>
			</LangDataProvider>
		</>
	);
}

function onLangChange(lang, langState, langDispatch) {
	if (!langState.disabled.includes(lang)) {
		langDispatch({
			type: 'SET_LANGUAGE',
			lang: lang,
		});
		putCookie(process.env.LANG_KEY, lang);
		document.documentElement.lang = lang;
	}
}

export function LangProvider({ config, children }) {
	return (
		<IntlProvider locale={config.default}>
			<LangContextProvider config={config}>{children}</LangContextProvider>
		</IntlProvider>
	);
}

export { LangDataProvider };
