import React from 'react';
import languageReducer from './language/languageReducer';
import { getCookie } from 'frontend/utils/helper';

let LanguageContext = React.createContext();

export default function LangProvider({ children, config }) {
	let availableProp = config.available || '';
	let disabledProp = config.disabled || '';
	let [langState, langDispatch] = React.useReducer(languageReducer, {
		active: config.force || getCookie(config.key) || config.default,
		available: availableProp.split(','),
		disabled: disabledProp.split(','),
	});

	return (
		<LanguageContext.Provider
			value={{
				langState,
				langDispatch,
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
}

export let LangConsumer = LanguageContext.Consumer;
