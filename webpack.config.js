const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lossless-superpower.js',
    library: 'LosslessSuperpower',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  externals: {
    'ml': 'commonjs ml',
    'systeminformation': 'commonjs systeminformation',
    'yaml': 'commonjs yaml',
    'express': 'commonjs express',
    'body-parser': 'commonjs body-parser',
    'cors': 'commonjs cors',
    'swagger-jsdoc': 'commonjs swagger-jsdoc',
    'swagger-ui-express': 'commonjs swagger-ui-express',
    'unzipper': 'commonjs unzipper'
  }
};
