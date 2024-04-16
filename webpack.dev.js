const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dev-build'),
    publicPath:'/',   
    filename: '[name].js',
    clean:true
  },
//   devtool: 'inline-source-map',
  target :'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader:"babel-loader"
      }
    ]
  }
};
