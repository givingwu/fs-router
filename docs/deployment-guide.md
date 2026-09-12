# GitHub Pages 部署指南

## 自动部署

本项目使用 GitHub Actions 自动部署文档到 GitHub Pages。每当代码推送到 `main` 分支时，会自动触发部署流程。

文档地址：[https://givingwu.github.io/fs-router/](https://givingwu.github.io/fs-router/)

## 首次设置

**重要**：在首次部署前，需要手动启用 GitHub Pages：

1. 进入仓库 Settings > Pages
2. Source 选择 "GitHub Actions"
3. 保存设置

完成设置后，推送到 `main` 或手动运行工作流即可部署。首次启用需要仓库管理员操作；工作流默认的 `GITHUB_TOKEN` 只能部署已启用的站点，不能通过 `enablement: true` 完成首次启用。

### 部署状态

[![Deploy Documentation](https://github.com/givingwu/fs-router/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/givingwu/fs-router/actions/workflows/deploy-docs.yml)

### 部署流程

1. **触发条件**：
   - 推送到 `main` 分支（不限于 `docs/` 目录的修改）
   - 手动触发（在 Actions 页面选择 `main`）

2. **构建步骤**：
   - 设置 Node.js 24 LTS 环境
   - 安装 pnpm 包管理器
   - 按锁文件安装项目依赖（`pnpm install --frozen-lockfile`）
   - 构建 RSPress 文档
   - 验证 `/fs-router/` 路径、本地页面/锚点与静态资源，上传 `doc_build`

3. **发布步骤**：
   - 独立 `deploy` job 使用 `github-pages` 环境，仅此 job 持有 `pages: write` 和 `id-token: write`
   - 发布 job 不检出代码、不安装依赖，仅部署同一次 main 工作流的构建产物
   - fork PR 只触发只读 CI；部署还校验仓库名及 `refs/heads/main`

所有直接使用的 Actions 固定到官方仓库完整 commit SHA，版本由 Dependabot 跟踪。

## 故障排除

### 常见问题

#### 1. 构建失败

**问题**：依赖安装失败或构建过程出错

**解决方案**：
- 检查 `package.json` 中的依赖版本
- 确保 `pnpm-lock.yaml` 文件存在且完整
- 查看 Actions 日志中的详细错误信息

#### 2. 部署权限错误

**问题**：GitHub Pages 部署时权限不足

**解决方案**：
- 确保仓库设置中启用了 GitHub Pages
- 在 Settings > Pages 中选择 "GitHub Actions" 作为部署源
- 检查工作流文件中的权限配置

如果部署报站点未启用或 `Not Found`，先由仓库管理员完成上述首次设置，再重新运行工作流。无需将个人访问令牌添加到部署工作流。

#### 3. 页面无法访问

**问题**：部署成功但页面显示 404 或资源加载失败

**解决方案**：
- 检查 RSPress 配置中的 `base` 路径设置
- 确保静态资源路径正确
- 验证 GitHub Pages 设置中的自定义域名配置

#### 4. 缓存问题

**问题**：更新后页面内容未刷新

**解决方案**：
- 清除浏览器缓存
- 核对 CDN 缓存与部署产物，更新时间以实际响应为准
- 检查部署时间戳确认是否为最新版本

### 手动部署

如果自动部署失败，可以手动触发部署：

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "Deploy Documentation" 工作流
3. 点击 "Run workflow" 按钮
4. 选择 `main` 分支并确认运行

### 本地测试

在推送前可以本地测试文档构建：

```bash
# 安装依赖
pnpm install --frozen-lockfile

# 构建文档
pnpm docs:build
pnpm docs:check

# 预览构建结果
pnpm docs:preview
```

### 配置说明

#### GitHub Pages 设置

1. 进入仓库 Settings > Pages
2. Source 选择 "GitHub Actions"
3. 如需自定义域名，在 Custom domain 中配置

#### RSPress 配置

关键配置项（`docs/.rspress/config.ts`）：

```typescript
export default defineConfig({
  base: '/fs-router/', // GitHub Pages 路径
  // 其他配置...
})
```

### 监控和维护

- 定期检查 Actions 运行状态
- 监控部署时间和成功率
- 及时更新依赖版本
- 关注 GitHub Pages 服务状态

## 联系支持

如果遇到无法解决的部署问题，请：

1. 查看 [GitHub Issues](https://github.com/givingwu/fs-router/issues)
2. 创建新的 Issue 并提供详细的错误信息
3. 包含 Actions 运行日志和错误截图
