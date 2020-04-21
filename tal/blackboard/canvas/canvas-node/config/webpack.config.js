module.exports = {
  target: 'node',
  entry: '../index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  }
}