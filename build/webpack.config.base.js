const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        requirejs: [path.join(__dirname, '../src/requirejs.js')]
    },

    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },

    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
            }
        ]
    }

};
