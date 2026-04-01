# CLAUDE.md

> 本文档为 Claude Code 和其他 AI 编程助手提供项目上下文

## 项目概述

`@feoe/fs-router` 是一个基于文件系统的约定式路由库，为 React 应用提供类型安全的路由解决方案。

- **仓库**: https://github.com/givingwu/fs-router
- **包名**: `@feoe/fs-router`
- **文档**: https://givingwu.github.io/fs-router/

## 快速参考

### 常用命令

```bash
# 开发模式（监听构建）
pnpm dev

# 完整构建
pnpm build

# 运行测试
pnpm test

# 文档开发
pnpm docs:dev

# 文档构建
pnpm docs:build
```

### 项目结构

```
src/
├── core/           # 核心解析逻辑
├── hooks/          # React Hooks
├── plugin/         # 构建工具插件 (Vite/Webpack/Rspack)
├── router/         # 路由生成核心
└── types/          # 类型定义
```

## 开发规范

### 文件命名

- 源码文件: `kebab-case.ts`
- 组件: `PascalCase`
- 常量: `UPPER_SNAKE_CASE`

### 导出规范

- 公共 API 使用具名导出
- 插件入口使用默认导出
- 类型使用 `export type`

### 路由文件约定

| 文件 | 用途 |
|------|------|
| `page.tsx` | 页面组件 |
| `layout.tsx` | 布局组件 |
| `loading.tsx` | 加载状态 |
| `error.tsx` | 错误边界 |

### 动态路由语法

- `[param]` - 动态参数
- `[...param]` - 捕获所有路径

## 相关文档

- [AGENTS.md](./AGENTS.md) - 详细的 AI Agent 开发指南
- [docs/contributing/development.md](./docs/contributing/development.md) - 开发环境搭建

## 注意事项

1. 使用 pnpm 作为包管理器
2. 推送前会自动运行测试（simple-git-hooks）
3. 代码变更后需要重新构建才能在示例项目中测试
4. TypeScript strict 模式已启用
