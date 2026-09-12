# 插件 API

```ts
import vitePlugin, { FileBasedRouterVite, type PluginConfig } from '@feoe/fs-router/vite';
import rspackPlugin, { FileBasedRouterRspack } from '@feoe/fs-router/rspack';
import webpackPlugin, { FileBasedRouterWebpack } from '@feoe/fs-router/webpack';
```

每个入口的默认导出与对应具名导出是同一个插件工厂，接受 `Partial<PluginConfig>`；未传参数使用默认扫描路径。仅将匹配当前构建器的插件放入其 plugins 列表。

CommonJS 配置使用 `.cjs` 扩展名，并通过 `.default` 取默认导出：

```js
const fileBasedRouter = require('@feoe/fs-router/webpack').default;
module.exports = { plugins: [fileBasedRouter()] };
```

上例仅展示插件位置；运行项目仍需入口、TSX loader、扩展名解析、HTML 与部署回退配置。不要在 `type: "module"` 项目的 `.js` 文件里直接使用 require。

[配置字段](../guide/configuration/plugin-options.md) 是唯一配置参考；[Vite](../examples/vite-integration.md)、[Rspack](../examples/rspack-integration.md)、[Webpack](../examples/webpack-integration.md) 提供完整可运行入口。
