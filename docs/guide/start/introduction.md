# 介绍

`@feoe/fs-router` 是构建时的文件路由生成器。它扫描约定文件，输出普通 TSX 路由表和 TypeScript 路径声明，交给应用自己的 React Router Data Router 使用。

## 适合什么项目

- 已有 React / TypeScript 客户端应用，希望减少手写路由表。
- 使用受测版本的 Vite、Webpack 或 Rspack，希望保留现有构建流程。
- 能接受必需根布局、文件命名约定和构建前生成步骤的项目。

如果需要 SSR、RSC、服务端 loader 隔离、完整框架部署或 Router 6 兼容，本版本不提供这些承诺。库也不会替应用配置鉴权、API 服务、状态缓存或微前端运行时。

## 实际能力

| 能力 | 范围 |
| --- | --- |
| 文件路由 | 页面、布局、动态/可选参数、通配和路由组 |
| 导航类型 | 生成声明约束本库 `useNavigation` 的路径与参数；不校验业务值 |
| 数据 | 把同名数据模块的 loader/action 接入 Router，均为客户端代码 |
| 分包 | 默认懒加载非根组件；根布局与 loader 静态导入 |
| 开发监听 | 增删路由重新生成；结构变化可能整页刷新 |

本页描述尚未发布的 **0.1.0 候选版本**，不代表 npm 历史版本。[快速开始](./getting-started.md) 可从源码构建 tarball 试用，无需演示账户。

详细版本与未覆盖环境见[兼容性](../compatibility.md)，公开入口见 [API](../../api/index.md)。技术来源保留在[仓库 README](https://github.com/givingwu/fs-router#readme)。
