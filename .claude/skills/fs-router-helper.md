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
```tsx
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
```

#### src/routes/page.tsx
```tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎使用 @feoe/fs-router</h1>
      <p>这是你的首页，开始编辑 src/routes/page.tsx 吧！</p>
    </div>
  )
}
```

#### src/routes/loading.tsx
```tsx
export default function LoadingPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
      <style>{`
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
      `}</style>
    </div>
  )
}
```

#### src/routes/error.tsx
```tsx
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
```

#### src/routes/layout.data.ts
```ts
// 这是一个示例数据加载器
// 可以在这里加载全局数据，如用户信息、配置等
export async function loader() {
  return {
    appName: 'My App',
    version: '1.0.0',
  }
}
```

#### src/routes/page.data.ts
```ts
// 这是一个示例数据加载器
// 可以在这里获取页面数据
export async function loader() {
  return {
    title: '首页',
    message: '欢迎使用 fs-router!',
  }
}
```

5. **Update build configuration**

Based on selected build tool, provide config update:

**Vite (vite.config.ts):**
```typescript
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
```

**Rspack (rspack.config.js):**
```js
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

**Webpack (webpack.config.js):**
```js
const { FileBasedRouterWebpack as fileBasedRouter } = require('@feoe/fs-router/webpack')

module.exports = {
  plugins: [
    new fileBasedRouter({
      routesDirectory: 'src/routes',
      generatedRoutesPath: 'src/routes.tsx'
    })
  ]
}
```

6. **Update main.tsx**

Ensure src/main.tsx uses the generated routes:
```tsx
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

```bash
mkdir -p src/routes/users/[id]/posts
```

Create files:

#### src/routes/users/[id]/posts/page.tsx
```tsx
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
```

#### src/routes/users/[id]/layout.tsx (if requested)
```tsx
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
```

#### src/routes/users/[id]/loading.tsx (if requested)
```tsx
export default function UserLoading() {
  return <div>加载中...</div>
}
```

#### src/routes/users/[id]/error.tsx (if requested)
```tsx
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
```

4. **Update parent layout (if needed)**

If the new route has a layout and the parent doesn't have a link to it, suggest adding navigation link.

5. **Verify created files**

Run: `find src/routes -type f -name "*.tsx" -o -name "*.ts" | sort`
Display the new file structure to user.

## Module 3: Debug Issues

### Trigger
- User keywords: "不工作", "错误", "问题", "调试", "debug", "404", "blank"
- Project state: Any (active routes project)

### Diagnostic Steps

Run each check and report findings:

#### Check 1: Build Configuration

```bash
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
```

**If missing:** Provide the correct configuration snippet from Module 1.

#### Check 2: Routes Directory

```bash
if [ -d "src/routes" ]; then
  echo "✅ src/routes directory exists"
  find src/routes -type f \( -name "*.tsx" -o -name "*.ts" \) | head -20
else
  echo "❌ src/routes directory not found"
fi
```

**If missing:** Run Module 1 to initialize.

#### Check 3: Generated Routes File

```bash
if [ -f "src/routes.tsx" ] || [ -f "src/routes.ts" ]; then
  echo "✅ Generated routes file exists"
  head -30 "$(find src -maxdepth 1 -name 'routes.ts*')"
else
  echo "❌ Generated routes file not found"
  echo "💡 Try restarting your dev server to regenerate routes"
fi
```

#### Check 4: Required Root Layout

```bash
if [ -f "src/routes/layout.tsx" ]; then
  if grep -q "Outlet" src/routes/layout.tsx; then
    echo "✅ Root layout with Outlet found"
  else
    echo "⚠️ Root layout missing <Outlet /> component"
  fi
else
  echo "❌ src/routes/layout.tsx not found (required)"
fi
```

#### Check 5: Main Entry Point

```bash
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
```

#### Check 6: Dependencies

```bash
echo "Checking dependencies..."
grep -E "(react|react-router-dom|@feoe/fs-router)" package.json || echo "❌ Missing dependencies"
```

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Routes 404 | Check build config has fs-router plugin |
| Type errors | Delete src/routes.tsx and restart dev server |
| Blank page | Check root layout has <Outlet /> |
| Hot reload not working | Restart dev server |
| Dynamic params not working | Check useParams usage with correct param name |
