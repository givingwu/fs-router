import { fileURLToPath } from 'node:url';
import fileBasedRouter from '@feoe/fs-router/webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  context: fileURLToPath(new URL('.', import.meta.url)),
  mode: 'production',
  entry: './src/main.tsx',
  output: { path: fileURLToPath(new URL('./dist/webpack', import.meta.url)), filename: 'app.js', publicPath: '/', clean: true },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: { loader: 'ts-loader', options: { transpileOnly: true, compilerOptions: { noEmit: false, allowImportingTsExtensions: false } } } }] },
  plugins: [fileBasedRouter(), new HtmlWebpackPlugin({ template: './bundler.html' })],
};
