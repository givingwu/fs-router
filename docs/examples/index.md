# 示例

[最小 React 示例](https://github.com/givingwu/fs-router/tree/main/examples/minimal-react) 共用一套路由页面，提供 Vite、Rspack 和 Webpack 配置。只有虚构用户数据，无后端或演示账户。

在仓库根目录执行：

```sh
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run dev
npm --prefix examples/minimal-react run build:all
```

- [Vite 集成](./vite-integration.md)：推荐首次运行路径，有 React Fast Refresh。
- [Rspack 集成](./rspack-integration.md)：SWC TSX 与完整生产构建。
- [Webpack 集成](./webpack-integration.md)：ts-loader 与完整生产构建。

`build:all` 依次构建三种工具并执行严格类型检查。浏览器检查覆盖导航、loader、错误边界、404、懒加载 chunk、Vite 增删文件和组件编辑；不承诺所有浏览器/平台组合。

## 历史示例

`vite-keep-alive-tabs`、`rsbuild-react-monorepo` 与旧管理后台保留作历史参考。它们有独立依赖和额外 UI/微前端集成，尚未纳入当前兼容矩阵；请勿将根包测试结果视为这些工程的验证。首次接入使用上面的最小示例。
