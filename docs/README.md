# 文档维护

文档使用锁定的 Rspress 1.47.2。统一在仓库根目录运行：

```sh
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
pnpm docs:check
pnpm exec playwright install chromium
pnpm docs:smoke
pnpm docs:preview
```

dev/build/preview 使用同一份 `docs/.rspress/config.ts`，文档根为 `docs`、产物为 `doc_build`、base 为 `/fs-router/`。访问终端 URL 下的 `/fs-router/`。

## 导航和路径兼容

中文内容保持扁平目录，不迁到 `docs/zh`，不增加 `/zh/` 前缀。`lang: zh` 保持 HTML 与搜索语言；显式 `themeConfig.nav/sidebar` 从现有 `_meta.json` 生成，绕过 Rspress 1 在只有 lang 而无 locales 时跳过自动导航的分支。

新增页时更新所属 `_meta.json`。`navigation.ts` 只接受目前使用的 file/dir 条目，未知类型构建报错，避免悄悄遗漏导航。根导航可增加普通链接。

主题扩展修复标题锚点、代码块键盘访问和文字对比度。`patches/` 对固定 Rspress 1.47.2 的搜索键盘处理增加焦点/空结果保护；升级主题时须重验该补丁。

所有现有 Markdown 页面路径保留；英文入口新增 `/english`，不建立不完整的语言切换映射。[English](./english.md) 仅维护精简上手与支持边界。

`docs:check` 检查构建出的每个本地链接、资源、锚点与中文导航；`docs:smoke` 启动并关闭 dev/preview，通过 Chromium 检查搜索、键盘、移动菜单、图片和基本无障碍。证据写到 `.artifacts/browser`，可重复生成。CI 也运行这些检查。

[部署流程](./deployment-guide.md) 保持现有 main → Pages 权限边界。
