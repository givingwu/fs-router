<div align="center">
<img src="./docs/public/logo.svg" alt="Logo" width="64" height="64" />

# @feoe/fs-router

[![npm version](https://img.shields.io/npm/v/@feoe/fs-router.svg)](https://www.npmjs.com/package/@feoe/fs-router)
[![npm downloads](https://img.shields.io/npm/dm/@feoe/fs-router.svg)](https://www.npmjs.com/package/@feoe/fs-router)
[![license](https://img.shields.io/npm/l/@feoe/fs-router.svg)](https://github.com/givingwu/fs-router/blob/main/LICENSE)


**基于文件的约定式路由**

为 React 应用提供类型安全的路由解决方案

[文档](https://givingwu.github.io/fs-router/) | [快速开始](#-安装) | [示例](#-示例)

</div>

## ✨ 特性

- 🚀 **约定式路由** - 基于文件系统的路由约定，零配置即可使用
- 📝 **最佳实践** - 自带 React Router v6+ BrowserRouter/DataRouter 组件模块化
- 🔒 **类型安全** - 完整的 TypeScript 支持，提供类型安全的导航
- ⚡ **高性能** - 默认开启代码分割和懒加载，优化应用性能
- 🔄 **热更新** - 开发时文件变更自动重新生成路由文件
- 🔧 **多构建工具支持** - 支持 Vite、Webpack、Rspack 等主流构建工具

## 📦 安装

```bash
npm install @feoe/fs-router -D
# 或
yarn add @feoe/fs-router -D
# 或
pnpm add @feoe/fs-router -D
```

## 系统要求

- Node.js 16.0 或更高版本
- React 18.0 或更高版本
- TypeScript 4.5 或更高版本（可选，但推荐）
- React Router 6.0 或更高版本

## 🚀 快速开始

### 1. 配置构建工具

根据你使用的构建工具，选择对应的配置方式：

#### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { FileBasedRouterVite as fileBasedRouter } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
})
```

#### Rspack

```javascript
// rspack.config.js
const { FileBasedRouterRspack as fileBasedRouter } = require('@feoe/fs-router/rspack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
```

#### Webpack

```javascript
// webpack.config.js
const { FileBasedRouterWebpack as fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
```

### 2. 创建路由文件

在 `src/routes` 目录下创建页面文件：

```
src/routes/
├── layout.tsx          # 根布局 (必须配置)
├── page.tsx            # 首页 (/)
├── about/
│   └── page.tsx        # 关于页面 (/about)
└── users/
    ├── layout.tsx      # 用户模块布局
    ├── page.tsx        # 用户列表 (/users)
    └── [id]/
        └── page.tsx    # 用户详情 (/users/:id)
```

### 3. 创建根布局

```tsx
// src/routes/layout.tsx
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav>
        <a href="/">首页</a>
        <a href="/about">关于</a>
        <a href="/users">用户</a>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

### 4. 创建页面组件

```tsx
// src/routes/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎使用 @feoe/fs-router</h1>
      <p>这是基于文件的约定式路由示例</p>
    </div>
  )
}
```

### 5. 在应用中使用

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

## 📖 核心概念

### 约定式路由

基于文件系统的路由约定，通过文件和目录结构自动生成路由配置：

- `page.tsx` - 页面组件
- `page.data.ts` - 页面数据加载 loader
- `layout.tsx` - 布局组件
- `layout.data.ts` - 布局数据加载 loader
- `loading.tsx` - 加载状态组件
- `error.tsx` - 错误边界组件
- `loader.ts` - 数据加载器

### 动态路由

使用方括号创建动态路由：

```
src/routes/
├── users/
│   ├── [id]/
│   │   └── page.tsx    # /users/:id
│   └── [id]/
│       └── edit/
│           └── page.tsx # /users/:id/edit
```

### 类型安全

自动生成类型定义，提供完整的 TypeScript 支持：

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// 类型安全的导航
navigate('/users/123')  // ✅ 正确
navigate('/invalid')    // ❌ TypeScript 错误
```

## 🎯 示例

查看完整的示例项目：

- [Vite + Keep Alive Tabs](./examples/vite-keep-alive-tabs) - 带有标签页保活功能的 Vite 应用
- [Rspack Admin Dashboard](./examples/kn-admin) - 基于 Rspack 的管理后台应用

## 📚 文档

完整的文档和 API 参考请访问：[https://givingwu.github.io/fs-router/](https://givingwu.github.io/fs-router/)

- [介绍](/docs/guide/start/introduction.md)
- [快速开始](/docs/guide/start/getting-started.md)
- [基础用法](/docs/guide/basic/file-based-routing.md)
- [高级特性](/docs/guide/advanced/type-safety.md)
- [API 参考](/docs/api/index.md)

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](./docs/contributing/index.md) 了解如何参与项目开发。

## 🙏 致谢

本项目的灵感来源于以下优秀的开源项目：

- [Modern.js](https://github.com/web-infra-dev/modern.js) - 约定式路由设计参考
- [Next.js App Router](https://nextjs.org/docs/app) - 文件系统路由约定
- [Remix File System Route Convention](https://remix.run/docs/en/main/start/v2#file-system-route-convention)
- [@TanStack/react-router](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing) - 类型安全实现参考
- [@loadable/component](https://github.com/gregberge/loadable-components) - 代码分割实现

## 📄 许可证

[MIT](./LICENSE) © [givingwu](https://github.com/givingwu)
