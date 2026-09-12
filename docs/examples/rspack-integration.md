# Rspack 集成示例

按[快速开始](../guide/start/getting-started.md) 安装最小示例；其 Rspack 固定为 1.7.12。

```js
// rspack.config.mjs：核心配置
import { resolve } from 'node:path';
import fileBasedRouter from '@feoe/fs-router/rspack';
import { rspack } from '@rspack/core';

export default {
  mode: 'production',
  entry: './src/main.tsx',
  output: { path: resolve('dist/rspack'), filename: 'app.js', publicPath: '/', clean: true },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: { rules: [{
    test: /\.tsx?$/, exclude: /node_modules/,
    use: { loader: 'builtin:swc-loader', options: { jsc: {
      parser: { syntax: 'typescript', tsx: true },
      transform: { react: { runtime: 'automatic' } },
    } } },
  }] },
  plugins: [fileBasedRouter(), new rspack.HtmlRspackPlugin({ template: './bundler.html' })],
};
```

实际配置还以配置文件所在目录固定 context/output，避免 cwd 变化。不要把 SWC 的 options 放在规则对象外层。

```sh
npm --prefix examples/minimal-react run build:rspack
npm --prefix examples/minimal-react run preview:rspack
```

构建脚本调用 Rspack API，检查错误并关闭 compiler，再运行 tsc；不需要全局 CLI。preview 仅提供本地生产产物与 SPA 回退，不是线上部署服务。文件结构和 loader 用法与 Vite 相同。

[完整配置](https://github.com/givingwu/fs-router/blob/main/examples/minimal-react/rspack.config.mjs)。旧 Rsbuild 微前端工程不作为此版本兼容性证据；额外 runtime 集成需单独验证。
