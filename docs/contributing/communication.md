# 演示、发布说明与社区介绍草稿

状态：**可审查草稿，未对外发布或发送**。2026-09-12 的 npm `latest` 为 0.0.13，下文介绍的是仓库 0.1.0 候选版。复制介绍前重新核实版本、链接和演示结果；正式发布使用[发布流程](./release.md)，维护者确认具体文案、渠道和时机后再传播。

## 可复用演示

对象：正在维护 React/TypeScript 客户端应用、想减少手写路由清单的开发者。预留约 5–8 分钟讲解，首次依赖下载和构建另计；这不是安装耗时基准。准备 Node 22.12+/24 与网络即可，无需账户、后端或付费托管。

```sh
git clone https://github.com/givingwu/fs-router.git
cd fs-router
git rev-parse HEAD
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run build:all
npm --prefix examples/minimal-react run dev
```

`example:setup` 构建本地包并把 tarball 安装进独立示例；不要改成安装尚未发布的 npm 0.1.0。记录打印的提交和工具版本，访问终端给出的本地 URL，结束用 Ctrl-C。

| 顺序 | 展示操作 | 观众应看到/应理解 |
| --- | --- | --- |
| 1 | 打开 `examples/minimal-react/src/routes`，对照生成的 `src/routes.tsx` | `page.tsx` / `layout.tsx` 生成普通路由对象，应用自行创建 router |
| 2 | 首页点击 `Count: 0`，再点 `Open user 42` | 虚构的 `Demo User` 与 `User ID: 42`；客户端 loader 随路由运行 |
| 3 | 刷新 `/users/42`，访问 `/users/missing` 和 `/unknown` | 深链接可刷新、loader 错误为 `Error 404`、未匹配路径为 `Page not found`；生产主机仍需 SPA fallback |
| 4 | 查看 `src/navigation.typecheck.ts`，运行 `build:all` 的类型检查 | 未知路径/遗漏参数被拒绝；移除该文件中一条预期错误的指令可观察编译失败，演示后还原。不要提交临时破坏 |
| 5 | 在 Vite 开发时编辑首页文字；需要时展示现有浏览器测试的路由增删场景 | 组件更新与结构更新不同，不承诺路由变化保留状态 |
| 6 | 展示浏览器 smoke 中延迟 JS chunk 的步骤 | 非根懒组件的 `Loading component…` 可见；网速快时手动点击可能看不到，不用剪辑伪造等待效果 |

自动复现上述核心导航/错误/chunk 与 Vite 编辑场景：

```sh
npx --yes pnpm@10.34.5 exec playwright install chromium
npx --yes pnpm@10.34.5 example:smoke
```

源码证据：`tests/browser/example.spec.ts`，三个 production 场景和一个 Vite 开发场景。测试启动并关闭自己的本地服务；运行前先停止手动 dev/preview，避免端口冲突。失败时保存脱敏错误、版本和步骤，不用旧截图替代当前结果。截图仅包含项目自身界面和虚构数据。

结束时收集：使用的版本/提交与构建器、完成了哪些步骤、首个阻碍、是否愿意在独立分支继续验证及原因。公开反馈无需公司、真实产品名称或业务数据；模板见[采用计划](./adoption.md)。

## 0.1.0 发布说明草稿

**fs-router 0.1.0 candidate — file-based routing for existing React Router apps**

此候选版面向愿意保留 Vite/Webpack/Rspack 构建配置、使用文件约定生成 React Router 路由的客户端应用。最小示例提供虚构用户 loader、类型化导航、错误边界和三个构建器验证；中英文入口、迁移和兼容性说明已补齐。

升级前请注意：Node 下限 22.12，React/DOM 配对版本为 18.3.1 或 19.2.8 的受测组合，Router DOM 至少 7.18.3，Router 6 不再支持。应用负责 React、Router 和 Loadable peers；生成导入不再隐式依赖 `@` alias，路由与声明输出必须是扫描目录外的不同文件，冲突约定现在会使构建失败。完整变更以 [CHANGELOG](https://github.com/givingwu/fs-router/blob/main/CHANGELOG.md) 和[迁移页](../guide/migration/v0.1.md)为准。

修复包括 ESM/CJS 各自的声明入口、路径类型与运行时一致性、导出与 loader 提取、生成错误传播及 watcher 恢复。支持证据来自真实 tarball 消费者和浏览器场景，不代表 SSR/RSC、Windows 或所有新主版本可用。loader/action 仍是客户端代码；没有自动 loader 返回类型生成，也没有竞品性能结论。

**分发状态：尚未发布。** 当前通过本页源码/tarball 流程试用；正式发布后再补实际日期、目标提交、包 integrity、registry/provenance 及对应 tag 的链接，并确认 npm 页面再改候选提示。不要只把文案改成“已发布”。已知未完成项见[路线图](https://github.com/givingwu/fs-router/blob/main/ROADMAP.md)。

## 中文社区介绍草稿

我们在准备 `@feoe/fs-router` 0.1.0：为现有 React Router 客户端应用增加文件路由约定和类型化导航，提供 Vite、Webpack、Rspack 适配器。应用仍自己创建 router；它不是 SSR/RSC 框架。

仓库有一个无需账户或后端的最小示例，可以验证动态用户页、客户端 loader、错误边界和懒加载。0.1.0 尚未上 npm，请按[文档](https://givingwu.github.io/fs-router/)的本地 tarball 步骤试用，并先核对兼容性与迁移限制。

如果你正在评估文件路由，欢迎在[仓库 Issues](https://github.com/givingwu/fs-router/issues/new/choose)分享使用版本、完成到哪一步、首个阻碍和继续/放弃的原因。无需提供真实业务代码。也欢迎从贡献指南中的小任务开始。

## English community introduction draft

`@feoe/fs-router` is preparing a 0.1.0 candidate for existing React Router client apps. It generates routes and typed navigation declarations from file conventions, with Vite, Webpack and Rspack adapters. Your app creates the router; this is not an SSR/RSC framework.

The repository includes a local example with a fictional user loader, error handling and lazy components. **0.1.0 is not on npm yet**: follow the local tarball instructions in the [English guide](https://givingwu.github.io/fs-router/english.html), and check the tested versions and migration notes first.

If you try it, an [issue](https://github.com/givingwu/fs-router/issues/new/choose) with your version, completed steps, first obstacle and reason to continue or stop would help. No private application code is needed. Small, scoped contribution tasks are available in the contribution guide.

## 使用这些草稿之前

维护者需要确认：使用哪个具体草稿、发往哪个允许项目介绍的渠道、候选版试用还是正式发布介绍、是否能处理反馈。跨社区发帖先核对当时规则；本阶段不预设外部收件人或批量私信列表。不得刷 Star、买量、编造用户/徽章/背书，或用依赖上游的名称暗示其认可本项目。
