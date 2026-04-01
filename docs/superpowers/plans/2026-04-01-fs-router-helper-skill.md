# fs-router-helper Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个 Claude Code skill，帮助 @feoe/fs-router 库使用者快速完成项目初始化、添加页面/路由、调试问题和查询 API 文档。

**Architecture:** 单一 skill 文件 `fs-router-helper.md`，通过关键词匹配和项目状态检测来识别用户意图，引导完成任务。Skill 包含四个核心模块：初始化、添加页面、调试、文档查询。

**Tech Stack:** Markdown (Claude Code skill 格式), JavaScript/TypeScript (用于文件检测和操作)

---

## File Structure

```
.claude/
└── skills/
    └── fs-router-helper.md    # 主 skill 文件（待创建）
```

**Skill 文件职责：**
- 定义触发条件（关键词 + 项目状态）
- 实现四个核心功能模块的逻辑
- 提供文件模板和代码示例
- 定义检测和诊断流程

---

## Task 1: 创建 Skill 文件基础结构

**Files:**
- Create: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 创建 skill 文件并写入 frontmatter 和基础描述**

```markdown
---
name: fs-router-helper
description: Helper for @feoe/fs-router - project initialization, adding pages/routes, debugging, and API documentation
---

Assist users of the @feoe/fs-router library with common tasks:

## When to use this skill

Use this skill when the user asks for help with:
- Project initialization with fs-router
- Adding new pages or routes
- Debugging routing issues
- fs-router API documentation and usage

## How it works

This skill detects the user's intent by:
1. Analyzing keywords in the user's request
2. Checking the project state (config files, routes directory)
3. Guiding the user through the appropriate workflow
```

- [ ] **Step 2: 保存文件**

- [ ] **Step 3: 验证文件已创建**

Run: `ls -la .claude/skills/fs-router-helper.md`
Expected: 文件存在并显示内容

- [ ] **Step 4: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add fs-router-helper skill foundation"
```

---

## Task 2: 实现项目状态检测逻辑

**Files:**
- Modify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 添加状态检测部分**

在 skill 文件中添加：

```markdown
## Project State Detection

Before helping the user, check the following:

1. **Check for routes directory**
   - Run: `ls -la src/routes 2>/dev/null || echo "NOT_FOUND"`
   - Sets: `HAS_ROUTES_DIR` variable

2. **Check for build configuration**
   - Run: `ls -la vite.config.ts rspack.config.js webpack.config.js 2>/dev/null | head -1`
   - Sets: `BUILD_TOOL` variable (vite | rspack | webpack | none)

3. **Check for fs-router in dependencies**
   - Run: `grep -o "@feoe/fs-router" package.json || echo "NOT_FOUND"`
   - Sets: `HAS_FS_ROUTER` variable

4. **Check generated routes file**
   - Run: `ls -la src/routes.tsx src/routes.ts 2>/dev/null || echo "NOT_FOUND"`
   - Sets: `HAS_GENERATED_ROUTES` variable
```

- [ ] **Step 2: 保存文件**

- [ ] **Step 3: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add project state detection logic"
```

---

## Task 3: 实现项目初始化模块

**Files:**
- Modify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 添加初始化模块内容**

