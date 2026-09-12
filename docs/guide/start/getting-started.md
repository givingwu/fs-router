# 快速开始

本指南对应尚未发布的 **0.1.0 候选版本**。先运行仓库内的最小示例，再把配置迁到现有应用；不要将 npm 上的旧版本当作本指南的实现。

## 运行最小示例

使用 Node.js 22.12+ 或 24 LTS 的最新安全补丁、pnpm 10.34.5：

```sh
git clone https://github.com/givingwu/fs-router.git
cd fs-router
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run dev
```

访问终端显示的本地地址。首页有计数按钮、类型约束的导航；打开 `/users/42` 可看到 loader 返回的虚构用户。无需后端、账号或环境变量。

`example:setup` 先构建/检查本地包，再将 tarball 安装到示例。示例的公共依赖由独立 npm 锁文件固定；库本身使用此次构建的字节，不从 workspace 源码偷渡导入。重跑 setup 会重置示例依赖并安装新包，保留源文件。

```sh
# 三种构建器 + 严格类型检查；先生成路由，再执行 tsc
npm --prefix examples/minimal-react run build:all
npm --prefix examples/minimal-react run preview
```

源码：[examples/minimal-react](https://github.com/givingwu/fs-router/tree/main/examples/minimal-react)。[支持矩阵](../compatibility.md) 列出实际版本。

示例使用配对的 React/React DOM 18.3.1、类型 18.3.31/18.3.7 与 Vite 6.4.3/React 插件 4.7.0。更新时应成套核对 peer 范围；库的 React 19.2.8 支持由独立 tarball 消费者验证，不能混装 React 19 与 DOM 18。主版本升级流程见[依赖更新](../../contributing/development.md#依赖更新)。

## 接入已有 Vite 应用

在仓库根目录完成 `example:setup` 后，将 `.artifacts/feoe-fs-router-0.1.0.tgz` 复制到应用目录，安装它及 peer 依赖：

```sh
npm install ./feoe-fs-router-0.1.0.tgz react@18.3.1 react-dom@18.3.1 react-router-dom@7.18.3 @loadable/component@5.16.7
npm install -D vite@6.4.3 @vitejs/plugin-react@4.7.0 typescript@5.9.3 @types/react@18.3.31 @types/react-dom@18.3.7 @types/loadable__component@5.13.10
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fileBasedRouter from '@feoe/fs-router/vite';

export default defineConfig({ plugins: [react(), fileBasedRouter()] });
```

创建以下两个文件。根布局必需，且必须用 `Outlet` 渲染子页面：

```tsx
// src/routes/layout.tsx
import { Outlet } from 'react-router-dom';
export default function Layout() { return <main><Outlet /></main>; }
```

```tsx
// src/routes/page.tsx
export default function Home() { return <h1>Hello fs-router</h1>; }
```

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);
createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
```

在 `index.html` 中保留 `<div id="root"></div>` 和指向 `/src/main.tsx` 的模块脚本。运行 Vite 后生成 `src/routes.tsx` 与 `src/routes-type.ts`；两者在扫描目录外，并纳入 `tsconfig.json` 的 `include: ["src"]`。建议忽略生成文件，提交约定文件。

构建脚本应为 `vite build && tsc --noEmit`，因为干净检出时必须先生成声明。采用 `moduleResolution: "Bundler"`、`jsx: "react-jsx"` 和 strict 模式，完整配置见示例。

## 下一步

- [文件约定](../basic/file-based-routing.md)：加入动态页面、布局、错误边界。
- [数据获取](../advanced/data-fetch.md)：客户端 loader/action 与加载状态。
- [Hook API](../../api/hooks.md)：类型约束的导航。
- [Rspack](../../examples/rspack-integration.md) / [Webpack](../../examples/webpack-integration.md)：使用同一示例的真实配置。
- [故障排查](../faq/troubleshooting.md)：生成、类型与部署问题。
