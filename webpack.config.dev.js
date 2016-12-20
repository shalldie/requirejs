// const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

module.exports = Object.assign(webpackConfig, {
    devtool: "cheap-module-eval-source-map"
});