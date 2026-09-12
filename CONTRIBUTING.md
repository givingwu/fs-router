# 贡献指南 / Contributing

欢迎用中文或英文报告问题、补充复现、改进文档和提交代码。无需先承诺长期维护，试用失败的反馈也有价值。

English contributions are welcome. Use the bilingual [bug / feature forms](https://github.com/givingwu/fs-router/issues/new/choose), or a blank issue for questions and trial feedback. Fork the repository, create a branch, run the checks below, and open a PR against `main` describing the problem, resulting behavior and validation. Small documentation fixes can go straight to a PR; discuss API and compatibility changes first. There is no response-time guarantee. See the [Code of Conduct](./CODE_OF_CONDUCT.md) and [support policy](./SUPPORT.md).

## 从克隆到第一个 PR

1. 如果要提交代码，先在 GitHub fork 本仓库，再克隆自己的 fork；仅试用可用下方官方仓库地址。安装下面指定的 Node/pnpm 后在根目录运行命令。
2. 用 `git switch -c docs/first-contribution` 创建分支。从[入门任务](./docs/contributing/first-contribution.md)选择一个小问题，搜索已有 Issue/PR 避免重复；需要协调时用任务编号开普通 Issue。拼写修正可直接提 PR。
3. 新 API、路由语义、支持下限或依赖主版本变更，先用 feature form 讨论场景、替代方案和迁移成本，再实施。按下表验证，在 PR 写实际命令、结果和未验证之处。
4. 提交可读的 commit，`git push -u origin docs/first-contribution`，打开到 `givingwu/fs-router:main` 的 PR，填写模板。尚未完成可开 draft；根据 review 推送同一分支。
5. 维护者按[治理规则](./GOVERNANCE.md)决定合并。合并不等于 npm 已发布，版本状态见 [CHANGELOG](./CHANGELOG.md) 和[发布流程](./docs/contributing/release.md)。

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/givingwu/fs-router.git
cd fs-router

# 安装依赖
pnpm install --frozen-lockfile

# 构建项目
pnpm build

# 运行测试
pnpm test

# 开发文档
pnpm docs:dev
```

## 提交前验证

使用 Node.js 22 或 24 LTS 的最新补丁，pnpm 固定为 `package.json` 中的 10.34.5。可用 `npm install --global pnpm@10.34.5` 安装。

```bash
pnpm check          # Biome 格式、导入顺序和 lint；警告也会失败
pnpm typecheck      # 源码、测试、构建配置和文档配置
pnpm test
pnpm build
pnpm check:package  # 4 个入口的声明文件、ESM 和 CJS
pnpm docs:build
pnpm docs:check     # /fs-router/ 路径和静态资源
pnpm audit --audit-level high
```

以上是基础检查。按改动范围补充验证：

| 改动 | 本地验证 |
| --- | --- |
| 所有 PR | `pnpm check`、`pnpm typecheck`，人工审查 Markdown/YAML 和公开内容（Biome 不覆盖这些文档） |
| 库源码、类型、插件或根依赖 | `pnpm test`、`pnpm check:consumers`（含 build、包入口及 React 18/19 tarball 消费者） |
| 文档 | `pnpm docs:build`、`pnpm docs:check`；导航/主题或交互改动再运行 `pnpm docs:smoke` |
| 最小示例、影响示例的插件 | `pnpm example:setup`、`pnpm example:check`、`pnpm example:smoke` |
| 依赖 | 受影响的以上检查及 `pnpm audit --audit-level high`；独立示例需在其目录单独审计 |

浏览器检查首次需要 `pnpm exec playwright install chromium`，Linux 缺系统依赖时用 `--with-deps`。CI 对 PR 运行完整质量、消费者、文档、最小示例和安全检查。不能运行某项时说明原因与需补验环境，不把未运行写成通过。

`pnpm check:fix` 可自动修复格式。使用 strict TypeScript、具名公共导出和具体类型；测试证明真实行为或回归，不写重复实现的凑数断言。公共行为变化同时更新兼容性、迁移说明和 CHANGELOG。

根检查覆盖库源码和实际测试文件，`tests/fixtures` 与 `tests/router-file-demos` 是解析器输入数据；`examples/minimal-react` 有独立安装和浏览器 CI，旧大型示例不在该验证范围内。贡献者仍需验证所修改的独立示例。

pnpm 仅允许 `esbuild` 的依赖安装脚本；新增允许项须在 PR 中解释。工作树环境若遇到 simple-git-hooks 的 `.git/hooks` 错误，可用 `SKIP_INSTALL_SIMPLE_GIT_HOOKS=1 pnpm install --frozen-lockfile`，并手动执行上述检查。

安全问题按 [安全政策](./SECURITY.md) 报告。

## 开发资源

- [开发环境搭建](./docs/contributing/development.md)
- [发布流程](./docs/contributing/release.md)
- [AGENTS.md](./AGENTS.md) - AI Agent 开发指南

## 贡献方式

- 报告问题: [GitHub Issues](https://github.com/givingwu/fs-router/issues)
- 提交代码: Pull Request
- 改进文档

Bug form 请求版本/提交、环境、最小路由树与配置、步骤及预期/实际行为，不要求完整商业项目。文档问题可填写页面 URL，将无关环境记为 N/A。Feature form 请求真实场景、替代方案与完成条件，不要求提议者承诺实现。其他问题、试用失败可开 blank issue。

有效反馈不由 stale bot 自动关闭；重复项附原项链接，信息不足时说明需补充什么，补充新证据可以重开。支持与响应边界见 [SUPPORT.md](./SUPPORT.md)，行为问题见 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

## 公开内容范围

文档、源码注释、示例、截图和提交说明应使用本项目的公开资料。不要加入雇主、客户或合作方的名称、品牌、内部系统地址、工作区文档链接或真实业务数据。示例使用虚构数据和本地路径，需要外部链接时优先引用公开的上游官方文档。

提交前检查新增内容及生成的文档和包产物，确保没有带入上述信息。第三方开源许可证、必要的版权声明和技术来源应准确保留。

AI 辅助贡献同样需要作者理解改动、核实来源并验证。项目使用 [MIT License](./LICENSE)，引入第三方代码应保留许可和出处；当前没有额外 CLA 或签署机器人。
