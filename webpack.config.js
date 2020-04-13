const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist/",
    filename: "pcloudsdk.js",
    library: "pCloudSdk",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: { aliasFields: ["browser"] },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify("web"),
    }),
  ],
};
