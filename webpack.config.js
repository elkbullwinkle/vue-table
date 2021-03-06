const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

var config = {
    output: {
        path: path.resolve(__dirname + '/dist/'),
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: __dirname,
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.css$/,
                loader: 'style!less!css'
            }
        ]
    },
    externals: {
        axios: 'axios'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin( {
            minimize : true,
            sourceMap : false,
            mangle: true,
            compress: {
                warnings: false
            }
        } )
    ]
};


module.exports = [
    merge(config, {
        entry: path.resolve(__dirname + '/src/index.js'),
        output: {
            filename: 'vue-table.min.js',
            libraryTarget: 'window',
            library: 'VueTable',
        }
    }),
    merge(config, {
        entry: path.resolve(__dirname + '/src/Components/Table.vue'),
        output: {
            filename: 'vue-table.js',
            libraryTarget: 'umd',
            library: 'vue-table',
            umdNamedDefine: true
        }
    })
];