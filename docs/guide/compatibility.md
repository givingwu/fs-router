# 兼容性、公开 API 与限制

本页对应未发布的 0.1.0 候选版本，核验日期 2026-09-12。测试对象是安装到临时独立项目的 tarball，不通过 workspace link 或源码路径导入。

## 支持矩阵

| 层面 | 验证组合与承诺 |
| --- | --- |
| Node | 22.12.0、24.20.0；包下限 >=22.12.0。推荐受维护 LTS 的最新安全补丁 |
| 操作系统 | 本地 macOS arm64；CI 配置 Ubuntu。Windows/Bun/Deno 尚未完成实际集成验证 |
| React / React DOM | 配对 18.3.1、19.2.8；对应 React 类型 18.3.31、19.2.0 |
| React Router DOM | 7.18.3；Data Router 客户端路由模式 |
| Vite | 6.4.3：构建、开关 splitting、增删文件重新生成 |
| Webpack | 5.110.3：构建、开关 splitting、watch 增删文件重新生成 |
| Rspack | 1.7.12：同上；没有把 Rspack 2 的要求套用到 1.x |
| TypeScript | 5.9.3，strict / skipLibCheck=false；公共入口覆盖 Bundler 与 NodeNext ESM/CJS；生成 TSX 使用 Bundler 模式 |
| 未覆盖 | Router 6、Router 8、Vite 7/8、Rspack 2、TypeScript 6、SSR/RSC、Firefox/WebKit 及其他平台浏览器 E2E |

peer 版本范围允许同主版本的后续兼容更新，但测试证据仅覆盖表中的确切版本；不意味着每个组合都已逐一运行。构建器是 optional peer，按需安装；React、React DOM、Router DOM 和 Loadable 是应用负责的 peer。TypeScript 用于构建插件分析导出，属于库依赖。库根入口不引入文件扫描器或 Node 内建模块。

## 公开入口

| 入口 | 导出 |
| --- | --- |
| `@feoe/fs-router` | `pathParser`、`useNavigation`；类型 `PathParserResult`、`RouterParam`、可声明合并的 `RouteTypes` |
| `@feoe/fs-router/vite` | 默认导出与 `FileBasedRouterVite`、`PluginConfig` |
| `@feoe/fs-router/webpack` | 默认导出与 `FileBasedRouterWebpack`、`PluginConfig` |
| `@feoe/fs-router/rspack` | 默认导出与 `FileBasedRouterRspack`、`PluginConfig` |

四个入口均有 `.js` / `.cjs` 和各自的 `.d.ts` / `.d.cts`。没有承诺深层 `dist/...` 内部路径、公开 Router 组件或 RouteExtractor API。CJS 默认插件通过 `.default` 访问；Vite CJS 类型显式选择其 ESM 类型定义。

## 路由约定与边界

扫描真实目录，确定性排序，只处理配置扩展名下的约定文件。隐藏文件/目录、`node_modules` 和符号链接被跳过。路由目录不存在或缺少根布局会使构建失败。生成输出必须是扫描目录外互不相同的文件；文件名作为字符串转义，重复约定文件、重复 route id 和等价终端路由产生明确错误。

类型文件与 runtime 使用相同的路径解析、扩展名和忽略规则。支持 `[id]`、`[[id]]` / `[id$]`、`[...path]`、`$.tsx`、分组与点分目录。类型检查验证未知路径和遗漏参数会失败，但不验证参数的业务含义。`[[...path]]`、任意自定义正则、混合静态可选段、所有可能的重叠路径组合尚无兼容承诺；冲突检查并非对完整路由语言的穷举。

以下配置/文件曾出现在旧文档中，当前没有相应功能：`defaultErrorBoundary`、`generateLoaderTypes`、`generateRouteParams` 开关、`*.config.ts` 的运行时合并、独立 `loader.ts`。配置字段保留类型兼容，但不要依赖它们改变行为。loader 参数由导航路径推导，loader 返回类型不自动生成。

loader、clientData 和 action 都会进入客户端模块图；名称里的 data/client 不构成安全隔离。多个 loader 返回值的合并规则见迁移页。布局用 `Outlet`；懒加载只作用于非根组件，loader 保持静态加载。未提供竞品性能基准，因此不作性能领先声明。

使用构建器本身的 watcher，错误向构建器传播，生成请求排队处理，内容未变时不触碰文件。连续编辑可能在旧编译中产生暂时诊断，后续编译会恢复；验证会等到实际模块图更新且编译成功。Vite 结构变化可能完整刷新；React 组件 HMR 和状态保留由应用配置负责。输出写入先检查路径再使用临时文件替换，不是针对恶意并发修改文件系统的隔离沙箱。

## 可复现验证

```sh
pnpm install --frozen-lockfile
pnpm check && pnpm typecheck && pnpm test
pnpm check:consumers
```

`check:consumers` 生成 `.artifacts/package-preview.json` 并实际安装 tarball。两套消费者有独立 npm 锁文件：验证四个入口加载、严格声明解析、生成路由的匹配/loader/action/导航，以及三种构建器与结构监听。`FS_ROUTER_CONSUMER=react18` 或 `react19` 可选一组；`FS_ROUTER_TARBALL=/absolute/path/package.tgz` 可验证既有包字节。完整测试见 `tests/consumers/verify.mjs`。

`examples/minimal-react` 已加入三种构建器、严格类型和 Chromium 页面检查。旧大型示例的独立依赖与 UI 不属于矩阵，根包结果不能替代其安全验证。文档与最小示例的命令见[快速开始](./start/getting-started.md)。

最小示例固定 React/React DOM 18.3.1、类型 18.3.31/18.3.7、Vite 6.4.3 和 React 插件 4.7.0。2026-09-12 的收尾修复恢复了这套已验证组合：独立依赖 PR 曾引入 React 19/DOM 18 混用，以及超出插件和本库 peer 范围的 Vite 8。示例选择不改变上表 React 18/19 的库消费者覆盖。Vite 6.4 在本次核验时仍接收官方安全补丁；未来主版本迁移需同时调整 peer、锁文件及验证矩阵，不能只更新示例版本号。

## 核验来源

- [Node 发布与支持周期](https://nodejs.org/en/about/previous-releases)：选择 22/24 LTS；最低版本测试不代表推荐使用旧安全补丁。
- [React Router 7.18.3 的 v6 升级指南](https://github.com/remix-run/react-router/blob/react-router%407.18.3/docs/upgrading/v6.md)：应用仍需逐项验证其迁移行为。
- [React Router RSC 安全公告](https://github.com/remix-run/react-router/security/advisories/GHSA-qwww-vcr4-c8h2)：7.18.0 存在后续修复，因此本阶段选择 7.18.3；本项目没有宣称支持 RSC。
- [Vite 支持政策](https://vite.dev/releases)、[Webpack compiler hooks](https://webpack.js.org/api/compiler-hooks/)、[Rspack 版本要求](https://rspack.rs/guide/start/quick-start)：分别核验所用工具线，不把最新版要求当作历史版本的最低要求。
- [发布流程](../contributing/release.md)：npm OIDC 官方要求、工具固定版本、管理员配置、包预览和回滚。
