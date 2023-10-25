let fs = require('fs');
let path = require('path');
let chalk = require('chalk');

const ENV_PATH = path.resolve(__dirname, '../.env');

if (fs.existsSync(ENV_PATH)) {
	require('dotenv-expand')(
		require('dotenv').config({
			path: ENV_PATH,
		})
	);
} else {
	const ENV_NOT_FOUND = chalk.red('Unable to find .env file!');
	console.warn(ENV_NOT_FOUND);
}
