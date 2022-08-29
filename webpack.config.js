module.exports = {
  mode: 'development',
  devtool: false,
  entry: './client/client.js',
  output: {
    path: require('path').join(__dirname, './client'),
    filename: 'client-bundle.js',
  }
};