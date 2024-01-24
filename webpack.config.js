const path = require("path");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development", // モードを設定（developmentまたはproduction）
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "public/index.html", to: "index.html" }],
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};
