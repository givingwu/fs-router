import { fileURLToPath } from 'node:url';
import fileBasedRouter from '@feoe/fs-router/rspack';
import { rspack } from '@rspack/core';

export default {
  context: fileURLToPath(new URL('.', import.meta.url)),
  mode: 'production',
  entry: './src/main.tsx',
  output: { path: fileURLToPath(new URL('./dist/rspack', import.meta.url)), filename: 'app.js', publicPath: '/', clean: true },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: { loader: 'builtin:swc-loader', options: { jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } } } } }] },
  plugins: [fileBasedRouter(), new rspack.HtmlRspackPlugin({ template: './bundler.html' })],
};
