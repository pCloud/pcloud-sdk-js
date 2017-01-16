const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'pcloudsdk.js',
    library: 'pCloudSdk',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
	module: {
    preLoaders: [{ test: /\.js$/, loader: "source-map-loader" }],
		loaders: [{ test: /\.js$/, loader: 'babel-loader' }]
	},
  resolve: {
    packageAlias: "browser"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('web')
    })
  ]
};
