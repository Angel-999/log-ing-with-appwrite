const path = require('path');
module.exports = {
  entry: {
    truck: './src/truck.js',
    login: './src/login.js',
    translate: './src/translate.js',
    view: './src/view.js',
    idk: './src/idk.js',
    // Add more entries as needed
  },
  output: {
    filename: '[name].bundle.js', // [name] placeholder will use entry point names
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};
