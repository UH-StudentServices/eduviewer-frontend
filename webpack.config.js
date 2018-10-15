const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { createVariants } = require('parallel-webpack');

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
  ]
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'style.[hash].css'
});

const webpackMd5Hash = new WebpackMd5Hash();
const reactHotLoader = new webpack.HotModuleReplacementPlugin();
const cleanWebPackPlugin = new CleanWebpackPlugin('dist', [{}]);


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
        test: /\.global\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'postcss-loader'
        ]
      },

      {
        test: /.*\/node_modules\/.+\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },

      {
        test: /^((?!\.global).)*\.css$/,
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
    miniCssExtractPlugin,
    reactHotLoader,
    webpackMd5Hash,
    cleanWebPackPlugin
  ],
  devServer: devServerConfig,
  devtool: 'eval-source-map'
});

module.exports = createVariants(baseOptions, variants, createConfig);
