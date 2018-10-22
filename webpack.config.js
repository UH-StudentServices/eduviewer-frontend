/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-frontend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-frontend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-frontend.  If not, see <http://www.gnu.org/licenses/>.
 */


const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { createVariants } = require('parallel-webpack');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

const baseOptions = {
  isDevelopment
};

const defaultTarget = 'var';

const variants = {
  target: isDevelopment ? [defaultTarget] : [defaultTarget, 'commonjs2', 'umd', 'amd']
};

const getHtmlFileName = (target) => {
  const isDefaultTarget = target === defaultTarget;
  return isDefaultTarget ? 'index.html' : `index_${target}.html`;
};

const getHtmlPlugin = target => new HtmlWebPackPlugin({
  inject: true,
  filename: getHtmlFileName(target),
  template: '../index.html.template',
  title: 'Eduviewer',
  baseHref: '/',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ],
  excludeAssets: [/styles.css/]
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'styles.css'
});

const webpackMd5Hash = new WebpackMd5Hash();
const reactHotLoader = new webpack.HotModuleReplacementPlugin();
const cleanWebPackPlugin = new CleanWebpackPlugin('dist', [{}]);
const htmlWebpackExcludeAssetsPlugin = new HtmlWebpackExcludeAssetsPlugin();

const devServerConfig = {
  port: 8080
};

const createConfig = options => ({
  context: path.join(__dirname, 'src'),
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    './app'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: options.isDevelopment ? 'dist' : '',
    filename: `eduviewer.${options.target}.js`,
    libraryTarget: options.target
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|dist)/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /.*\/node_modules\/.+\.css$/,
        exclude: /\/uh-living-styleguide\//,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.*\/node_modules\/.+\.css$/,
        include: /\/uh-living-styleguide\//,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },

          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /\/uh-living-styleguide\//,
        use: 'file-loader?name=fonts/[name]-[hash].[ext]'
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/,
        exclude: /\/fonts?\//,
        use: {
          loader: 'url-loader',
          options: {
            // inline images below 16kb
            limit: 16384,
            name: 'images/[name]-[hash].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    getHtmlPlugin(options.target),
    htmlWebpackExcludeAssetsPlugin,
    miniCssExtractPlugin,
    reactHotLoader,
    webpackMd5Hash,
    cleanWebPackPlugin
  ],
  devServer: devServerConfig,
  devtool: 'eval-source-map'
});

module.exports = createVariants(baseOptions, variants, createConfig);
