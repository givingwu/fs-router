# AGENTS.md

> 本文档为 AI Agent 和 LLM 提供项目开发指南

## 项目概述

`@feoe/fs-router` 是一个基于文件系统的约定式路由解决方案，为 React 应用提供类型安全的路由。

### 核心功能

- **约定式路由**: 基于文件系统自动生成路由配置
- **类型安全**: 完整的 TypeScript 支持
- **构建工具集成**: 支持 Vite、Webpack、Rspack
- **代码分割**: 默认启用懒加载
- **热更新**: 开发时自动重新生成路由

### 技术栈

- **Runtime**: React 18+, React Router v6+
- **Build**: rslib (基于 Rspack)
- **Test**: Vitest
- **Docs**: Rspress
- **Package Manager**: pnpm

---

## 项目架构

```
src/
├── core/           # 核心解析逻辑
│   ├── path-parser.ts       # 路径解析 (动态路由、索引路由)
│   └── route-file-parser.ts # 路由文件解析
├── hooks/          # React Hooks
│   └── use-navigation.ts    # 类型安全的导航 hook
├── plugin/         # 构建工具插件
│   ├── factory.ts           # 插件工厂 (unplugin)
│   ├── generator.ts         # 路由代码生成器
│   ├── vite.ts              # Vite 插件
│   ├── webpack.ts           # Webpack 插件
│   └── rspack.ts            # Rspack 插件
├── router/         # 路由生成核心
│   ├── extractor.ts         # 路由文件提取
│   ├── generator.ts         # 路由配置生成
│   ├── route-type-generator.ts  # 类型生成
│   └── templates.ts         # 代码模板
└── types/          # 类型定义
```

---

## 开发指南

### 路由文件约定

| 文件名 | 用途 |
|--------|------|
| `page.tsx` | 页面组件 |
| `page.data.ts` | 页面数据加载器 (loader) |
| `layout.tsx` | 布局组件 |
| `layout.data.ts` | 布局数据加载器 |
| `loading.tsx` | 加载状态组件 |
| `error.tsx` | 错误边界组件 |
| `loader.ts` | 数据加载器 (Remix 风格) |

### 动态路由语法

- `[param]` - 动态参数 (`/users/:id`)
- `[...param]` - 捕获所有剩余路径 (`/files/*`)

---

## 构建和测试

### 开发

```bash
# 监听模式构建
pnpm dev

# 运行测试
pnpm test

# 文档开发
pnpm docs:dev
```

### 发布前

```bash
# 完整构建
pnpm build

# 运行测试
pnpm test

# 文档构建
pnpm docs:build
```

---

## 代码规范

### TypeScript

- 使用 `strict` 模式
- 导出类型优先使用 `export type`
- 避免使用 `any`，使用 `unknown` 或具体类型

### 命名约定

- **文件名**: kebab-case (`route-file-parser.ts`)
- **组件**: PascalCase (`RouteGenerator`)
- **函数/变量**: camelCase (`generateRoutes`)
- **常量**: UPPER_SNAKE_CASE (`ROUTE_FILE_EXTENSIONS`)
- **类型/接口**: PascalCase (`RouteConfig`)

### 导出规范

```typescript
// 内部实现 - 不导出
function internalHelper() {}

// 公共 API - 具名导出
export function generateRoutes() {}
export type RouteConfig = {};

// 插件入口 - 默认导出
export default function createPlugin() {}
```

---

## 关键模块说明

### 路由提取 (router/extractor.ts)

扫描指定目录，识别路由文件，构建路由树结构。

### 路由生成 (router/generator.ts)

将路由树转换为 React Router 配置，生成路由代码。

### 插件工厂 (plugin/factory.ts)

使用 unplugin 创建跨构建工具的统一插件接口。

### 类型生成 (router/route-type-generator.ts)

生成类型安全的路由路径和参数类型定义。

---

## 常见任务

### 添加新的路由文件类型

1. 在 `router/constants.ts` 添加扩展名
2. 在 `core/route-file-parser.ts` 添加解析逻辑
3. 更新 `router/templates.ts` 代码模板

### 添加新的构建工具支持

1. 在 `plugin/` 创建新文件
2. 使用 `plugin/factory.ts` 的 `createPlugin` 工厂
3. 在 `package.json` 添加导出配置

### 调试路由生成

在开发模式下，插件会输出生成的路由代码到配置的 `generatedRoutesPath`。

---

## 测试策略

- **单元测试**: 核心模块 (path-parser, route-file-parser)
- **集成测试**: 完整路由生成流程
- **E2E 测试**: 使用 examples/ 目录下的示例项目

---

## 文档

文档使用 Rspress 构建，源文件位于 `docs/` 目录。

- 修改文档后运行 `pnpm docs:dev` 预览
- 发布前运行 `pnpm docs:build` 构建
