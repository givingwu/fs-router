# 最小示例依赖回归核验 — 2026-09-12

修复基线：main `821ad97640c47e19f61cfd99ba933371719d8f44`。本记录针对未发布的 `@feoe/fs-router@0.1.0` 候选包；此前的[文档阶段记录](./docs-validation-2026-09-12.md)是历史证据，不代表后续依赖提交通过。

## 回归与版本选择

- [PR #8](https://github.com/givingwu/fs-router/pull/8) 先升级 DOM/DOM 类型；[PR #7](https://github.com/givingwu/fs-router/pull/7) 单独把 Vite 6.4.3 升至 8.2.2；[PR #6](https://github.com/givingwu/fs-router/pull/6) 升级 React/React 类型，同时将 DOM/DOM 类型退回 18。合并后的实际文件与 PR 的单独升级描述不等价。
- [失败的 main CI](https://github.com/givingwu/fs-router/actions/runs/34676673005) 在示例 `npm ci` 报 `ERESOLVE`。本地 frozen root install 成功后，未修改的 `pnpm example:setup` 同样失败：`react@19.2.8` 不满足 `react-dom@18.3.1` 的 `react@^18.3.1` peer。
- 在独立复现目录仅修正 React/React 类型后，`npm install --package-lock-only --ignore-scripts --no-audit --no-fund` 继续报 `ERESOLVE`：`@vitejs/plugin-react@4.7.0` 只接受 Vite `^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0`。库本身的 Vite peer 为 `^6.4.3`；只修正第一处冲突不足以安装候选包。
- 恢复 `4200fce` 中完整的示例 manifest 和 npm lock，运行 `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` 后字节仍与该基线一致。锁文件差异主要是恢复 Vite 6 的 Rollup/esbuild 依赖树及跨平台 optional 包，移除 Vite 8 的依赖树；没有顺带刷新其他版本。

| 层面 | 恢复的最小示例 | 选择依据 |
| --- | --- | --- |
| React / React DOM | 18.3.1 / 18.3.1 | 已验证客户端示例基线，DOM peer 匹配；不是宣称 React 18 是最新版本 |
| React / DOM 类型 | 18.3.31 / 18.3.7 | DOM 类型 peer 为 `@types/react@^18.0.0` |
| Vite / React 插件 | 6.4.3 / 4.7.0 | 同时满足库和插件 peer；Vite 6.4 在核验时仍接收官方安全补丁 |
| Router DOM / Loadable | 7.18.3 / 5.16.7 | 保留既有版本，二者 peer 均接受 React 18/19 |
| Rspack / Webpack / TypeScript | 1.7.12 / 5.110.3 / 5.9.3 | 保留已验证构建器和严格类型配置 |

库 peer、根 pnpm lock、React 18/19 两套消费者 fixture 没有改变。恢复示例不缩小库的 React 19.2.8 覆盖，也不新增 Vite 7/8 支持承诺。

## 防止重复回归

根包和示例的日常版本更新忽略 semver major，保留 minor/patch。根包兼容更新仍成组；示例 React/DOM/两套类型为一组，构建器/插件/编译工具为另一组，不按生产/开发依赖拆分。主版本由维护者在同一 PR 中核对 peer、修改锁文件和支持矩阵，运行完整验证。

两个 npm 目录另配安全更新组，不设置 `versions` 忽略或停用安全检查。Dependabot 的 `IgnoreCondition#ignored_versions` 在安全更新模式不应用 `update-types` 过滤，必要的跨主版本安全修复仍可提出。安全分组不能保证自动带动所有非漏洞 peer；出现冲突需维护者补齐关联版本再验证。YAML 使用 Ruby/Psych `YAML.safe_load` 解析通过；配置的正式更新行为需合并后由 GitHub Dependabot 执行确认。

## 本次验证

本地环境：macOS arm64，Node 24.20.0，npm 11.19.0，pnpm 10.34.5。从跟踪源码创建独立副本，安装前确认无根/示例 node_modules、dist、doc_build、tarball 或最小示例生成路由/声明。允许使用下载缓存；这不等同于离线或空缓存验证。下面的 `pnpm` 实际通过 `npx --yes pnpm@10.34.5` 执行。

| 顺序与命令 | 本次实际结果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 通过，安装 496 个根依赖包 |
| `pnpm example:setup` | 通过；示例 `npm ci` 安装 179 个包，随后安装本地 tarball 及所需依赖（新增 3 个包） |
| `pnpm example:check` | Vite/Rspack/Webpack 构建均通过；每种构建后执行 `tsc --noEmit`，strict / skipLibCheck=false |
| `pnpm exec playwright install chromium`、`pnpm example:smoke` | 4 项通过：三种构建器的导航、loader、懒加载 fallback、深链接刷新、错误/404，以及 Vite 组件更新与路由增删 |
| `pnpm docs:build`、`pnpm docs:check` | 41 HTML、1,991 个本地引用/锚点、40 个 sitemap URL；中文导航和中英文入口检查通过 |
| `pnpm docs:smoke` | 3 项通过：dev/preview 搜索、键盘、移动导航和可访问性；与示例套件顺序运行 |
| `pnpm check`、`pnpm typecheck`、`pnpm test` | 通过；7 个测试文件，47 项现有测试全部通过 |
| `pnpm check:consumers` | React 18.3.1、19.2.8 独立 npm 锁定安装 + tarball 安装；四入口 ESM/CJS、严格 Bundler/NodeNext 声明、路由/loader/action/导航、三种构建器 eager/lazy 与 watcher 验证通过 |
| 根 `pnpm audit --audit-level high` | 通过阈值；仍有原有 2 项 moderate，0 high/critical；根锁未修改 |
| 示例目录 `npm audit --audit-level high` | 0 vulnerabilities，包含开发依赖 |
| 示例目录 `npm ls react react-dom @types/react @types/react-dom vite @vitejs/plugin-react webpack @rspack/core @feoe/fs-router --all --json` | 退出 0；实际安装的 React/DOM/类型/Vite/插件与上表一致，没有 invalid peer |
| `git diff --check`、YAML 解析、安装后 manifest/lock 字节对比 | 通过；安装没有改写根/示例清单和锁文件 |

最小示例与 React 18/19 消费者实际安装同一 tarball，已比较安装记录的 integrity：`sha512-6zRMnReTX4CyoUyFv2EXxSCM58RI0LyhAWwgmPBmfQTzyvgr3STDBrlojEZy7BVsJknqg6xGaioNJOl4mTMTRw==`。包大小 56,586 bytes，解包 284,074 bytes，共 20 文件：四入口各 JS/CJS/DTS/DCTS、package.json、中英文 README、MIT LICENSE，没有源码映射、测试或工作区文件。具体清单由现有 `.artifacts/package-preview.json` 生成。

已复核交付源码/文档/示例变更、文档 HTML/资源、示例编译输出、tarball 和代表性截图，未引入雇主/客户品牌、私有工作区链接或真实业务数据，第三方许可证与技术来源保留。未提交或附送原始本地日志及中间生成 TSX；后者含构建机绝对导入路径，按既有 gitignore 规则留在本机。示例截图显示虚构的 Demo User，文档截图与页面检查通过。

初次在 Git worktree 安装时，既有 hook 安装器报告 `.git/hooks` ENOTDIR，install 仍退出 0；独立干净副本完整验证不依赖 hook，质量检查均显式运行。pnpm 调用 npm 时仍有现有配置环境变量提示，没有隐藏或放宽 peer 错误。

## 管理员建议与边界

只读查询返回 main `Branch not protected`，仓库 rulesets 为 `[]`。建议管理员为 main 启用 PR 合并及以下 required status checks，并要求合并前分支更新到最新 main（`strict: true`）：`Quality (Node 22.12.0)`、`Quality (Node 24.20.0)`、`Documentation and browser examples`、`Dependency audit`。这能让重放/合并后的组合重新验证；本次没有修改任何保护规则、权限或合并设置。

Node 22/Ubuntu 的本次结果由 PR CI 给出，本地结果不代替远程状态。既有 Firefox/WebKit、Windows、SSR/RSC、其他构建器主版本和旧大型示例的限制保留。Vite 6.4 为安全补丁维护线，未来停止维护或确有迁移需求时应协调升级并重新验证。没有 npm 发布、手工部署、收费操作、推广或新权限；Pages 仍使用原有 `/fs-router/` 和部署工作流。

## 官方依据

- [React 版本](https://react.dev/versions)：区分旧版示例与当前版本。
- [Vite 支持政策](https://vite.dev/releases)：6.4 安全补丁支持状态。
- npm registry 的版本元数据，通过 `npm view <package>@<version> peerDependencies engines --json` 核对上述 React DOM、DOM 类型、Vite、React 插件、Router DOM、Loadable 的约束。
- [Dependabot 配置](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)与[忽略条件实现](https://github.com/dependabot/dependabot-core/blob/main/common/lib/dependabot/config/ignore_condition.rb)：分组范围、主版本规则和安全更新边界。
