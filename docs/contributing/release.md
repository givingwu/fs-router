# 版本与发布

当前准备的 **0.1.0 尚未发布**。发布 tarball、创建 GitHub Release、修改 npm 信任配置均需维护者明确授权；合并此工作流本身不会发布。官方资料核验于 2026-09-12。

## 版本约定

0.x 阶段：修复且兼容的变更增加 patch；不兼容变更增加 minor，并在 CHANGELOG 的 Breaking changes 与迁移页列出。1.0 后按 SemVer major/minor/patch。变更 API、peer/Node 下限、路由匹配、生成文件约定或默认值均按兼容性变更审查。用 `npm version ... --no-git-tag-version` 或直接编辑版本，提交版本与 CHANGELOG 的 PR；不由工具自动推送标签。

## 可复现包预览

Node 24.20.0、pnpm 10.34.5、npm 12.0.2 是发布工作流的固定工具版本，依赖按根 `pnpm-lock.yaml` 安装。升级工具版本也须经 PR 验证。

```sh
pnpm install --frozen-lockfile
pnpm check && pnpm typecheck && pnpm test
pnpm check:consumers
pnpm docs:build && pnpm docs:check
npm publish ./.artifacts/feoe-fs-router-0.1.0.tgz --dry-run --ignore-scripts --access public
```

`check:consumers` 先构建并验证入口，再执行真实 `npm pack`，输出 tarball 和 `package-preview.json`（文件表、大小、SHA-512 integrity）。隔离消费者先用自己的锁文件安装工具/peer，再安装该 tarball；库直接依赖也在 fixture 中固定，避免借用仓库 node_modules。它会检查严格类型和实际生成路由。普通 `npm pack` 也通过 prepack 重新构建，避免打包过期 dist。

手动运行 **Package preview and publish**，输入 package.json 的准确版本，保持 `publish=false`。工作流执行以上验证，上传保留 14 天的预览 artifact。只读预览没有 OIDC 写权限。比较两次干净构建的 integrity 可检查相同输入下的产物一致性；不同 Node/npm 版本或平台不承诺字节一致。

## 管理员一次性配置清单

以下是待批准的配置方案，本阶段没有执行：

| 配置位置 | 精确值/要求 |
| --- | --- |
| npm 包 | `@feoe/fs-router`，已有包，管理员须具备发布权限 |
| npm Trusted Publisher provider | GitHub Actions |
| Organization or user | `givingwu` |
| Repository | `fs-router` |
| Workflow filename | `publish.yml`（仅文件名，区分大小写） |
| Environment name | `npm-publish` |
| Allowed actions | 本工作流用 `npm publish`，须显式允许直接发布；只允许 `npm stage publish` 不适配本流程 |
| GitHub Environment | 新建 `npm-publish`，配置 required reviewers、阻止自批，限制仅 `main` 可部署 |
| GitHub repository variable | 审核前保持 `NPM_PUBLISH_ENABLED` 未设置；完成设置并获授权后置为 `true` |
| Token / permissions | 无需 NPM_TOKEN；仅 publish job 有 `id-token: write`，其余只有 `contents: read` |

当前 [npm 官方 trusted publishing](https://docs.npmjs.com/trusted-publishers/) 要求 npm >=11.5.1、Node >=22.14.0，并使用受支持的云端 runner；此工作流使用 GitHub 托管 Ubuntu。固定的 npm 12.0.2 自身要求 Node `^22.22.2 || ^24.15.0 || >=26.0.0`，Node 24.20.0 满足要求。GitHub OIDC 对公开仓库/公开包自动提供 provenance；显式保留 `--provenance` 使意图清楚。dry-run 不证明 OIDC 信任或实际签发成功。

新版 npm 默认信任配置可能只允许 staged publishing，管理员务必核对 Allowed actions。若维护者选择 [staged publishing](https://docs.npmjs.com/staged-publishing/)，应另行调整并验证工作流；本阶段没有擅自创建 staged 或正式版本。验证 OIDC 后再另行批准收紧传统 token 权限，避免未经核验切断现有发布渠道。

## 执行一次正式发布

正式发布前将 CHANGELOG 的 Unreleased 替换为实际日期并移除 README 候选提示。维护者审查版本、CHANGELOG、迁移说明和预览文件表/摘要，确认拟发布提交及 dist-tag 后，才在 `main` 对该提交手动运行工作流并设置 `publish=true`。preview 会重新生成包并检查；受保护环境批准后，publish job 下载**同一 run**的 artifact，验证版本和 SHA-512，只发布已验证的 tarball，不重新打包，不执行包生命周期脚本。正式版本用 `latest`，预发布版本用 `next`。

首次发布需确认 npm 页面实际显示目标版本及 provenance。标签 `v0.1.0` / GitHub Release 应指向实际发布的提交，由维护者在确认后创建；若 main 已前移，不能把标签随意打在新的 HEAD。不得复用已经发布的版本号。[npm publish 语义](https://docs.npmjs.com/cli/v11/commands/npm-publish/)

## 失败与回滚

- 构建或消费者失败：不发布，修复 PR 后生成新预览。OIDC/权限失败：核对上述精确字段、runner、Node/npm 和环境保护，不添加长期 token 绕过。
- 发布请求超时：先查询 `npm view @feoe/fs-router@0.1.0 dist.integrity` 确认是否已经成功，再决定下一步；不要重复发布或重用版本号。
- 错误版本已公开：先核实旧版本可用和安全，在取得授权后把 `latest` 指回已知良好版本，例如 `npm dist-tag add @feoe/fs-router@<verified-good-version> latest`；随后 `npm deprecate @feoe/fs-router@<bad-version> "说明问题及修复版本"`，发布新的修复版本。切换 tag 不改变用户 lockfile，不撤回已安装包。
- 不用 `npm unpublish` 作为常规回滚。撤销错误 GitHub Release/更改标签和 npm 账户设置也须单独确认，保留原提交与包摘要方便追溯。[npm dist-tag](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/)

Pages 仍由既有 main 部署工作流管理；包预览不会触发文档部署。
