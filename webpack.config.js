let path = require('path');
let reactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
let miniCssExtractPlugin = require('mini-css-extract-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let cssMinimizerPlugin = require('css-minimizer-webpack-plugin');
let terserWebpackPlugin = require('terser-webpack-plugin');
let autoprefixer = require('autoprefixer');
let webpack = require('webpack');
let { WebpackManifestPlugin } = require('webpack-manifest-plugin');
let manifestGenerator = require('./nodescripts/manifestGenerator');
let esLintPlugin = require('eslint-webpack-plugin');
require('./nodescripts/expandEnv');

module.exports = (env, arg) => {
	const IS_PROD = arg && arg.mode === 'production';
	const MODE = IS_PROD ? 'production' : 'development';
	const FILENAME = IS_PROD ? '[name].[contenthash]' : '[name]';
	const CSS_FILENAME = `css/${FILENAME}.css`;
	const PUBLIC_PATH = [
		`${process.env.ASSET_PATH}/`,
		process.env.ASSET_IS_VERSIONED === 'true' && `${process.env.APP_VERSION}/`,
	]
		.filter(Boolean)
		.join('');

	return {
		mode: MODE,
		bail: true,
		target: IS_PROD ? 'browserslist' : 'web', // remove this when webpack-dev-server 4 is released
		entry: [path.resolve(__dirname, 'resources/frontend/index.js')],
		output: {
			path: path.resolve(
				IS_PROD ? __dirname : '',
				[`public${process.env.ASSET_PATH}`, process.env.ASSET_IS_VERSIONED === 'true' && process.env.APP_VERSION]
					.filter(Boolean)
					.join('/')
			),
			filename: `js/${FILENAME}.bundle.js`,
			chunkFilename: `js/${FILENAME}.js`,
			publicPath: PUBLIC_PATH, // this will be overwritten on runtime
		},
		devtool: IS_PROD ? 'nosources-source-map' : 'cheap-module-source-map',
		resolve: {
			extensions: ['.js', '.jsx', '.scss', '.css'],
			alias: {
				frontend: path.resolve(__dirname, 'resources/frontend'),
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							plugins: [!IS_PROD && require.resolve('react-refresh/babel'), 'add-react-displayname'].filter(Boolean),
							presets: [
								[
									'@babel/preset-env',
									{
										modules: false,
										useBuiltIns: 'usage',
										corejs: 3,
									},
								],
								'@babel/preset-react',
							],
						},
					},
				},
				{
					test: /\.module\.s(a|c)ss$/,
					use: [
						{
							loader: miniCssExtractPlugin.loader,
							options: {},
						},
						{
							loader: 'css-loader',
							options: {
								modules: {
									localIdentName: `zip-[name]-[local]-[hash:base64:5]`,
								},
								sourceMap: true,
								importLoaders: 2,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								postcssOptions: {
									plugins: [autoprefixer({})],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				},
				{
					test: /\.s(a|c)ss$/,
					exclude: /\.module\.s(a|c)ss$/,
					use: [
						{
							loader: miniCssExtractPlugin.loader,
							options: {
								esModule: false,
							},
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								importLoaders: 2,
								modules: false,
								esModule: false,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								postcssOptions: {
									plugins: [autoprefixer({})],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: miniCssExtractPlugin.loader,
							options: {
								esModule: false,
							},
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								importLoaders: 2,
								modules: false,
								esModule: false,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								postcssOptions: {
									plugins: [autoprefixer({})],
								},
							},
						},
					],
				},
				{
					test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
					type: 'asset/resource',
					generator: {
						filename: '[name][ext]',
					},
				},
				{
					test: /\.(png|jpg|jpeg|svg|gif|webm)$/,
					type: 'asset/resource',
					generator: {
						filename: 'images/[name].[contenthash].[ext]',
					},
				},
			],
		},
		plugins: [
			new esLintPlugin(),
			new CleanWebpackPlugin(),
			new miniCssExtractPlugin({
				ignoreOrder: true,
				filename: CSS_FILENAME,
				chunkFilename: CSS_FILENAME,
			}),
			new webpack.EnvironmentPlugin({
				APP_ROOT: '',
				APP_VERSION: process.env.APP_VERSION,
			}),
			new WebpackManifestPlugin({
				fileName: path.resolve(__dirname, process.env.ASSET_MANIFEST),
				writeToFileEmit: true,
				generate: (seed, files, entrypoints) => manifestGenerator(entrypoints, PUBLIC_PATH),
			}),
			!IS_PROD && new reactRefreshWebpackPlugin(),
		].filter(Boolean),
		optimization: {
			minimize: IS_PROD,
			runtimeChunk: 'single',
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
					},
				},
			},
			minimizer: [
				new terserWebpackPlugin({
					terserOptions: {
						output: {
							comments: false,
						},
					},
				}),
				new cssMinimizerPlugin({
					sourceMap: true,
					minimizerOptions: {
						preset: [
							'default',
							{
								discardComments: { removeAll: true },
							},
						],
					},
				}),
			],
		},
	};
};
