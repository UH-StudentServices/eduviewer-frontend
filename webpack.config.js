const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const htmlTemplate = require('html-webpack-template');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  inject: false,
  template: htmlTemplate,
  appMountId: 'root',
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
  port: 8080,
  proxy: [
    {
      context: ['/api/**'],
      target: 'https://od.helsinki.fi/eduviewer/',
      secure: false,
      pathRewrite: {
        '/api': ''
      }
    }
  ]
};

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    'react-hot-loader/patch',
    './app'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
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
      }
    ]
  },
  plugins: [
    htmlPlugin,
    miniCssExtractPlugin,
    reactHotLoader,
    webpackMd5Hash,
    cleanWebPackPlugin
  ],
  devServer: devServerConfig
};
