# @feoe/fs-router

为现有 React 应用生成 React Router 路由配置，支持 Vite、Webpack 和 Rspack。约定文件生成普通 TSX，应用自行创建 `createBrowserRouter`，不需要迁入完整框架。

[English](./README.en.md) · [文档](https://givingwu.github.io/fs-router/) · [兼容性与限制](./docs/guide/compatibility.md) · [0.1 迁移](./docs/guide/migration/v0.1.md) · [发布流程](./docs/contributing/release.md)

> 此分支准备 **0.1.0**，尚未发布。npm 上的旧版本不代表本分支的能力；正式发布前可用下述 tarball 验证流程试用。

## 是否适合

适合希望在现有 React/TypeScript 客户端应用中引入文件约定、并保留现有构建工具的开发者。需要 SSR/RSC、服务端 loader、Router 6 或完整框架部署时，本版本不提供这些能力。

## 先运行示例

```sh
git clone https://github.com/givingwu/fs-router.git
cd fs-router
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run dev
# 三种构建器与严格类型检查
npm --prefix examples/minimal-react run build:all
```

[最小示例](./examples/minimal-react) 使用本地 tarball、独立锁文件和虚构数据，包含首页、动态 loader、类型导航、错误边界和 404，无需账户或后端。[完整接入指南](./docs/guide/start/getting-started.md) 包含 HTML、React 插件和生成顺序。

## 支持范围

| 项目 | 本分支验证基线 |
| --- | --- |
| Node.js | 22.12.0、24.20.0；包要求 >=22.12.0 |
| React / React DOM | 配对的 18.3.1 或 19.2.8 |
| React Router DOM | 7.18.3；不再声明支持 Router 6 |
| 构建工具 | Vite 6.4.3、Webpack 5.110.3、Rspack 1.7.12 |
| TypeScript | 5.9.3；公共 API 支持 Bundler / NodeNext ESM、CJS；生成的 TSX 用 Bundler 解析 |

这是经过测试的版本组合，不是对所有历史版本或新主版本的保证。具体环境、复现命令及尚未验证的平台见兼容性页。

## 安装与接入

发布后安装 `@feoe/fs-router@0.1.0`；当前可从源码 `pnpm install --frozen-lockfile && pnpm check:consumers` 生成并验证 `.artifacts/feoe-fs-router-0.1.0.tgz`，再在应用中安装该文件。

应用需要这些 peer 依赖（React 与 React DOM 保持同版本）：

```sh
npm install react@18.3.1 react-dom@18.3.1 react-router-dom@7.18.3 @loadable/component@5.16.7
npm install -D typescript@5.9.3 @types/react@18.3.31 @types/react-dom@18.3.7 @types/loadable__component@5.13.10
```

库根入口含运行时 hook；使用该 hook 的应用应把库放在 `dependencies` 中。构建适配器从子路径导入：

```ts
// vite.config.ts（应用已有 React 插件/JSX 配置）
import { defineConfig } from 'vite';
import fileBasedRouter from '@feoe/fs-router/vite';

export default defineConfig({ plugins: [fileBasedRouter()] });
```

Webpack / Rspack 分别使用 `@feoe/fs-router/webpack`、`@feoe/fs-router/rspack`，支持默认导出以及 `FileBasedRouterWebpack` / `FileBasedRouterRspack` 具名导出。CommonJS 用 `require('@feoe/fs-router/webpack').default`。应用仍需配置 TSX loader 和 `.tsx/.ts` 扩展名解析，完整可执行验证见 `tests/consumers/verify.mjs`。

创建文件：

```text
src/routes/
├── layout.tsx       # 必需的根布局
├── page.tsx         # /
└── users/[id]/
    └── page.tsx     # /users/:id
```

```tsx
// src/routes/layout.tsx
import { Outlet } from 'react-router-dom';
export default function Layout() { return <main><Outlet /></main>; }

// src/routes/page.tsx（users/[id]/page.tsx 同样导出页面组件）
export default function Page() { return <h1>Example</h1>; }
```

启动构建工具后生成 `src/routes.tsx` 和 `src/routes-type.ts`，输出文件须在路由目录外；把它们纳入应用的 TypeScript include。默认不依赖 `@` 别名。

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={createBrowserRouter(routes)} />,
);
```

## 路由与导航

- `page.tsx` / `layout.tsx`：页面、嵌套布局；布局用 `Outlet` 渲染子路由。
- `page.data.ts` / `layout.data.ts`：具名 `loader`，可选具名 `action`。
- `page.loader.ts` / `layout.loader.ts`：默认导出的 loader。单独 `loader.ts` 不受支持。
- `loading.tsx` / `error.tsx`：加载占位、错误边界组件；`splitting: false` 时不生成懒加载占位。
- `[id]`、`[[id]]` / `[id$]`、`[...path]`、`$.tsx`：动态参数、可选参数、通配路由。
- `(group)`、`__group` 不加入 URL；点分目录转换为多段路径。

```tsx
import { useNavigation } from '@feoe/fs-router';

function OpenUser() {
  const navigation = useNavigation();
  return <button onClick={() => navigation.push('/users/:id', { id: '42' })}>Open</button>;
}
```

生成声明后，上述 hook 校验已知路由和参数；React Router 自带的 `useNavigate` 不会因此获得这些约束。类型检查不能替代运行时输入验证。

默认用 `@loadable/component` 分割非根组件；根布局和 loader 保持静态导入。开发中增删路由会重新生成，结构变化可能完整刷新页面。没有发布性能对比数据，不承诺 SSR、RSC 或框架式服务端数据隔离。

## 验证与贡献

```sh
pnpm install --frozen-lockfile
pnpm check && pnpm typecheck && pnpm test
pnpm check:consumers
pnpm docs:build && pnpm docs:check
```

消费者检查实际安装 tarball，在独立目录验证 ESM/CJS、类型、三种构建器、路由匹配、loader/action、导航和增删文件监听。最小示例另有 Chromium 页面验证；其他历史 `examples/` 工程未纳入兼容承诺。

[贡献指南](./CONTRIBUTING.md) · [安全政策](./SECURITY.md) · [MIT](./LICENSE)

技术来源：[Modern.js](https://github.com/web-infra-dev/modern.js)、[Next.js](https://nextjs.org/docs/app)、[React Router](https://reactrouter.com/)、[TanStack Router](https://github.com/TanStack/router)、[Loadable Components](https://github.com/gregberge/loadable-components)。
