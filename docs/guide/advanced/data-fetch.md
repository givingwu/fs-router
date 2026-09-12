# 数据获取

本库把同名数据模块接到 React Router **7 Data Router 的客户端模式**。loader 与 action 都进入浏览器模块图；不要放服务端密钥或仅能在服务器执行的代码。

## 页面 loader

```ts
// src/routes/users/[id]/page.data.ts
import type { LoaderFunctionArgs } from 'react-router-dom';
export function loader({ params }: LoaderFunctionArgs) {
  return { user: { id: params.id ?? 'unknown', name: 'Demo User' } };
}
```

```tsx
// src/routes/users/[id]/page.tsx
import { useLoaderData } from 'react-router-dom';
import type { loader } from './page.data';
export default function User() {
  const { user } = useLoaderData<typeof loader>();
  return <h1>{user.name}: {user.id}</h1>;
}
```

`loader` 接收一个对象 `{ params, request, context }`，不是两个位置参数。读取查询字符串用 `new URL(request.url).searchParams`。真实 fetch 应使用 `request.signal` 支持取消；本示例只返回虚构数据。

## action 与响应

在同一个 `.data.ts` 里具名导出 `action`，使用 React Router 的 `Form` / `useFetcher` 提交。不要放到 `page.tsx` 里期待生成器自动提取。`action` 的业务写入、错误提示和授权校验由应用负责。

旧式 `page.loader.ts` / `layout.loader.ts` 使用默认导出。多个 loader 并存时并行执行，普通对象按 data → clientData → loader 合并；`Response` 原样传递，抛出的错误交给 Router。避免依赖原始值/数组的合并行为；通常为一个路由保留一个数据模块。

loader 返回类型不会自动生成，示例的类型来自显式导入的函数。如果有多个合并 loader，应自行定义实际合并结果类型。更完整边界见[0.1 迁移](../migration/v0.1.md)。

## 加载与错误状态

`loading.tsx` 用于组件分包下载时的占位，不负责覆盖整个 loader 等待过程。导航请求状态使用 React Router 的 hook：

```tsx
import { Outlet, useNavigation } from 'react-router-dom';
export default function Layout() {
  const navigation = useNavigation();
  return <main aria-busy={navigation.state !== 'idle'}><Outlet /></main>;
}
```

初始加载可在应用创建 Router 时给根路由对象增加 `hydrateFallbackElement`（最小示例的 `main.tsx` 包含它）；生成器不会自动提取组件中的 `HydrateFallback` 导出。`error.tsx` 可调用 `useRouteError()` 和 `isRouteErrorResponse()` 显示错误。

上游语义参考 [React Router loader](https://github.com/remix-run/react-router/blob/react-router%407.18.3/docs/start/data/route-object.md#loader) 与 [pending UI](https://github.com/remix-run/react-router/blob/react-router%407.18.3/docs/start/data/pending-ui.md)；这些是 Router 能力，不是本库提供的服务端框架。
