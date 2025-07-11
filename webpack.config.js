const path = require("path");

// module.exports = {
//     mode: "development",
//     entry: "./src/index.js",
//     output: {
//         filename: "bundle.js",
//     },
//     resolve: {
//         extensions: ['.js','.jsx']
//     },
// module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 loader: 'babel-loader',
//                 exclude: /(node_modules)/,
// options: {
//                     presets: ['@babel/preset-env', '@babel/preset-react']
//                 }
//             },
//             {
//                 test: /\.css$/,
//                 use: [{
//                     loader:"style-loader"
//                 }, {
//                     loader:"css-loader"
//                 }],
//                 include: [path.resolve(__dirname, "src/style")],
//                 // exclude: /node_modules/, //제외함
//             },
//             {
//                 test: /\.(png|jpg|gif|svg)$/,
//                 loader: 'file-loader'
//             },
//             {
//                 test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//                 use: [{
//                     loader: 'file-loader'
//                 }]
//             },
//             {
//                 test: /\.(md|html)$/i,
//                 use: ['markdown-loader', 'html-loader']
//             },
// ]
//     },
// };

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: "development", // 배포할 때에는 "production" master 브랜치에만 적용하면 될 듯
    entry: "./src/index.js",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.css$/i,
                // use: ["style-loader", "css-loader"],
                use:[MiniCssExtractPlugin.loader,'css-loader'],
                include: [path.resolve(__dirname, "src/style")],
                // exclude: /node_modules/, //제외함
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.(md|html)$/i,
                use: ['html-loader', 'markdown-loader']
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
    devServer: {
        disableHostCheck: true
    },
    resolve: {
        extensions: [".js",".jsx",".css"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};