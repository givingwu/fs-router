# 第二阶段验证记录

基线为第一阶段已合并的 `be290ba`，执行日期 2026-09-12，本地 macOS arm64。本记录针对尚未发布的 `@feoe/fs-router@0.1.0`。公开源码、文档、示例内容与生成包中已复核公司相关文字和工作区链接；移除发现的私有文档入口、示例中的推广卡片，示例邮箱/站点改用保留的 example.com。必要开源许可证与技术来源保留。

## 已修复的实际问题

- 原导出只检查文件存在，缺少可供 CJS 使用的类型分支；现在四个入口分别提供 ESM/CJS 类型。旧 Rslib 的多入口声明打包不能直接使用，改为独立 tsc + API Extractor，为每个入口生成声明。消费者严格检查暴露的 Vite CJS 类型导入问题已经修复。
- React Router 从运行时依赖移到应用 peer，迁移到 7.18.3；修复导航必需参数条件类型。React 与 React DOM 配对安装，支持范围由 fixture 确定。
- 默认别名与类型生成不符合零配置描述；现在默认生成无需别名的 runtime 和导航声明。扫描类型路径使用与 runtime 相同的扩展名、分组/动态解析和符号链接忽略约定，移除不再需要的 glob 和 chokidar 依赖。
- 修复 named action、伴随文件扫描顺序、布局 loader 丢失、生成代码转义和输出路径边界，拒绝重复约定、终端路由和 route id。
- 使用宿主 watcher、串行生成、内容比较和临时文件替换。文件删除与扫描交叉时有限重试；Webpack/Rspack 在编译前生成并失效生成模块缓存。连续编辑可产生暂时诊断，验证等待实际模块图更新后的成功编译。
- 发布默认只预览；npm 11/12 的 pack JSON 格式均兼容。OIDC 权限仅在显式启用、main、受保护环境的 publish job 中授予；发布已验证的原始 tarball。

## 验证命令与结果

| 环境或检查 | 结果 |
| --- | --- |
| Node 24.20.0 / npm 12.0.2 / pnpm 10.34.5 | frozen install、Biome、类型检查、36 项单元/回归测试通过 |
| Node 22.12.0 / npm 11.19.0 / pnpm 10.34.5 | 类型检查、36 项测试及同一最终 tarball 的消费者验证通过；较早一轮也实际执行了此 Node 下的完整声明/库构建 |
| React 18.3.1 与 19.2.8，各在上述两条 Node 线上 | tarball 安装；四入口 ESM/CJS；strict / skipLibCheck=false 的 Bundler 与 NodeNext ESM/CJS；未知路由/遗漏参数的负向类型测试 |
| Vite 6.4.3、Webpack 5.110.3、Rspack 1.7.12 | 每组消费者都实际构建 eager/lazy 两种模式，验证 split chunks；执行生成路由的 matchRoutes、loader、named action 和导航 hook |
| 热更新 | Vite 新增、修改数据模块导出、删除路由；Webpack/Rspack 新增/删除后实际模块图和编译恢复均验证 |
| 文档 | 36 HTML，326 静态资源引用，维持 `/fs-router/` |
| 重建一致性 | 同一 Node 24.20.0 / npm 12.0.2 环境重新构建和打包，SHA-512 与最终消费者验证包完全相同 |
| npm publish --dry-run --ignore-scripts | 对最终 tarball 通过；没有上传包、没有验证服务端 OIDC |
| 工作流 | actionlint 1.7.12，通过官方 SHA256 核验；全部工作流检查通过。未运行 ShellCheck |
| 依赖审计 | 根全依赖 0 critical / 0 high / 2 moderate；生产依赖 0 告警 |
| Git | diff whitespace 检查通过；以 PR 交付，不自动合并 |

可复现命令：

```sh
pnpm install --frozen-lockfile
pnpm check && pnpm typecheck && pnpm test
pnpm check:consumers
pnpm docs:build && pnpm docs:check
npm publish ./.artifacts/feoe-fs-router-0.1.0.tgz --dry-run --ignore-scripts --access public
```

Node 22.12 使用 require(ESM) 时可能产生实验性提示，实际加载与执行已通过；建议日常使用最新 LTS 安全补丁。npm 11/12 在 pnpm 子进程中会提示部分 pnpm 环境配置不属于 npm 配置，不影响本次结果。没有把这些提示隐藏为零日志。

## 包预览

- 版本：0.1.0（Unreleased）。
- tarball：`feoe-fs-router-0.1.0.tgz`，55181 bytes；解包 294430 bytes。
- 共 19 个文件：四入口各 JS/CJS/DTS/DCTS，另有 package.json、README、MIT LICENSE；没有测试、示例、工作区文件或 source map。
- integrity：`sha512-8zMKosSvOSPgyzKT6hPjNVFvUyvh+QNyCkbnufo7d/MDxcOl+SLgvOz6uj+OpGMO/wo0EMh5+XVF3aIVJiI5dQ==`。
- 精确清单由 `.artifacts/package-preview.json` 输出，预览工作流将其与 tarball 一起保存。

## 支持边界与后续事项

1. [支持矩阵](../docs/guide/compatibility.md) 与 [迁移清单](../docs/guide/migration/v0.1.md) 明确 Node/peer、默认别名、默认类型生成、输出边界和路由冲突等不兼容变化；只承诺列出的实测组合。
2. 两条中危来自开发文档依赖链 `@rspress/theme-default → @rspress/runtime → react-router-dom@6.30.6`，不在库发布的 dependencies 中。独立旧示例的历史风险没有随本次根库更新而自动消失；仍需要后续升级和验证。
3. `.config.ts` 合并、自动 loader 返回类型、defaultErrorBoundary 等旧文档中未实现的功能明确标为限制；无 SSR/RSC、Windows、其他构建器主版本或浏览器 E2E 认证。
4. npm/仓库权限均未修改，未创建公开版本、标签或 GitHub Release。[发布与回滚流程](../docs/contributing/release.md) 给出管理员精确配置和实际授权步骤。dry-run 不证明 OIDC 或 provenance 已成功签发。
5. CI 配置为 Ubuntu 的 Node 22.12.0 / 24.20.0；远程结果由 PR 展示，本地结果不能替代远程 CI 状态。Pages 既有部署工作流保留，只有合并 main 后按原流程部署。
6. 本阶段没有性能主张、竞品排名或虚构采用数据；文档导航、历史示例和剩余章节由后续文档阶段处理。

官方依据链接见支持矩阵及发布页。工作流新用的 upload-artifact v7.0.1、download-artifact v8.0.1 的完整 SHA 已分别通过官方仓库 tag 查询核验。
