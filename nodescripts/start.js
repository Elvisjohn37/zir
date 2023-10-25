'use strict';

process.on('unhandledRejection', (err) => {
	throw err;
});

let webpack = require('webpack');
let webpackDevServer = require('webpack-dev-server');
let webpackConfig = require('../webpack.config')();
require('./expandEnv');

new webpackDevServer(webpack(webpackConfig), {
	host: process.env.APP_URL,
	port: process.env.WPDS_PORT,
	https: process.env.WPDS_HTTPS === 'true',
	hot: true,
	publicPath: webpackConfig.output.publicPath,
	contentBase: '/public',
	watchContentBase: true,
	historyApiFallback: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
	allowedHosts: [process.env.APP_URL],
}).listen(process.env.WPDS_PORT, '0.0.0.0', function (error) {
	if (error) {
		throw new Error(error);
	}
});
