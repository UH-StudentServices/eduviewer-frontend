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
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

const defaultTarget = 'var';

const getHtmlFileName = (target, lang) => {
  const isDefaultTarget = target === defaultTarget;
  const langId = lang ? `.${lang}` : '';
  return isDefaultTarget ? `index${langId}.html` : `index${langId}_${target}.html`;
};
const getHtmlPlugin = (target, lang) => new HtmlWebPackPlugin({
  inject: true,
  filename: getHtmlFileName(target, lang),
  template: '../index.html.template',
  baseHref: '/',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ],
  excludeAssets: [/styles.css/],
  templateParameters: {
    lang: lang || 'fi',
    title: 'Eduviewer'
  }
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'styles.css'
});

const cleanWebPackPlugin = new CleanWebpackPlugin('dist', [{}]);

const devServerConfig = {
  port: 8080
};

const createConfig = (options) => ({
  context: path.join(__dirname, 'src'),
  entry: [
    '@babel/polyfill',
    './app'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: `eduviewer.${options.target}.js`,
    libraryTarget: options.target,
    library: `eduviewer_${options.target}`
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|dist)/,
        use: ['babel-loader']
      },
      {
        test: /.*\/node_modules\/.+\.css$/,
        use: [
          'style-loader',
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
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              },
              sourceMap: true,
              importLoaders: 1
            }
          },

          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /\/fonts\//,
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
    getHtmlPlugin(options.target, 'en'),
    getHtmlPlugin(options.target, 'sv'),
    miniCssExtractPlugin,
    cleanWebPackPlugin,
    new ESLintWebpackPlugin()
  ],
  devServer: devServerConfig
  // devtool: 'eval-source-map'
});

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  const variants = isDevelopment ? [defaultTarget] : [defaultTarget, 'commonjs2', 'umd', 'amd'];
  const variantConfigs = [];

  for (const variant of variants) {
    const options = { target: variant };
    variantConfigs.push(createConfig(options));
  }
  return variantConfigs;
};