```markdown
## Module 1: Project Initialization

### Trigger
- User keywords: "初始化", "新建项目", "setup", "init", "initialize"
- Project state: `HAS_ROUTES_DIR == false` OR `BUILD_TOOL == none`

### Steps

1. **Ask for build tool selection**

If `BUILD_TOOL == none`, ask:
"请选择你使用的构建工具：1. Vite, 2. Rspack, 3. Webpack"

2. **Check and install dependencies**

Run: `grep -E "(react|react-router-dom)" package.json`
If missing, instruct: `pnpm add react react-router-dom`

Run: `grep "@feoe/fs-router" package.json`
If missing, instruct: `pnpm add -D @feoe/fs-router`

3. **Create routes directory structure**

Run:
```bash
mkdir -p src/routes
```

4. **Create file templates**

Create each file with the content below:

#### src/routes/layout.tsx
\`\`\`tsx
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>首页</Link>
        <Link to="/about" style={{ marginRight: '1rem' }}>关于</Link>
      </nav>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
\`\`\`

#### src/routes/page.tsx
\`\`\`tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎使用 @feoe/fs-router</h1>
      <p>这是你的首页，开始编辑 src/routes/page.tsx 吧！</p>
    </div>
  )
}
\`\`\`

#### src/routes/loading.tsx
\`\`\`tsx
export default function LoadingPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
      <style>{\`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  )
}
\`\`\`

#### src/routes/error.tsx
\`\`\`tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? error.statusText || error.data?.message
    : '发生未知错误'

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>出错了</h1>
      <p style={{ color: '#e74c3c' }}>{message}</p>
      <button onClick={() => window.location.reload()}>重试</button>
    </div>
  )
}
\`\`\`

#### src/routes/layout.data.ts
\`\`\`ts
// 这是一个示例数据加载器
// 可以在这里加载全局数据，如用户信息、配置等
export async function loader() {
  return {
    appName: 'My App',
    version: '1.0.0',
  }
}
\`\`\`

#### src/routes/page.data.ts
\`\`\`ts
// 这是一个示例数据加载器
// 可以在这里获取页面数据
export async function loader() {
  return {
    title: '首页',
    message: '欢迎使用 fs-router!',
  }
}
\`\`\`

5. **Update build configuration**

Based on selected build tool, provide config update:

**Vite (vite.config.ts):**
\`\`\`typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { FileBasedRouterVite as fileBasedRouter } from '@feoe/fs-router/vite'

export default defineConfig({
  plugins: [
    react(),
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
})
\`\`\`

**Rspack (rspack.config.js):**
\`\`\`js
const { FileBasedRouterRspack as fileBasedRouter } = require('@feoe/fs-router/rspack')

module.exports = {
  plugins: [
    fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
\`\`\`

**Webpack (webpack.config.js):**
\`\`\`js
const { FileBasedRouterWebpack as fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    new fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
\`\`\`

6. **Update main.tsx**

Ensure src/main.tsx uses the generated routes:
\`\`\`tsx
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
\`\`\`
```

- [ ] **Step 2: 保存文件**

- [ ] **Step 3: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add project initialization module"
```

---

## Task 4: 实现添加页面/路由模块

**Files:**
- Modify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 添加添加页面模块内容**

```markdown
## Module 2: Add Page/Route

### Trigger
- User keywords: "添加页面", "新建路由", "add page", "create route", "添加"
- Project state: `HAS_ROUTES_DIR == true`

### Steps

1. **Parse the requested path**

Ask: "请输入页面路径（例如：/about, /users/[id], /dashboard/settings）"

Parse logic:
- Split by `/` to get segments
- Identify dynamic segments (wrapped in `[]`)
- Build directory structure

2. **Ask for optional components**

For each new route, ask:
- 是否需要 layout.tsx？
- 是否需要 loading.tsx？
- 是否需要 error.tsx？
- 是否需要 data loader (*.data.ts)？

3. **Create the file structure**

Example: For path `/users/[id]/posts`

\`\`\`bash
mkdir -p src/routes/users/[id]/posts
\`\`\`

Create files:

#### src/routes/users/[id]/posts/page.tsx
\`\`\`tsx
// 基于 useParams 获取动态参数
import { useParams } from 'react-router-dom'

export default function PostsPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>用户 {id} 的文章</h1>
      <p>编辑 src/routes/users/[id]/posts/page.tsx 来修改此页面</p>
    </div>
  )
}
\`\`\`

#### src/routes/users/[id]/layout.tsx (if requested)
\`\`\`tsx
import { Outlet, useParams } from 'react-router-dom'

export default function UserLayout() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <aside>用户 {id} 的侧边栏</aside>
      <Outlet />
    </div>
  )
}
\`\`\`

#### src/routes/users/[id]/loading.tsx (if requested)
\`\`\`tsx
export default function UserLoading() {
  return <div>加载中...</div>
}
\`\`\`

#### src/routes/users/[id]/error.tsx (if requested)
\`\`\`tsx
import { useRouteError } from 'react-router-dom'

export default function UserError() {
  const error = useRouteError()
  return (
    <div>
      <h2>加载失败</h2>
      <p>{String(error)}</p>
    </div>
  )
}
\`\`\`

4. **Update parent layout (if needed)**

If the new route has a layout and the parent doesn't have a link to it, suggest adding navigation link.

5. **Verify created files**

Run: `find src/routes -type f -name "*.tsx" -o -name "*.ts" | sort`
Display the new file structure to user.
```

- [ ] **Step 2: 保存文件**

- [ ] **Step 3: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add page/route creation module"
```

---

## Task 5: 实现调试问题模块

**Files:**
- Modify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 添加调试模块内容**

```markdown
## Module 3: Debug Issues

### Trigger
- User keywords: "不工作", "错误", "问题", "调试", "debug", "404", "blank"
- Project state: Any (active routes project)

### Diagnostic Steps

Run each check and report findings:

#### Check 1: Build Configuration

