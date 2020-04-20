module.exports = {
  entry: '../HandWritting.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  }
}