# 第一阶段安全与工程基线审计

执行日期：**2026-09-11**（UTC / Asia/Shanghai 当日）。基线：`main` 的 `318d8e4`。对象：`givingwu/fs-router`、npm 包 `@feoe/fs-router@0.0.13`。这是范围有限的代码/供应链审计，不代表渗透测试或安全认证；本 PR 不发布 npm、不部署站点、不修改仓库权限。

## 现状与本阶段处理

| 范围 | 基线发现 | 本 PR |
| --- | --- | --- |
| 源码 | 生成错误被吞掉；Webpack 完成后强制 `process.exit(0)`；配置解析修改共享的类型输出路径 | 构建错误向上传播、由宿主管理进程、复制嵌套配置；5 个针对实际缺陷/依赖 API 的测试 |
| 测试/类型 | 原有 4 文件、20 测试通过；`tsc --noEmit` 通过，但无 CI 门禁 | 25 测试；检查源码、测试、构建和文档配置；声明构建单独限定 `src`，防止检查范围扩大导致包声明路径漂移 |
| 格式/lint | Biome 1.9.4/schema 1.8，无脚本；基线检查 52 errors | Biome 2.5.13 推荐规则、格式与导入整理；CI 警告也失败；删除未使用的私有代码、去掉不需要的类型忽略，没有关闭全部规则 |
| 包消费 | ESM/CJS 与声明路径没有自动验证 | `check:package` 验证全部 4 个入口的类型目标及 ESM/CJS 加载，并运行路径解析调用 |
| 工作流 | 只有 main Pages 发布，构建与发布同 job；Actions 可变标签；无超时 | PR 只读 CI，Node 22/24；独立安全审计；Pages 构建只读，发布独立 job；完整 SHA、超时、并发、禁用凭据持久化 |
| 发布 | 手动发布，文档使用不存在的默认分支 master | 保持手动发布；增强 prepublishOnly 检查，修正文档 main 与本地构建/实际部署区别 |
| 文档 | `/fs-router/` 已配置；开发文档仍声称 Node 16/pnpm 8 | LTS 工具说明、资源路径校验；现有 Pages source 与环境保持原状 |
| 治理 | 无 SECURITY/Dependabot；私密报告关闭；无 main 分支保护或 ruleset | 安全政策和每周依赖/Actions 更新；权限设置只提出下述方案 |

格式与类型检查限根库、测试代码及配置。fixtures 和 router-file-demos 是解析器输入，不应被格式化改变语义；examples 是独立项目，未纳入根 CI。`skipLibCheck` 沿用基线，只跳过依赖声明内部检查，不跳过项目源码/测试。

## 依赖审计与可达性

使用 npm registry 数据与 `pnpm audit --json`，计数是工具报告的漏洞条目，**不是可利用漏洞数**，也不是直接依赖数；pnpm 元数据的 devDependencies 计数不能用来判定运行时暴露，应沿依赖路径和源码用途判断。

| 锁文件 | 严重 | 高危 | 中危 | 低危 |
| --- | ---: | ---: | ---: | ---: |
| 根基线 | 1 | 40 | 29 | 6 |
| 根修复后 | 0 | 0 | 2 | 0 |
| `examples/kn-admin/pnpm-lock.yaml`（未修改） | 2 | 31 | 42 | 4 |

主要修复及判断：

