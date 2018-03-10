path = require('path');
const webpack = require('webpack');
const babel = require('babel-loader');

module.exports = {
	entry: './react/app.js',
	output: {
		path: path.resolve(__dirname, 'public/js'),
		publicPath: 'public/js',
		filename: 'bundle.js'
	},
	target: 'web',
	module:{
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'react', 
								'es2015', 
								// 'stage-1'
							]
						}
					}
				]
			}
		]
	}
}