const path = require('path');

module.exports = exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, '../serve/public/js'),
        filename: 'index.js'
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
    }
};