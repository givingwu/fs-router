# 从 React Router 迁移

本库生成 React Router 配置，不替换 React Router。先独立完成 Router 7.18.3 的升级与行为验证，再迁移文件约定，避免同时改变过多变量。

## 逐步迁移

1. 按[快速开始](../start/getting-started.md) 安装候选 tarball、peer 和构建插件。
2. 将应用顶层布局移到 `src/routes/layout.tsx`，保留 `Outlet`。
3. 将索引组件移到 `page.tsx`，将 `/users/:id` 页面移到 `users/[id]/page.tsx`。
4. loader/action 移到对应 `.data.ts` 的具名导出，保留客户端业务逻辑。
5. 将 RouterProvider 的配置改为 `createBrowserRouter(routes)`，其中 routes 来自生成文件。
6. 先生成再执行 TypeScript 检查，按需改用本库 `useNavigation`。

## 需要手工复核

路由 id、handle、shouldRevalidate、basename、错误边界和应用手工包装不会由旧路由表自动迁入。确认自己需要的属性在生成结果中存在；必要时在应用层显式组合，不依赖未实现的 `*.config.ts` 合并。

验证直接访问、刷新、404、嵌套 Outlet、动态/可选/通配参数、前进后退、loader/action 和错误响应。迁移失败可恢复旧路由表与原插件配置，避免直接在生产替换。

[React Router 官方 v6 升级指南](https://github.com/remix-run/react-router/blob/react-router%407.18.3/docs/upgrading/v6.md) 说明 Router 本身的兼容变化；[0.1 迁移](./v0.1.md) 说明本库变化。
