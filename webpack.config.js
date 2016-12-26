// var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        requirejs: './src/requirejs'
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                text: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.js', '.json'],
        alias: { // 设置别名

        }
    },
    externals: {
        // 'react': 'React',
        // 'react-dom': 'ReactDOM',
        // 'jQuery': 'jQuery'
    }
};