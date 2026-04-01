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
