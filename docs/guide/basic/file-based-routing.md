# 约定式路由

扫描目录默认为 `src/routes`。页面、布局、加载占位与错误边界均使用默认导出的 React 组件。

## 文件名

| 文件 | 行为 |
| --- | --- |
| `layout.tsx` | 布局；根布局必需；通过 `Outlet` 渲染后代 |
| `page.tsx` | 当前目录的索引页面 |
| `page.data.ts` / `layout.data.ts` | 具名 `loader`、可选具名 `action` |
| `page.loader.ts` / `layout.loader.ts` | 默认导出的 loader |
| `page.data.client.ts` | 兼容数据模块；也进入客户端 bundle，不是隔离边界 |
| `loading.tsx` | 非根组件懒加载时的占位；不是网络 loader 的全局 pending UI |
| `error.tsx` | Router 错误边界 |
| `$.tsx` | 当前目录的通配页面，可搭配 `$.data.ts` |

单独 `loader.ts`、`not-found.tsx` 和任意页面组件中的具名 loader 不会被自动接线。`*.config.ts` 的运行时配置合并未实现。404 可用 `$.tsx`。

## 路径规则

| 相对 `src/routes` 的文件 | URL 模式 |
| --- | --- |
| `page.tsx` | `/` |
| `about/page.tsx` | `/about` |
| `users/[id]/page.tsx` | `/users/:id` |
| `users/[[id]]/page.tsx` | `/users/:id?` |
| `users/[id$]/page.tsx` | `/users/:id?`（另一种写法） |
| `files/[...path]/page.tsx` | `/files/*` |
| `$.tsx` | `/*` |
| `(public)/about/page.tsx` | `/about` |
| `__public/about/page.tsx` | `/about` |
| `account.settings/page.tsx` | `/account/settings` |

`[[...path]]` 没有支持承诺。不要同时创建表中映射相同路径的文件；重复约定、route id 或等价终端路由会使构建失败。

## 布局

```tsx
// src/routes/layout.tsx
import { Outlet } from 'react-router-dom';
export default function Layout() {
  return <main><Outlet /></main>;
}
```

子目录可有自己的布局，路由组保留布局嵌套而不增加 URL 段。没有独立布局的页面使用已有祖先布局。

隐藏文件/目录、`node_modules` 与符号链接被跳过。扩展名可配置；输出文件必须在所有扫描目录外。[配置项](../configuration/plugin-options.md) 和[动态路由](./dynamic-routes.md) 有进一步说明。
