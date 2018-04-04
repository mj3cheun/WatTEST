var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: ['./src/client/js/App.jsx'],
	output: {
		path: __dirname + '/src/client/public',
		filename: 'bundle.js'
	},
	devtool: 'inline-source-map',
	module: {
		rules: [{
				test: /.jsx?$/,
				use: 'babel-loader?cacheDirectory=true',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.png$/,
				use: 'url-loader'
			}
		]
	}
};
