const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getClientEnvironment = require('./config/env');
// const paths = require('./config/paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
// const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

function modify(buffer) {
  const manifest = JSON.parse(buffer.toString());
  if (process.env.REACT_APP_VERSION) manifest.version = process.env.REACT_APP_VERSION.replace('v', '');
  const manifestJSON = JSON.stringify(manifest, null, 2);
  return manifestJSON;
}

module.exports = {
  entry: {
    backgroundPage: path.join(__dirname, 'src/backgroundPage.ts'),
    popup: path.join(__dirname, 'src/popup/index.tsx'),
  },
  // entry: path.resolve(__dirname, 'src/popup/index.tsx'),
  output: {
    path: path.join(__dirname, 'extension/js'),
    filename: '[name].js',
    // path: path.resolve(__dirname, 'extension/js'),
    // filename: '[name].js',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      maxSize: 200000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // Compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new HtmlWebpackPlugin({ filename: 'popup.html', template: 'extension/popup.html' }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './extension/manifest.json',
          to: '../manifest.json',
          // eslint-disable-next-line no-unused-vars
          transform(content, _path) {
            return modify(content);
          },
        },
      ],
    }),
  ],
};