- **浏览器运行时，直接 `react-router-dom` → 传递 `react-router`/`@remix-run/router`**：6.30.1 → 6.30.6，修复已回移的重定向/XSS 问题，包括 [GHSA-2w69-qvjg-hvjx](https://github.com/advisories/GHSA-2w69-qvjg-hvjx)。当前仍有两个中危告警，见下节。
- **构建时直接 glob**：11.0.1 的 [CLI 命令注入](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) 依赖 `-c/--cmd`，本项目仅调用 `glob()` API，未发现该命令路径；传递 minimatch/brace-expansion 另有 DoS。npm 将 11.1.0 明确标为不支持，因此升级到 13.0.6，并测试动态目录扫描；删除自带类型的 glob 不再需要的 `@types/glob@8`。
- **开发直接 Vitest/Vite**：Vitest 3.0.5 的 [UI 文件读写/执行漏洞](https://github.com/advisories/GHSA-5xrq-8626-4rwp) 不等于普通 `vitest run` 可被远程攻击，但不应保留易受影响的开发工具。选择 4.1.11，因为维护者明确[不向 3.x 回移新的 mocker 修复](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9)。Vite 保持有[安全补丁支持](https://vite.dev/releases)的 6.4 分支，更新到 6.4.3。
- **开发直接 Webpack/Rspress 及传递依赖**：Webpack 5.110.3、Rspress/theme 1.47.2；更新原有兼容范围内的传递依赖，消除 Rollup、serialize-javascript、PostCSS、js-yaml、fast-uri、lodash-es、immutable 等告警。开发服务器、处理攻击者控制的构建输入和浏览器文档代码有不同暴露条件；不因是 devDependency 就忽略。
- **文档浏览器传递 PrismJS**：refractor 3 锁定旧 Prism；局部覆盖 `refractor@3>prismjs: 1.30.0` 修复 [DOM clobbering](https://github.com/advisories/GHSA-x7hr-w5r2-h6wg)。覆盖限定父包和版本线，没有全局强制跨主版本；文档构建验证通过。上游解除旧约束后移除此覆盖。

### 已知保留项与后续优先级

1. **P1，React Router 7 迁移及消费兼容矩阵**：[GHSA-wrjc-x8rr-h8h6](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6) 需要攻击者控制的导航路径；本库 `useNavigation` 调用上游导航，不能仅以 TypeScript 类型断言不可达。[GHSA-337j-9hxr-rhxg](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg) 需要特定手动 SSR/hydration 及错误对象污染，仓库未发现该应用路径，但消费方可能使用。公告修复版本均为 7.18.0+，保留 6.x 兼容性，未增加忽略 ID。使用方避免直接导航到外部输入，避免把外部数据写入 SSR 序列化错误。安全 CI 阈值为 high，中危仍完整打印供审查。
2. **P1，独立示例依赖治理**：kn-admin 是 `private: true` 的独立联邦应用，未进入根包 tarball/Pages 构建。严重项来自构建工具链 `@module-federation/dts-plugin → axios → form-data` 的[边界生成漏洞](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)，及 shared 包的旧 Vitest UI；其余高危须结合各应用入口逐项修复并构建验证。本次不宣称修复了它；复制/运行示例前先更新并验证，勿公开暴露开发服务器。另两组示例没有提交锁文件，无法给出可复现锁树审计；需要先建立锁文件与测试。React 19 示例与根包 React 18 peer 范围也需协调。
3. **P1，权限与报告入口**：按下节由维护者确认后设置。PR 文件无法替代分支保护；当前门禁尚未强制。
4. **P2，工具与功能债务**：`@rslib/core@0.4.1` 不是当前 npm latest（执行时为 1.0.0），旧版本未发现明确维护承诺；本次保留以避免混入产物格式迁移，但应单独迁移和验证声明/条件导出。Rspress 的 npm latest 执行时为 1.47.2，不以搜索结果推断其已支持的主版本。unplugin 2、TypeScript 5、React 18 保持既有兼容线，不承诺长期上游支持。根 package engines 明确为 Node >=22，Node 20 已 EOL；发布时需告知该支持范围变化。
5. **P2，源码/文档验证深度**：路由字符串生成对引号/特殊文件名的转义、action/loader 导出一致性、HMR 生命周期、未完成的 virtual client、React 18/19 与 SSR 消费、Windows 路径、真实示例端到端、文档全量内容/链接、缺失的 loadable 消费依赖声明仍需专项验证。库插件处理的项目文件不是不可信租户输入的安全边界。

## Actions 版本核验

从官方仓库 `releases/latest` 读取 release，再通过 `git/ref/tags/<tag>`（annotated tag 继续解引用）核对 commit。查阅 action.yml：这些 JS Actions 使用 node24；CI 使用 GitHub 托管 Ubuntu runner。项目测试 Node 22 不会改变 Action 自身运行时。

| Action | 官方发布 | 固定 commit |
| --- | --- | --- |
| actions/checkout | [v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| actions/setup-node | [v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0) | `820762786026740c76f36085b0efc47a31fe5020` |
| pnpm/action-setup | [v6.1.0](https://github.com/pnpm/action-setup/releases/tag/v6.1.0) | `ea17c68df8912ef543352723c149a84f56e3d413` |
| actions/upload-pages-artifact | [v5.0.0](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0) | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| actions/deploy-pages | [v5.0.1](https://github.com/actions/deploy-pages/releases/tag/v5.0.1) | `368f82528645a54fb793d4d04e342629a3f51346` |

upload-pages-artifact 内部的 upload-artifact 也固定 SHA。已核对 configure-pages v6.0.0，但这里无需修改静态 Rspress 配置或启用站点，移除了该步骤。移除缓存步骤，避免将发布流程与 PR 依赖缓存复用；未引入 `pull_request_target`、`workflow_run`、自托管 runner、PAT 或 npm 发布凭据。

## 权限方案（仅提案，未执行）

GitHub API 只读确认：Pages source 为 workflow，地址 `https://givingwu.github.io/fs-router/`；`github-pages` 环境只允许 `main` 分支。main 无 branch protection，rulesets 为空；private-vulnerability-reporting 为 false；Dependabot security updates disabled；secret scanning 与 push protection enabled。

维护者确认后建议：

- Settings → Security → Code security：启用 Private vulnerability reporting 与 Dependabot security updates。再次检查报告入口可用后更新 SECURITY.md；不要配置未经证实的邮箱。
- Settings → Rules → Rulesets：对 `main` 启用规则，禁止删除/force push，要求 PR 和至少 1 次审查、解决对话、更新后重新审查。若单维护者暂时无法满足 1 审查要求，先确认审查人安排再启用，避免锁死维护。
- 首轮 CI 成功后要求准确的 status context：`Quality (Node 22)`、`Quality (Node 24)`、`Dependency audit`；以实际首次运行名称复核再保存。没有自动合并或 bypass agent。
- Actions → General：默认 token 只读，禁止 Actions 创建/批准 PR；限制 Actions 来源并要求完整 SHA；fork PR 保持首次贡献者审批与不发送 secrets/write token。
- 保留 Pages workflow source 和环境 main-only 限制；没有新增环境 secret 或权限。后续若增设 CodeQL/Scorecard，应先确认免费适用范围、SARIF 所需权限与 fork 行为。

参考 [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)、[Dependabot 配置](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference)、[Node 发布周期](https://nodejs.org/en/about/previous-releases)、[pnpm 10 安装与兼容性](https://pnpm.io/10.x/installation)。参考 [OpenSSF Best Practices](https://openssf.org/projects/best-practices-badge/) 识别治理缺口，没有申请/展示未获评的徽章或分数。

## 可复现验证

```bash
# 根目录；安装 package.json 固定的 pnpm 10.34.5，使用 Node 22/24 最新补丁
pnpm install --frozen-lockfile
pnpm check
pnpm typecheck
pnpm test
pnpm build
pnpm check:package
pnpm docs:build
pnpm docs:check
pnpm audit --audit-level high
pnpm audit --prod --audit-level high
pnpm audit --json # 因保留的中危告警预期退出 1
pnpm --dir examples/kn-admin audit --json # 独立已知风险，预期非零
pnpm pack --pack-destination ../package-check
# 单独下载官方 actionlint release 并核对 SHA256 后：
actionlint -shellcheck= .github/workflows/*.yml
```

基线 20 测试及库/文档构建通过；新增 5 测试后共 25。最终验证记录如下。远程 CI 在 PR 创建后触发，交付不等待其完成；Pages 的远程实际部署需合并 main 后验证，本任务没有触发部署。


| 本地环境/检查 | 结果 |
| --- | --- |
| macOS arm64，Node 22.23.2，pnpm 10.34.5 | check、typecheck、25 测试、ESM/CJS/DTS 构建、4 个入口、文档构建与资源验证全部通过 |
| macOS arm64，Node 24.21.0，pnpm 10.34.5 | 同上全部通过；`audit --audit-level high` 退出 0，保留 2 中危 |
| frozen install | 退出 0；worktree 使用 `SKIP_INSTALL_SIMPLE_GIT_HOOKS=1` 避免 simple-git-hooks 把 `.git` 文件误当目录 |
| 根 `audit --prod --audit-level high` | 退出 0，2 中危；非 prod 同样 0 high/critical |
| 文档 | 两条 Node 线均生成 34 HTML，308 个静态资源引用位于 `/fs-router/` 且文件存在 |
| `pnpm pack` | 真实 tarball 包含全部 12 个条件导出目标，无测试声明文件；未上传 npm |
| actionlint 1.7.12 | 官方 release 的 SHA256 已核对；3 个 workflow 校验通过；本地未安装 ShellCheck，显式 `-shellcheck=`，未声称执行 ShellCheck |
| 缺陷回归有效性 | 仅换回基线 config/factory 后，新 5 测试中 4 失败、1 通过，另捕获旧 process.exit 异常；恢复修复后 25 测试全部通过 |
| diff | `git diff --check` 通过 |

这些是本地证据；未模拟 GitHub fork 审批、OIDC 签发或 Pages 服务端发布。审查/合并后应确认远程 Linux CI 和原有 Pages 地址。
