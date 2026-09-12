# API 参考

本版本公开四个入口，见[兼容性](../guide/compatibility.md) 的导出表。根入口是浏览器可用的 hook 和路径解析；构建插件应从对应子路径导入。

- [插件 API](./plugins.md)：Vite / Webpack / Rspack 工厂。
- [Hook API](./hooks.md)：类型约束的路径构建与导航。
- [类型定义](./types.md)：实际导出与声明合并。

本库不导出 RouterProvider、BrowserRouter、RouteExtractor 或自定义生成器。Router 组件与 loader 参数类型从 `react-router-dom` 获取。