\`\`\`bash
# Check if fs-router plugin is configured
if [ -f "vite.config.ts" ]; then
  grep -i "fs-router\|FileBasedRouter" vite.config.ts || echo "❌ fs-router plugin not found in vite.config.ts"
elif [ -f "rspack.config.js" ]; then
  grep -i "fs-router\|FileBasedRouter" rspack.config.js || echo "❌ fs-router plugin not found in rspack.config.js"
elif [ -f "webpack.config.js" ]; then
  grep -i "fs-router\|FileBasedRouter" webpack.config.js || echo "❌ fs-router plugin not found in webpack.config.js"
else
  echo "❌ No build configuration found"
fi
\`\`\`

**If missing:** Provide the correct configuration snippet from Module 1.

#### Check 2: Routes Directory

\`\`\`bash
if [ -d "src/routes" ]; then
  echo "✅ src/routes directory exists"
  find src/routes -type f -name "*.tsx" -o -name "*.ts" | head -20
else
  echo "❌ src/routes directory not found"
fi
\`\`\`

**If missing:** Run Module 1 to initialize.

#### Check 3: Generated Routes File

\`\`\`bash
if [ -f "src/routes.tsx" ] || [ -f "src/routes.ts" ]; then
  echo "✅ Generated routes file exists"
  head -30 "$(find src -maxdepth 1 -name 'routes.ts*')"
else
  echo "❌ Generated routes file not found"
  echo "💡 Try restarting your dev server to regenerate routes"
fi
\`\`\`

#### Check 4: Required Root Layout

\`\`\`bash
if [ -f "src/routes/layout.tsx" ]; then
  if grep -q "Outlet" src/routes/layout.tsx; then
    echo "✅ Root layout with Outlet found"
  else
    echo "⚠️ Root layout missing <Outlet /> component"
  fi
else
  echo "❌ src/routes/layout.tsx not found (required)"
fi
\`\`\`

#### Check 5: Main Entry Point

\`\`\`bash
if [ -f "src/main.tsx" ]; then
  if grep -q "routes" src/main.tsx; then
    echo "✅ main.tsx imports routes"
  else
    echo "⚠️ main.tsx may not be using generated routes"
    echo "💡 Ensure you have: import { routes } from './routes'"
  fi
else
  echo "❌ src/main.tsx not found"
fi
\`\`\`

#### Check 6: Dependencies

\`\`\`bash
echo "Checking dependencies..."
grep -E "(react|react-router-dom|@feoe/fs-router)" package.json || echo "❌ Missing dependencies"
\`\`\`

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Routes 404 | Check build config has fs-router plugin |
| Type errors | Delete src/routes.tsx and restart dev server |
| Blank page | Check root layout has <Outlet /> |
| Hot reload not working | Restart dev server |
| Dynamic params not working | Check useParams usage with correct param name |
```

- [ ] **Step 2: 保存文件**

- [ ] **Step 3: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add debug module"
```

---

## Task 6: 实现 API 文档查询模块

**Files:**
- Modify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 添加文档查询模块内容**

```markdown
## Module 4: API Documentation

### Trigger
- User keywords: "如何", "API", "文档", "用法", "怎么", "how to", "docs"

### Knowledge Base

#### File Conventions

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Page component | Yes for routes |
| `layout.tsx` | Layout wrapper with Outlet | Yes for nested routes |
| `loading.tsx` | Loading state UI | Optional |
| `error.tsx` | Error boundary | Optional |
| `page.data.ts` | Page data loader | Optional |
| `layout.data.ts` | Layout data loader | Optional |
| `loader.ts` | Alternative data loader | Optional |

#### Dynamic Routes

Create dynamic segments using square brackets:

\`\`\`
src/routes/
├── users/
│   └── [id]/           # /users/:id
│       └── page.tsx
│       └── posts/
│           └── page.tsx  # /users/:id/posts
\`\`\`

Access params:

\`\`\`tsx
import { useParams } from 'react-router-dom'

const { id } = useParams<{ id: string }>()
\`\`\`

#### Type Safety

Generated routes include TypeScript types:

\`\`\`tsx
import { routes } from './routes'
import type { RouteNames } from './routes'

// Type-safe path (if using typed navigation)
// The generated routes.tsx exports all route types
\`\`\`

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routesDirectory` | string | `'src/routes'` | Routes source directory |
| `generatedRoutesPath` | string | `'src/routes.tsx'` | Generated file path |

#### Data Loading

