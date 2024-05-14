const HTMLPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
      popup: "./src/popup_components/popup_index.tsx", 
      page: "./src/page_components/page_index.tsx",
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: ["style-loader", "css-loader", "postcss-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    output: {
        path: path.resolve(__dirname, "dev_dist"),
        filename: "[name]-bundle.js",
        chunkFilename: '[id].[chunkhash].js'
    },
    plugins: [
      new HTMLPlugin({
        inject: false,
        template: './public/popup.html',
        chunks: ['popup'],
        filename: 'popup.html'
      }),
      new HTMLPlugin({
        inject: false,
        template: './public/page.html',
        chunks: ['page'],
        filename: 'page.html'
      }),
        /* Necessary to use HTMLPlugin to inject the bundle into the index.html */
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: "public", 
                    to: "", 
                    globOptions: {
                        ignore: ["**/index.html"], // This line excludes index.html
                    },
                },
            ],
        }),
    ],
    devServer: {
      // ...
      watchContentBase: true
    }
};
