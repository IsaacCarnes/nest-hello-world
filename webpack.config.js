/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  entry: './dist/main.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'packed'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      'class-transformer': false,
      'class-validator': false,
      '@nestjs/microservices': false,
      '@nestjs/websockets/socket-module': false
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  
};