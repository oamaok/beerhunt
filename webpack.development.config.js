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
    ],
  },

  mode: 'development',

  output: {
    publicPath: '/',
    filename: '[name].[hash:base64:8].js',
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
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]__[hash:base64:4]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              data: '@import "config";',
              includePaths: [
                './client/styles/',
              ],
            },
          },
        ],
      },
    ],
  },
};
