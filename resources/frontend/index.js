__webpack_public_path__ = window.assetURL + __webpack_public_path__;

import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './index/AppRoute';
import 'normalize.css';
import './index.scss';
import '@fontsource/roboto';
import ThemeProvider from './index/ThemeProvider';

export function Index() {
	console.log(
		'%cPlayer Site v' + process.env.APP_VERSION,
		['background: #223a7a', 'color: #c9d6f8', 'padding: 4px'].join(';')
	);

	return (
		<ThemeProvider>
			<AppRoute />
		</ThemeProvider>
	);
}

ReactDOM.render(<Index />, document.getElementById('root') || document.createElement('div'));
