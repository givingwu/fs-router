# 插件配置

构建适配器接受 `Partial<PluginConfig>`；从所用适配器入口导入类型。

```ts
import fileBasedRouter, { type PluginConfig } from '@feoe/fs-router/vite';
const options: Partial<PluginConfig> = {
  routesDirectory: 'src/routes',
  generatedRoutesPath: 'src/routes.tsx',
  splitting: true,
  typeGenerateOptions: { routesTypeFile: 'src/routes-type.ts' },
};
fileBasedRouter(options);
```

## 有效选项

| 字段 | 默认值 | 作用 |
| --- | --- | --- |
| `routesDirectory` | `src/routes` | 单个运行时路由扫描目录 |
| `generatedRoutesPath` | `src/routes.tsx` | 路由表输出 |
| `routeExtensions` | `.js .jsx .ts .tsx` 数组 | 扫描扩展名；带前导点 |
| `enableGeneration` | `true` | 是否执行生成 |
| `splitting` | `true` | 非根组件懒加载 |
| `alias` | 无 | `{ name, basename }`；应用构建器和 TS 也须配置对应别名 |
| `typeGenerateOptions.routesTypeFile` | `src/routes-type.ts` | 路径声明输出 |
| `typeGenerateOptions.routesDirectories` | 主扫描目录 | `{ path, prefix? }[]`，只合并类型路径 |

相对路径按构建项目根目录解析。生成代码/类型须互不相同且在所有扫描目录外。提供 `typeGenerateOptions` 对象时必须写 `routesTypeFile`；设为 `undefined` 可关闭类型生成。

## 保留而未实现

`defaultErrorBoundary`、`generateRouteParams`、`generateLoaderTypes` 保留类型兼容，没有相应行为开关。默认错误处理请使用自己的 `error.tsx`。不存在 `watch`、`debug`、`customGenerator` 或自定义路由 wrapper 选项。

Rsbuild 可在其 Rspack 插件列表加入 `@feoe/fs-router/rspack` 适配器，但旧 Rsbuild 微前端示例未纳入本次支持矩阵。[可运行 Rspack 配置](../../examples/rspack-integration.md) 是验证入口。
