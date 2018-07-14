/**
 * Client Webpack Config
 *
 * This configuration is used to build the assets that will be used client-side.
 * This means bundeling javascript, css, etc.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {

    mode: isProduction
        ? 'production'
        : 'development',

    // Webpack will start at this file(s) looking for imports to bundle
    entry: [ require.resolve('./polyfill.js'), './app/client/index.js' ],

    // Configure how webpack should output the packed scripts. We use
    // chunkhash to allow optimal browser caching.
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'static/bundle.[chunkhash].js'
    },

    optimization: isProduction
        ? {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        }
        : {},

    module: {
        rules: [

            {
                // Process css files with the MiniCssExtractPlugin. This will merge all CSS files
                // into a single file (see plugins)
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },

            {
                oneOf: [
                    // URL loader will give back a URL when imported. But then small than given size
                    // it will return a data-url. In this case we use 8kB as max size
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: 'url-loader',
                        options: {
                            limit: 8*1024,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },

                    // Babel loader is use for Javascript files. Babel will transpile ES6, JSX, etc
                    // to node compatible code. We exclude /node_modules/ no prevent that we need
                    // to transpile the whole code base.
                    {
                        test: /.js$/,
                        loader: 'babel-loader',
                        include: path.join(__dirname, 'app'),
                        exclude: '/node_modules/',
                        query: {
                            plugins: [ ["transform-object-rest-spread", { "useBuiltIns": true }] ],
                            presets: [ 'env', 'react' ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // Create the combined CSS bundle file
        new MiniCssExtractPlugin({
            filename: 'static/css.bundle.[hash].css'
        }),

        // Because we are using chunkhash in our bundle name a new file is generated
        // each time. This would fill up our build folder. Therefor clean it. But
        // exclude server.js as that is not build by this configuration.
        new CleanWebpackPlugin([ 'build' ], {
            exclude: [ 'server.js' ],
        }),

        // We use SWPrecacheWebpackPlugin to create our service worker. It is designed to automatically pre-cache
        // all the build assets.
        new SWPrecacheWebpackPlugin({
            filename: 'static/service-worker.js',
            minify: false,
            staticFileGlobsIgnorePatterns: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/]
        }),

        // The generated bundles use chunkhash. This way we don't know the filenames in advance
        // use HtmlWebpackPlugin to inject them into our template file.
        new HtmlWebpackPlugin({
            template: './app/client/index.html',
            filename: 'index.html',
            inject: 'body',
        }),
    ],

    devServer: {
        clientLogLevel: 'none',
        compress: true,
        historyApiFallback: true
    }

};
