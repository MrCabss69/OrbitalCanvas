const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',  // Asegúrate de que el punto de entrada es correcto
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Procesar archivos .js
        exclude: /node_modules/,  // Excluir la carpeta node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};