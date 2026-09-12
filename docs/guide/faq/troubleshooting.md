# 故障排查

## 生成失败

1. 检查插件已放到正确构建器的 plugins，且没有设 `enableGeneration: false`。
2. 确认项目根目录、`routesDirectory` 和根 `layout.tsx`；目录必须真实存在。
3. 依据错误信息消除重复约定、route id 或等价路径。
4. 生成代码和类型必须互不相同，且位于所有扫描目录外；不能指向符号链接。

修复后观察成功编译。Webpack/Rspack watch 会在生成失败后保留路由目录监听；若应用自定义 watch 配置排除了目录，先用最小示例对比。

## 编译或类型失败

- `Cannot find module './routes'`：先生成再运行 tsc。
- 路径为 `never`：检查生成声明被 include；不要用类型断言绕过问题。
- 无法解析 `@/...`：插件 alias、构建器 alias 和 TS paths 必须一致，或移除 alias。
- JSX 解析失败：Vite 配置 React 插件；Rspack 配置 SWC TSX；Webpack 配置 TSX loader 和扩展名解析。
- 找不到 Loadable/React：显式安装 peer，React 与 React DOM 配对，类型主版本一致。

## 页面空白或深链接 404

先检查浏览器控制台、根元素 id、RouterProvider 与布局 Outlet，再查看 Network 的 HTML/JS 响应。客户端应用生产主机需要 history fallback；Vite preview 的成功不能证明线上主机配置正确。

文档站是 Rspress 静态页面，沿用 `/fs-router/`，其路径规则与示例应用不同。文档开发、构建和预览统一使用仓库脚本，见[文档维护](../../README.md)。

## 提供可复现报告

在 [GitHub Issues](https://github.com/givingwu/fs-router/issues) 提供 Node/React/Router/构建器版本、最小目录、插件配置、完整错误以及预期 URL。先在 `examples/minimal-react` 复现；只使用虚构数据并移除令牌、本机私有路径和非公开链接。
