var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var WebpackConfig = require('./webpack.config');

var app = express();

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/examples/',
  stats: {
    colors: true
  }
}));

//var fs = require('fs');
//var path = require('path');

/*
fs.readdirSync(__dirname).forEach(function (file) {
  if (fs.statSync(path.join(__dirname, file)).isDirectory())
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'));
});
*/

app.use(express.static(__dirname + '/examples'));

app.listen(8080, function () {
  console.log('Server listening on http://127.0.0.1:8080, Ctrl+C to stop');

  require("openurl").open("http://127.0.0.1:8080");
});
