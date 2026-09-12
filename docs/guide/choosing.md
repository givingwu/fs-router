# 是否适合你的 React 应用

`@feoe/fs-router` 为现有 React Router 客户端应用增加文件约定和导航声明，生成普通 TSX，由应用创建 `createBrowserRouter`。适合愿意采用 `page.tsx` / `layout.tsx` 等约定、同时保留 Vite/Webpack/Rspack 构建配置的开发者。核验日期：2026-09-12；本页讨论未发布的 0.1.0 候选版。

## 先按需求选方向

| 你的需求 | 可考虑的方向 | 需要付出的成本或限制 |
| --- | --- | --- |
| 已有 React Router Data Router，路由清单重复维护，希望由文件生成 | 试用 fs-router；保留应用自己的 router 创建与部署方式 | 采用本项目文件约定、生成步骤、peer 版本；类型化导航依赖生成声明。候选版需本地 tarball |
| 路由少，显式配置易读，或需要完全控制动态路由对象 | 继续手写 React Router route objects | 不必增加文件生成器；是否值得转文件约定取决于维护成本 |
| 需要与路由模块、构建和渲染策略协同的方案 | 评估 React Router Framework Mode | 官方区分 Declarative、Data、Framework 模式；按应用需要接受相应构建约定，而不是把 fs-router 当作框架功能替代品 |
| 愿意采用另一套路由 API，并希望使用它的文件树生成与类型机制 | 评估 TanStack Router | 官方同样提供文件路由及 Vite、Rspack/Rsbuild、Webpack 集成；三构建器不是本项目独有优势。需评估从 React Router 的 API/文件约定迁移 |
| 需要框架管理服务器渲染与页面/布局边界 | 评估 Next.js App Router 等框架 | Next.js 有自己的页面/布局约定及服务端模型；fs-router 的客户端 loader 不提供同样的服务器隔离或部署能力 |

上述上游描述来自 [React Router modes](https://reactrouter.com/start/modes)、[TanStack 文件路由](https://tanstack.com/router/latest/docs/routing/file-based-routing) 和 [Next.js pages/layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages)，核验的是当日官方文档。上游最新版页面不能用来扩大本项目固定在 Router DOM 7.18.3 等组合上的[兼容性证据](./compatibility.md)。选型建议是基于这些机制和本项目实现的判断，不是竞品完整评测。

## 能证明什么

- `examples/minimal-react` 和 `tests/browser/example.spec.ts` 覆盖三个构建器的用户页导航、客户端 loader、错误边界、catch-all、深链接刷新及非根组件 chunk 加载。
- `tests/consumers/verify.mjs` 从 tarball 检查 React 18/19、ESM/CJS/声明入口、未知路径/遗漏参数类型错误和三构建器生成/监听行为。
- `tests/watch-recovery.test.ts` 覆盖 Webpack/Rspack 在路由生成失败后的恢复。Vite 组件编辑由应用的 React 插件处理；结构变更可以导致整页刷新。

复现命令及每次执行的环境见[演示](../contributing/communication.md)和[验证记录](https://github.com/givingwu/fs-router/blob/main/.github/docs-validation-2026-09-12.md)。这些结果证明所列场景可用，不证明所有业务应用兼容，也没有测出性能优势、减少多少工时或成熟度排名。

## 接入前确认的限制

只承诺[矩阵](./compatibility.md)中的组合。Router 6/8、新构建器主版本、Windows/Bun/Deno、SSR/RSC 和其他浏览器不能从名称推断受支持。loader/action 会进入客户端模块图，不能放服务端秘密。loader 返回类型不自动生成，`*.config.ts` 合并和独立 `loader.ts` 等旧声明未实现；类型路径也不验证业务输入。

“增量接入”指先在现有应用的独立分支里验证一个受控场景，并保留构建器与 router 的控制权。示例没有证明任意旧路由树可直接拼接：混合手写/生成路由时仍需审查 path、id、layout、basename 和 catch-all 冲突，再补业务级测试。先跑候选包示例，记录必须迁移的约定与版本；不能满足需求时保留原方案并反馈阻碍，比强行全面迁移更有价值。

[运行最小示例](./start/getting-started.md) · [提交试用反馈](../contributing/adoption.md)
