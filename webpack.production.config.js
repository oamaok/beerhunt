const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const path = require('path');

const extractStyles = new ExtractTextPlugin({
  filename: '[name]-[contenthash:base64:8].css',
});

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './client/index.jsx',
    ],
  },

  mode: 'production',

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'build/client/'),
    filename: '[name]-[hash:8].js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.sass', '.scss'],
    modules: ['node_modules', path.resolve(__dirname, 'client')],
    alias: {
      common: path.resolve(__dirname, 'common'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html',
      inject: 'body',
      inlineSource: '\\.css$',
    }),

    new HtmlWebpackInlineSourcePlugin(),

    extractStyles,
  ],

  devtool: '',

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loader: extractStyles.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[hash:base64:4]',
              },
            },
            {
              loader: 'sass-loader',
              options: {
                data: '@import "config";',
                outputStyle: 'compressed',
                includePaths: [
                  './client/styles/',
                ],
              },
            },
          ],
        }),
      },
    ],
  },
};
