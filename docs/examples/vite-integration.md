# Vite 集成示例

按[快速开始](../guide/start/getting-started.md) 执行 `example:setup`。最小示例固定 Vite 6.4.3 与 React 插件 4.7.0。

```ts
// examples/minimal-react/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fileBasedRouter from '@feoe/fs-router/vite';

export default defineConfig({
  plugins: [react(), fileBasedRouter()],
  build: { outDir: 'dist/vite' },
});
```

```sh
npm --prefix examples/minimal-react run dev
npm --prefix examples/minimal-react run build
npm --prefix examples/minimal-react run preview
```

build 顺序是 `vite build && tsc --noEmit`，确保干净目录先生成路由/声明。dev 使用 React 插件处理组件 Fast Refresh；路由结构变化仍可能整页刷新。

[完整源码](https://github.com/givingwu/fs-router/tree/main/examples/minimal-react) 包含 HTML、TS 配置、根布局、动态 loader、错误边界和 404。
