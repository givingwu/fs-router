# 基础使用

完整安装步骤见[快速开始](../start/getting-started.md)。库生成 `routes`，应用自行创建 `createBrowserRouter(routes)` 并渲染 `RouterProvider`。

## 添加页面

创建 `src/routes/about/page.tsx`：

```tsx
export default function About() { return <h1>About</h1>; }
```

开发服务器会重新生成路由；访问 `/about`。所有布局都要用 `Outlet` 显示子页面。生产环境的客户端路由需要主机把深链接回退到应用 HTML。

## 导航

普通链接可使用 React Router 的 `Link`；它不带本库生成的路径检查。要在 TypeScript 中约束路由，使用本库 hook（先创建 `users/[id]/page.tsx`）：

```tsx
import { useNavigation } from '@feoe/fs-router';
export default function OpenUser() {
  const navigation = useNavigation();
  return <button onClick={() => navigation.push('/users/:id', { id: '42' })}>打开用户</button>;
}
```

不要与 React Router 同名的 `useNavigation` 混淆，后者读取 pending 导航状态。详见 [Hook API](../../api/hooks.md)。
