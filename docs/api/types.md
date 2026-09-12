# 类型定义

| 入口 | 公开类型 |
| --- | --- |
| `@feoe/fs-router` | `PathParserResult`、`RouterParam`、`RouteTypes` |
| `@feoe/fs-router/vite` | `PluginConfig` |
| `@feoe/fs-router/webpack` | `PluginConfig` |
| `@feoe/fs-router/rspack` | `PluginConfig` |

`RouteTypes` 是可声明合并的接口，由生成的类型文件扩充。它记录路径键，不生成 loader 结果或参数业务 schema。

```ts
import type { PluginConfig } from '@feoe/fs-router/vite';
type TypeOptions = NonNullable<PluginConfig['typeGenerateOptions']>;
const typeOptions: TypeOptions = { routesTypeFile: 'src/routes-type.ts' };
```

内部的 `TypeGenerateOptions`、`RouteDirectory`、`NavigationOptions` 不是单独公开的具名导出。通过公开 `PluginConfig` 的属性取得配置类型，避免导入 `dist/...`。

`RouteObject`、`LoaderFunctionArgs`、`ActionFunctionArgs` 从 `react-router-dom` 导入。本库没有旧文档所列的公开 `RouteConfig`、`LoaderFunction`、`ActionFunction` 接口。

有效配置与兼容保留字段见[插件选项](../guide/configuration/plugin-options.md)。
