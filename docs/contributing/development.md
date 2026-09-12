# 开发环境

使用 Node 22.12+ 或 24 LTS 的最新安全补丁与 pnpm 10.34.5。在仓库根目录：

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

生成目录 `dist`、`doc_build`、`.artifacts` 和示例生成的路由声明不提交。只改文档也需检查导航、链接与页面表现，详见[文档维护](../README.md)。

贡献流程见[仓库指南](https://github.com/givingwu/fs-router/blob/main/CONTRIBUTING.md)，发布操作见[发布流程](./release.md)。
