const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // モードを設定（developmentまたはproduction）
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    // CopyWebpackPluginのオプションを修正
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/index.html', to: 'index.html' },
        // 他のコピー対象のファイルやディレクトリを追加できます
      ],
    }),
  ],
};
