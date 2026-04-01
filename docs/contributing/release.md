# 发布流程

本页面介绍 @feoe/fs-router 的发布流程。

## 版本管理

本项目遵循 [语义化版本](https://semver.org/) 规范：

- **主版本号 (Major)**: 不兼容的 API 变更
- **次版本号 (Minor)**: 向下兼容的功能新增
- **修订号 (Patch)**: 向下兼容的问题修复

### 版本号示例

- `0.0.11` → `0.0.12`: Bug 修复
- `0.0.11` → `0.1.0`: 新增功能
- `0.0.11` → `1.0.0`: 破坏性变更

## 发布步骤

### 1. 准备发布

确保你的本地分支是最新的：

```bash
git fetch origin
git checkout master
git merge origin/master
```

### 2. 更新版本号

使用 npm 版本命令更新版本号：

```bash
# 补丁版本 (0.0.11 → 0.0.12)
npm version patch

# 次版本 (0.0.11 → 0.1.0)
npm version minor

# 主版本 (0.0.11 → 1.0.0)
npm version major
```

或手动修改 `package.json` 中的版本号。

### 3. 更新 CHANGELOG

在项目根目录创建或更新 `CHANGELOG.md`：

```markdown
## [0.0.12] - 2024-XX-XX

### Added
- 新功能 A
- 新功能 B

### Fixed
- 修复问题 C

### Changed
- 变更 D
```

### 4. 提交变更

```bash
git add package.json CHANGELOG.md
git commit -m "chore: release v0.0.12"
```

### 5. 运行测试

确保所有测试通过：

```bash
pnpm test
```

### 6. 构建

```bash
pnpm build
```

### 7. 发布到 npm

```bash
pnpm publish
```

### 8. 推送标签到 GitHub

```bash
git push origin master
git push origin v0.0.12
```

### 9. 创建 GitHub Release

1. 访问 [GitHub Releases](https://github.com/givingwu/fs-router/releases)
2. 点击 "Draft a new release"
3. 选择刚推送的标签
4. 填写 Release 标题和内容（可从 CHANGELOG 复制）
5. 点击 "Publish release"

## 发布检查清单

在发布前，请确认：

- [ ] 所有测试通过 (`pnpm test`)
- [ ] 构建成功 (`pnpm build`)
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 文档是最新的
- [ ] 示例项目能正常运行
- [ ] 没有未提交的更改
- [ ] 当前分支是 `master`
- [ ] 已拉取最新的远程更改

## 发布后

### 1. 更新文档

如果有文档更新，发布后执行：

```bash
pnpm docs:build
```

文档会自动部署到 GitHub Pages。

### 2. 通知用户

通过以下渠道通知用户：

- GitHub Release
- 项目 README 中的版本徽章
- 社交媒体（如有）

## 回滚发布

如果发现问题需要回滚：

1. **npm 回滚**（发布后 72 小时内）：

```bash
npm deprecate @feoe/fs-router@"0.0.12" "Critical bug, please use 0.0.11"
```

2. **发布修复版本**：

```bash
npm version patch  # 0.0.12 → 0.0.13
# 修复问题
pnpm test && pnpm build && pnpm publish
```

## Canary 发布

对于需要提前测试的版本，可以使用 canary 标识：

```bash
# 修改 package.json 版本
"version": "0.0.12-canary.0"

# 发布 canary 版本
npm publish --tag canary
```

用户可以通过以下命令安装：

```bash
npm install @feoe/fs-router@canary
```
