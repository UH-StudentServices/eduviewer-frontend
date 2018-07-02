const autoPrefixerPlugin = require('autoprefixer'); // eslint-disable-line import/no-extraneous-dependencies
const cssNextPlugin = require('postcss-cssnext'); // eslint-disable-line import/no-extraneous-dependencies

const variables = require('./src/styles/variables');

module.exports = {
  plugins: [
    autoPrefixerPlugin,
    cssNextPlugin({
      browsers: 'last 2 versions',
      features: {
        customProperties: { variables }
      }
    })
  ]
};
