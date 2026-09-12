# 介绍

欢迎使用 `@feoe/fs-router`，这是一个基于文件的约定式路由库，为 React 应用提供类型安全的路由解决方案。

## Why fs-router？

### 约定式路由的优势

约定式路由是一种基于文件系统配置路由的方式。相比于在代码中定义路由结构，你可以通过一系列文件和目录来表示应用的路由层次结构。这种方式带来了诸多优势：

- **简洁直观**：基于文件的路由在视觉上直观易懂，无论是新手还是经验丰富的开发者都能快速理解
- **结构清晰**：路由组织方式与应用的 URL 结构保持一致，便于理解和维护
- **易于扩展**：随着应用规模的增长，基于文件的路由让添加新路由和维护现有路由变得轻松简单
- **自动代码分割**：基于文件的路由允许自动对路由进行代码分割，提升应用性能
- **类型安全**：通过生成和管理路由的类型链接，大幅提升类型安全性，避免了基于代码路由中繁琐的手动维护
- **保持一致性**：约定式路由强制执行一致的路由结构，使应用更易维护和更新，也便于在不同项目间迁移

*—— 摘自 TanStack Router*

### CSR 数据并行加载

React Router 最新版本支持客户端渲染（CSR）的并行加载机制：

- **并行处理**：在客户端加载 JavaScript 的同时，并行发起数据请求，加载页面所需数据。**仅数据路由模式支持**
- **性能提升**：这种机制可以显著缩短页面初始化的加载时间，提升用户体验

### 组件化最佳实践

约定式路由天然支持组件化的最佳实践：

- **模块化设计**：通过逻辑拆分，将组件划分为 `layout`、`page`、`loader`、`loading`、`error` 等独立模块
- **职责分离**：各模块各司其职，互不干扰，通过运行时的动态组合实现功能
- **更好的可维护性**：这种架构提供了更好的可扩展性和可维护性，便于长期项目维护

---

综合以上特性，`@feoe/fs-router` 为现代 React 应用提供了**更快的渲染速度**、**更前沿的架构设计**以及**更优秀的可扩展性和可维护性**。

## 设计理念

@feoe/fs-router 的设计遵循以下原则：

1. **约定优于配置** - 通过文件系统约定减少配置，设计参考 [Modern.js](https://modernjs.dev/zh/guides/basic-features/routes.html#%E8%B7%AF%E7%94%B1), [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [Remix](https://reactrouter.com/how-to/file-route-conventions), [@TanStack/router](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing) 等。
2. **类型安全** - 提供完整的 TypeScript 支持，主要参考 @TanStack/router
3. **性能优先** - 支持代码分割和懒加载
4. **开发体验** - 热更新和快速构建

## 主要概念

- [约定式路由](../basic/file-based-routing.md) - 基于文件系统的路由约定
- [动态路由](../basic/dynamic-routes.md) - 参数路由和嵌套路由
- [类型安全](../advanced/type-safety.md) - TypeScript 支持和类型生成
- [数据获取](../advanced/data-fetch.md) - 开箱即用的数据获取能力

## Inspiration & Thanks

- [modern.js](https://github.com/web-infra-dev/modern.js) - 这是一个极重的 Runtime，因为想做的事情太多了。SSR / SSR-Streaming / CSR / SPR / MPR / 约定式路由 / 注册式路由 等等，更关键的是**你不可能去改它**。本项目完全是因为改不动 Modern.js 但又觉得其内置的约定式路由设计不错所以开发了这个，🤣
- [Next.js App Router](https://nextjs.org/docs/app) - 如果用 React SSR 这应该是最佳实践
- [Remix-run File System Route Convention](https://remix.run/docs/en/main/start/v2#file-system-route-convention) - Remix-run 版本的约定式路由
- [@TanStack/react-router File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing) - 在类型声明方面，参考了很多 TanStack 的实现
- [@loadable/component](https://github.com/gregberge/loadable-components) - The recommended Code Splitting library for React ✂️✨，内部懒加载默认使用该组件

## 📄 License

MIT
