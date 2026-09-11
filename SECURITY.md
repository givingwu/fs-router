# 安全政策

## 支持范围

安全修复先提交到 `main`，再由维护者审查并决定发布。项目处于 0.x 阶段，旧版本没有独立维护分支；使用者应关注后续发布与安全公告。仓库中的修复不代表 npm 已发布该修复。

开发与 CI 验证 Node.js 22、24 LTS，建议使用各自最新安全补丁。构建插件会读写本地路由文件，仅对可信项目运行。开发服务器不应直接暴露到公网。

## 报告漏洞

截至 2026-09-11，本仓库的 GitHub Private Vulnerability Reporting **尚未启用**，也没有经核验的私密安全邮箱。

- 如果 [Security 页面](https://github.com/givingwu/fs-router/security) 已显示 **Report a vulnerability**，请使用该私密入口。
- 在入口启用前，可在 [GitHub Issues](https://github.com/givingwu/fs-router/issues/new) 仅请求维护者提供私密报告渠道。不要在公开 issue 中提交漏洞细节、利用代码、凭据或私人数据；等待维护者提供渠道后再发送。
- 普通 bug 可直接在 Issues 报告。

私密报告请包含受影响版本、使用方式、复现条件、影响和可行的缓解措施。维护者会根据可用时间处理；目前不承诺响应或修复时限。请在修复协调完成前避免公开可利用细节。

## 当前已知限制

根包保留 React Router 6 兼容性，仍受以下上游中危公告影响：

- [非预期外部跳转](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6)：不要把攻击者提供的路径直接传入导航 API；类型约束不能替代运行时校验。
- [SSR hydration 构造器注入](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg)：影响特定手动 SSR/hydration 场景；不要让外部输入覆盖序列化错误对象。

两项公告列出的修复版本均为 React Router 7.18.0+，迁移需要单独验证。示例应用有独立依赖树，根包审计结果不覆盖示例；详见 [阶段审计](.github/security-audit-2026-09-11.md)。
