# fs-router-helper Skill 设计文档

**日期：** 2026-04-01
**目标用户：** @feoe/fs-router 库使用者
**使用方式：** 自然语言交互

## 概述

创建一个单一通用 skill，帮助使用 @feoe/fs-router 的开发者快速完成项目初始化、添加页面/路由、调试问题和查询 API 文档。

## 触发条件

当用户请求包含以下关键词或意图时激活：
- **初始化：** "初始化"、"新建项目"、"setup"、"init"
- **添加页面：** "添加页面"、"新建路由"、"add page"、"create route"
- **调试：** "路由问题"、"调试"、"debug"、"不生效"、"404"
- **文档查询：** "fs-router API"、"文档"、"如何使用"、"怎么"

## 功能模块

### 1. 项目初始化

**检测条件：** 项目中没有 `vite.config.ts` / `rspack.config.js` / `webpack.config.js`，或没有 `routes` 目录。

**流程：**
1. 询问用户使用的构建工具（Vite / Rspack / Webpack）
2. 检测项目是否已安装 React 和 React Router
3. 创建 `src/routes` 目录结构
4. 创建完整的文件模板
5. 更新构建配置文件
6. 安装依赖（如需要）

**文件模板结构：**
```
src/routes/
├── layout.tsx        # 根布局（带导航示例）
├── layout.data.ts    # 布局数据加载器（示例）
├── page.tsx          # 首页组件
├── page.data.ts      # 页面数据加载器（示例）
├── loading.tsx       # 全局加载状态组件
└── error.tsx         # 全局错误边界组件
```

**模板内容：**
- `layout.tsx` - 包含导航菜单和 Outlet
- `loading.tsx` - 带骨架屏或 Spinner 的加载 UI
- `error.tsx` - 带重试按钮的错误页面
- `*.data.ts` - 模拟异步数据加载示例

### 2. 添加页面/路由

**检测条件：** 项目中已存在 `routes` 目录和构建配置。

**支持的添加类型：**

| 类型 | 文件结构 | 示例 |
|------|----------|------|
| 基础页面 | `path/page.tsx` | `/about` |
| 嵌套布局 | `path/layout.tsx` + `path/page.tsx` | `/dashboard` |
| 动态路由 | `path/[param]/page.tsx` | `/users/:id` |
| 嵌套动态 | `path/[param]/sub/page.tsx` | `/users/:id/posts` |

**流程：**
1. 询问页面路径（如 `/users/[id]/settings`）
2. 解析路径，确定需要创建的文件
3. 询问是否需要 `layout.tsx`、`loading.tsx`、`error.tsx`
4. 按约定创建文件和组件
5. 自动更新父级 layout（如需要）

**智能特性：**
- 自动创建中间目录
- 检测路径冲突
- 支持批量添加

### 3. 调试问题

**检测条件：** 用户提到"不工作"、"错误"、"问题"、"调试"等关键词。

**常见问题诊断：**

| 问题症状 | 检查项 | 解决方案 |
|----------|--------|----------|
| 路由 404 | 配置文件、routes 目录 | 检查构建配置 |
| 类型错误 | generated routes 文件 | 重新生成类型 |
| 页面空白 | layout.tsx、Outlet | 检查组件结构 |
| 热更新失败 | 开发服务器配置 | 重启 dev server |

**诊断流程：**
1. 读取构建配置文件
2. 检查 `routes` 目录结构
3. 检查生成的路由文件（如 `src/routes.tsx`）
4. 检查是否有语法错误
5. 提供具体的修复建议

### 4. API 文档查询

**检测条件：** 用户询问"如何"、"API"、"文档"、"用法"等。

**知识库内容：**

| 类别 | 内容 |
|------|------|
| 文件约定 | page.tsx、layout.tsx、loading.tsx、error.tsx 的用途 |
| 数据加载 | page.data.ts、layout.data.ts、loader.ts 的使用 |
| 动态路由 | `[param]` 语法、获取参数的方式 |
| 类型安全 | 类型定义、导航类型、params 类型 |
| 配置选项 | routesDirectory、generatedRoutesPath 等 |

**响应方式：**
- 直接回答（简单问题）
- 提供代码示例（中等复杂度）
- 引用在线文档（复杂问题）

## 技术实现

### 文件位置
`.claude/skills/fs-router-helper.md`

### 检测逻辑
```javascript
// 伪代码示例
function shouldActivate(userInput, projectState) {
  const hasRoutesDir = exists('src/routes')
  const hasConfig = hasRouterConfig()

  if (!hasRoutesDir || !hasConfig) {
    return userWantsInit(userInput)
  }

  if (hasRoutesDir && hasConfig) {
    return userWantsAddPage(userInput) ||
           userWantsDebug(userInput) ||
           userWantsDocs(userInput)
  }

  return false
}
```

### 项目状态检测
- 检查 `src/routes` 目录是否存在
- 检查构建配置文件中的 fs-router 插件
- 检查 `package.json` 中的依赖

## 后续步骤

1. 创建 skill 文件 `.claude/skills/fs-router-helper.md`
2. 编写详细的触发规则和处理逻辑
3. 测试各种使用场景
4. 发布到 npm 包或作为独立 skill 分发
