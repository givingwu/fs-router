# 开发环境

使用 Node 22.12+ 或 24 LTS 的最新安全补丁与 pnpm 10.34.5。安装 pnpm 可运行 `npm install --global pnpm@10.34.5`；不想全局安装时将下面的 `pnpm` 换为 `npx --yes pnpm@10.34.5`。在仓库根目录：

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm typecheck
pnpm test
pnpm check:consumers
pnpm example:setup
pnpm example:check
pnpm docs:build
pnpm docs:check
pnpm exec playwright install chromium
pnpm docs:smoke
pnpm example:smoke
```

`pnpm dev` 监听库构建；文档开发用 `pnpm docs:dev`。浏览器检查自行启动/关闭本地服务。Linux CI 安装浏览器依赖用 `pnpm exec playwright install --with-deps chromium`。

`src` 是库源码，`tests/consumers` 验证真实 tarball，`examples/minimal-react` 是用户可运行入口。插件改动后重跑 `example:setup` 更新示例安装的候选包。

| 位置/命令 | 用途 |
| --- | --- |
| `src/core`、`src/router` | 解析约定文件、构造路由和声明；`tests/*.test.ts` 验证边界 |
| `src/plugin` | 构建器适配、生成路径和 watcher；`tests/watch-recovery.test.ts` 验证错误恢复 |
| `src/hooks` | 类型化导航；消费者测试验证安装后的运行时和类型 |
| `docs`、各级 `_meta.json` | Rspress 页面及导航，新页加入对应 meta 后 build/check |
| `pnpm test:watch` | 库测试监听；`pnpm test` 是执行后退出的完整单元测试 |
| `pnpm docs:preview` | 预览已构建文档，使用终端打印的 `/fs-router/` URL；Ctrl-C 结束 |

上面的命令是完整验证路径；按改动范围选用检查见贡献指南，CI 仍执行其完整检查。根 lint 不覆盖 Markdown/YAML，需人工审查；文档链接由 docs:check 校验。旧独立示例不在根 CI 支持矩阵中，修改它们需要独立安装、构建和审计。

如果 worktree 安装 hook 报 `.git/hooks` 的 `ENOTDIR`，用 `SKIP_INSTALL_SIMPLE_GIT_HOOKS=1 pnpm install --frozen-lockfile`，再手动执行检查。Playwright 报浏览器缺失时重新执行浏览器安装命令；端口占用时先停止自己启动的 preview/dev 服务再测试。

`docs:smoke` 和 `example:smoke` 共享默认 `test-results` 目录，按上面的顺序运行。不要在同一工作树并行启动它们，否则一个进程清理输出可能使另一个的 trace 写入报 `ENOENT`；这不是页面断言失败。

生成目录 `dist`、`doc_build`、`.artifacts` 和示例生成的路由声明不提交。只改文档也需检查导航、链接与页面表现，详见[文档维护](../README.md)。

## 依赖更新

根包与最小示例的 Dependabot 日常版本更新只接受 minor/patch；主版本改由维护者准备协调升级 PR。根包继续合并兼容更新；最小示例将 React、React DOM 及两套类型声明跨 dependencies/devDependencies 分为一组，构建器、插件和编译工具为另一组。仅设置分组的 `update-types` 不会阻止主版本另开 PR，因此配置还使用 `ignore` 的 `version-update:semver-major`。

安全更新另用 `applies-to: security-updates` 分组，没有添加 `versions` 范围忽略、关闭告警或停用安全 CI。版本更新的主版本过滤不阻止安全修复；若补丁需要跨主版本或带动非漏洞 peer，维护者仍需补齐兼容依赖，按同样流程验证。分组不会证明任意版本组合可运行。

升级 PR 需核对官方支持政策、库与插件的 peer 范围，成套修改 manifest/锁文件，更新示例 README、接入指南及支持矩阵。保持 React 18/19 消费者验证，从干净依赖树执行本页完整检查；两个浏览器套件顺序运行。以 PR 当前提交的 CI 结果复核，尤其是 `Documentation and browser examples`；旧提交通过不能替代合并后的组合验证。仓库保护规则由管理员另外配置，源码中的分组不是 required checks 设置。

依据：[Dependabot 配置](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)、[安全更新忽略条件实现](https://github.com/dependabot/dependabot-core/blob/main/common/lib/dependabot/config/ignore_condition.rb)、[Vite 支持政策](https://vite.dev/releases)。

贡献流程见[仓库指南](https://github.com/givingwu/fs-router/blob/main/CONTRIBUTING.md)，发布操作见[发布流程](./release.md)。
