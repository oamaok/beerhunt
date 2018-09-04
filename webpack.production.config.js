const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './client/index.jsx',
      './client/styles/main.scss',
    ],
  },

  mode: 'production',

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'build/client/'),
    filename: '[hash].js',
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

    new ExtractTextPlugin('[hash].css'),
  ],

  devtool: '',

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.s[ac]ss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
      },
    ],
  },
};
