const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
//const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./public/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.js$/,
      //   enforce: "pre",
      //   use: ["source-map-loader"],
      // },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
    // new BrotliPlugin({
    //   asset: "[path].br[query]",
    //   test: /\.(js)$/,
    //   threshold: 10240,
    //   minRatio: 0.8,
    // }),
    //new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    // devMiddleware: {
    //   writeToDisk: true,
    // },
    // historyApiFallback: true,
    // static: path.resolve(__dirname, "./dist"),
    // onBeforeSetupMiddleware: function (devServer) {
    //   devServer.app.get(/\.(js|css|html|svg)\.br$/, (req, res) => {
    //     const originalPath = req.path.replace(/\.br$/, "");
    //     res.set("Content-Encoding", "br");
    //     res.set("Content-Type", "application/javascript"); // Adjust the content type based on your files
    //     res.sendFile(originalPath, { root: __dirname });
    //   });
    // },
    compress: true,
    hot: true,
    open: true,
    port: 3000,
  },
};
