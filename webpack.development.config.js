const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      './client/index.jsx',
      './client/styles/main.scss',
    ],
  },

  output: {
    publicPath: '/',
    filename: '[name].[hash].js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: ['node_modules', path.resolve(__dirname, 'client/')],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html',
      inject: 'body',
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      __dev: true,
    }),
  ],

  devtool: 'cheap-module-eval-source-map',

  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.s[ac]ss$/, loader: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ },
    ],
  },
};