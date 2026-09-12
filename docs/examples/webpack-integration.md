# Webpack 集成示例

按[快速开始](../guide/start/getting-started.md) 安装最小示例；Webpack 固定为 5.110.3。

```js
// webpack.config.mjs：核心配置
import { resolve } from 'node:path';
import fileBasedRouter from '@feoe/fs-router/webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'production',
  entry: './src/main.tsx',
  output: { path: resolve('dist/webpack'), filename: 'app.js', publicPath: '/', clean: true },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: { rules: [{
    test: /\.tsx?$/, exclude: /node_modules/,
    use: { loader: 'ts-loader', options: { transpileOnly: true, compilerOptions: { noEmit: false, allowImportingTsExtensions: false } } },
  }] },
  plugins: [fileBasedRouter(), new HtmlWebpackPlugin({ template: './bundler.html' })],
};
```

实际配置固定 context/output 路径。`transpileOnly` 仅负责转译，独立 `tsc --noEmit` 必须在生成后运行；不能把成功打包视为类型检查通过。

```sh
npm --prefix examples/minimal-react run build:webpack
npm --prefix examples/minimal-react run preview:webpack
```

脚本通过 Webpack API 构建、检查错误并关闭 compiler，不依赖全局 CLI。生产服务器还需要正确的 SPA 深链接回退。

[完整配置](https://github.com/givingwu/fs-router/blob/main/examples/minimal-react/webpack.config.mjs)。CommonJS 用户改用 `.cjs` 与 `require('@feoe/fs-router/webpack').default`，不要混用 ESM 文件与 require。
