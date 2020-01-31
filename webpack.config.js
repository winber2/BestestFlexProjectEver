const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');
const STATIC_DIR = path.resolve(__dirname, 'static');

const config = {
  entry: {
    index: `${APP_DIR}/index.jsx`,
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].[hash].js',
  },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR], { watch: true }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      template: `${APP_DIR}/index.html`,
      filename: `${BUILD_DIR}/index.html`,
    }),
    new CopyWebpackPlugin([{ from: STATIC_DIR, BUILD_DIR }]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[local]',
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        include: APP_DIR,
        exclude: /(node_modules)/,
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2'],
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, BUILD_DIR),
    port: 3000,
    compress: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', path.resolve(__dirname, './src')],
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
};

module.exports = config;
