# 常见问题解答

## npm 安装后与文档不一致

本分支是尚未发布的 0.1.0 候选。按[快速开始](../start/getting-started.md) 使用 tarball，不要直接安装旧 npm 版本并套用新 API。安装依赖可用 `npm ls @feoe/fs-router react react-dom react-router-dom` 核对。

## 为什么需要根布局

生成器以根布局组织路由。创建 `src/routes/layout.tsx`，默认导出包含 `Outlet` 的组件；空文件或仅创建 page 不够。

## 类型出现 never 或找不到 routes

先启动/构建所用构建器，检查 `src/routes-type.ts` 和 `src/routes.tsx` 已生成，再确认它们被 tsconfig include。将构建顺序调整为生成在前、tsc 在后。

## loading.tsx 为什么没有覆盖请求等待

它是组件懒加载占位，`splitting: false` 时不生成。数据请求等待使用 React Router 的 pending hook，见[数据获取](../advanced/data-fetch.md)。

## 支持 Router 6、SSR 或微前端吗

当前验证 Router 7.18.3 的客户端 Data Router。没有 SSR/RSC 或旧微前端工程的端到端兼容承诺；`routesDirectories` 只合并类型。具体版本见[支持矩阵](../compatibility.md)。

## 热更新会保留状态吗

结构变化可完整刷新。组件 Fast Refresh 由应用的 React 插件负责，也可能因导出方式变化而刷新，不承诺状态保留。
