const webpack = require('webpack');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'pdfmake/build/pdfmake': 'pdfMake',
  },
  output: {
    path: `${__dirname}/dev/dist`,
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  target: ['web', 'es5'],
  plugins: [new webpack.ProgressPlugin()],
};
