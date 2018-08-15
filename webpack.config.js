var path = require('path');
var webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: './src/Index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    node: {
        fs: "empty"
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    }
}