\`\`\`ts
// page.data.ts or layout.data.ts
export async function loader({ request, params }) {
  // Fetch data
  const data = await fetch(`/api/items/${params.id}`)
  return data.json()
}

// Use in component
import { useLoaderData } from 'react-router-dom'
const data = useLoaderData()
\`\`\`

### External Resources

- Full documentation: https://givingwu.github.io/fs-router/
- GitHub repo: https://github.com/givingwu/fs-router
- NPM: https://www.npmjs.com/package/@feoe/fs-router
```

- [ ] **Step 2: 保存文件**

- [ ] **Step 3: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add API documentation module"
```

---

## Task 7: 添加 Skill 使用说明和测试

**Files:**
- Modify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 添加使用说明部分**

```markdown
## Usage Examples

### Example 1: Initialize new project

User: "帮我初始化一个使用 fs-router 的项目"

Assistant:
1. Detects no routes directory
2. Asks for build tool preference
3. Creates all necessary files
4. Provides configuration updates

### Example 2: Add a new page

User: "添加一个用户详情页面 /users/[id]"

Assistant:
1. Detects existing routes directory
2. Creates `src/routes/users/[id]/page.tsx`
3. Asks about additional components
4. Creates requested files

### Example 3: Debug routing issue

User: "我的路由不工作，总是 404"

Assistant:
1. Runs diagnostic checks
2. Identifies missing plugin in config
3. Provides fix

### Example 4: API question

User: "如何在 fs-router 中使用动态路由参数？"

Assistant:
1. Explains `[param]` syntax
2. Shows useParams example
3. Links to full documentation
```

- [ ] **Step 2: 添加测试验证步骤**

```markdown
## Testing the Skill

After installation, verify it works:

1. **Test trigger detection**
   - Say: "帮我初始化 fs-router 项目"
   - Expected: Skill activates and offers initialization

2. **Test page creation**
   - Say: "添加一个关于页面 /about"
   - Expected: Creates src/routes/about/page.tsx

3. **Test debugging**
   - Say: "我的路由不工作"
   - Expected: Runs diagnostic checks

4. **Test documentation**
   - Say: "如何使用 data loader?"
   - Expected: Provides loader documentation
```

- [ ] **Step 3: 保存文件**

- [ ] **Step 4: 提交**

```bash
git add .claude/skills/fs-router-helper.md
git commit -m "feat: add usage examples and testing guide"
```

---

## Task 8: 创建 Skill 使用文档

**Files:**
- Create: `.claude/skills/README.md`

- [ ] **Step 1: 创建 README**

```markdown
# fs-router Skills

This directory contains skills to help with the @feoe/fs-router library.

## fs-router-helper

Helper skill for @feoe/fs-router users. Provides:

- **Project Initialization**: Set up a new project with fs-router
- **Page/Route Creation**: Add new pages and routes
- **Debugging**: Diagnose and fix common routing issues
- **Documentation**: Quick API reference and usage examples

### Installation

The skill is automatically activated when you mention:
- fs-router initialization
- Adding pages or routes
- Routing issues
- fs-router API questions

### Examples

\`\`\`
# Initialize a project
"帮我初始化一个使用 fs-router 的项目"

# Add a page
"添加一个用户详情页面 /users/[id]"

# Debug
"我的路由不工作，总是 404"

# Documentation
"如何在 fs-router 中使用动态路由参数？"
\`\`\`
```

- [ ] **Step 2: 提交**

```bash
git add .claude/skills/README.md
git commit -m "docs: add skills README"
```

---

## Task 9: 最终验证

**Files:**
- Verify: `.claude/skills/fs-router-helper.md`

- [ ] **Step 1: 验证 skill 文件完整性**

Run: `wc -l .claude/skills/fs-router-helper.md`
Expected: 文件应包含所有 4 个模块

- [ ] **Step 2: 验证 Markdown 语法**

Run: `cat .claude/skills/fs-router-helper.md | head -50`
Expected: 正确的 frontmatter 和 Markdown 格式

- [ ] **Step 3: 最终提交**

```bash
git add .claude/
git commit -m "feat: complete fs-router-helper skill implementation

- Project initialization with full file structure
- Page/route creation with support for dynamic routes
- Debugging module with diagnostic checks
- API documentation with quick reference

See docs/superpowers/plans/2026-04-01-fs-router-helper-skill.md for details."
```

---

## Post-Implementation

After the skill is implemented:

1. **Test in a real project** - Create a test project and verify each module works
2. **Collect feedback** - Note any issues or edge cases
3. **Iterate** - Update the skill based on real usage
4. **Document** - Add examples to the project README

## References

- Design spec: `docs/superpowers/specs/2026-04-01-fs-router-helper-skill-design.md`
- fs-router docs: https://givingwu.github.io/fs-router/
- fs-router repo: https://github.com/givingwu/fs-router
