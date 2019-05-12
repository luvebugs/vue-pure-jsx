const path = require('path');

module.exports = {
	entry: './main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolveLoader: {
		moduleExtensions: ['-loader'],
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
		  'vue$': 'vue/dist/vue.esm.js'
		}
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {}
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			options: {
			  presets: ['es2015'],
			  plugins: [path.resolve(__dirname, '../index.js'), 'transform-vue-jsx']
			}
		},
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		},]
	},
	devServer: {
		contentBase: path.join(__dirname, '../dist'), // boolean | string | array, static file location
		compress: true, // enable gzip compression
		historyApiFallback: true, // true for index.html upon 404, object for multiple paths
		hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
		https: false, // true for self-signed, object for cert authority
		noInfo: true, // only errors & warns on hot reload
	}
};