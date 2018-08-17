const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
                resolve: { extensions: ["*"] }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    }, 
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }, 
                    {
                        loader: 'less-loader' // compiles Less to CSS
                    }
                ] // compiles Less to CSS
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                },
                resolve: { extensions: [".jsx", ".js"] }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
                resolve: { extensions: [".js"] }
            }
        ]
    }
};