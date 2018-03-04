const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'app', 'app.js'),
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'app.js'
  },
  module: {
    loaders: [
    {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:
        {
          presets:['react']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:
        {
          presets:['react']//presets:["es2015",'react']
        }
      }
    ]
  }
};
