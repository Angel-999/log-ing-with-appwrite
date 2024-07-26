const path = require('path');
module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js',
    // Add more entries as needed
  },
  output: {
    filename: '[name].bundle.js', // [name] placeholder will use entry point names
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};
