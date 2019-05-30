const path = require('path');
const webpack = require('webpack')
module.exports = exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../serve/public/js'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|@material-ui\/core)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};