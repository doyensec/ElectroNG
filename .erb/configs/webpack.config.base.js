/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals, version } from '../../src/package.json';
import CreateFileWebpack from 'create-file-webpack';
import fetch from 'sync-fetch';
debugger;

let electron_versions = [];
const response = fetch('https://releases.electronjs.org/releases.json').json()
for(let row of response) {
  electron_versions.push(row.version);
}

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.js$/,
        use: ['shebang-loader'],
      },
    ],
  },
  node: { __dirname: false, __filename: false },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
    alias: {
      "@Modules": path.resolve(__dirname, '../../src/modules/'),
      "@Src": path.resolve(__dirname, '../../src/'),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      ELECTRONG_VERSION: version
    }),
    new CreateFileWebpack({
        path: 'src/modules/Dashboard/components/DashboardNewScanModal/constants/',
        fileName: 'electron_versions.json',
        content: JSON.stringify(electron_versions, null, '\t')
    })
  ],
};
