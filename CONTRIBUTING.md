# 贡献指南

感谢你对 @feoe/fs-router 的关注！

完整的贡献指南请查看: [贡献指南](./docs/contributing/index.md)

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

`pnpm check:fix` 可自动修复格式。根检查覆盖库源码和实际测试文件，`tests/fixtures` 与 `tests/router-file-demos` 是解析器输入数据；独立示例使用自己的工具与依赖，不在根 CI 验证范围内。贡献者仍需验证所修改的示例。

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
