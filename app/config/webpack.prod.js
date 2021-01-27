const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = env => {
	return {
		entry: {
			main: ['babel-runtime/regenerator', './app/public/main.js'],
		},
		mode: 'production',
		output: {
			filename: '[name]-bundle.js',
			path: path.resolve(__dirname, '../../dist'),
			publicPath: '/',
		},

		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					use: [
						{
							loader: 'babel-loader',
						},
					],
					exclude: /node_modules/,
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: 'css-loader',
						},
					],
				},
				{
					test: /\.s(a|c)ss$/,
					exclude: /\.module.(s(a|c)ss)$/,
					loader: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader',
						},
						{
							loader: 'resolve-url-loader',
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
					test: /\.html$/,
					use: [
						{
							loader: 'html-loader',
							options: {
								attrs: ['img:src'],
							},
						},
					],
				},
				{
					test: /\.pug$/,
					use: [
						{
							loader: 'pug-loader',
						},
					],
				},
				{
					test: /\.(jpg|gif|png)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'images/[name].[ext]',
							},
						},
					],
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: ['file-loader'],
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(env.NODE_ENV),
				},
			}),
		],
		resolve: {
			extensions: ['.js', '.jsx', '.scss'],
		},
	};
};
