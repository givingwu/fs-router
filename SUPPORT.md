# 支持政策 / Support

中文和 English 均可。普通问题、集成困惑和试用反馈使用 [GitHub Issues](https://github.com/givingwu/fs-router/issues/new/choose)。Bug/feature 有表单，其他情况可选 Blank issue。当前未启用 Discussions，没有另设聊天群或付费支持渠道。

请说明包版本或源码提交、Node/React/Router/构建器版本、最小路由树及复现步骤。尽量用[最小示例](./examples/minimal-react/README.md)复现；不要提供商业项目、内部地址、凭据或私人数据。缺少代码也可以先描述阻碍。维护者按可用时间处理，不承诺首次响应或修复时限。

## 版本范围

2026-09-12 核验：npm `latest` 是 **0.0.13**；仓库 **0.1.0 是未发布候选版**。仓库修复不代表已发布，试用候选版走本地 tarball。安全修复先进入 main，旧版本无独立维护分支，与 [SECURITY.md](./SECURITY.md) 一致。

当前受测范围和边界以[兼容性矩阵](./docs/guide/compatibility.md)为准：Node 22.12.0/24.20.0、React 18.3.1/19.2.8、Router DOM 7.18.3 及表列的三种构建器。尚未验证的新主版本、Windows、其他 JS runtime 或 SSR/RSC 不能仅由 peer 范围推断为受支持。旧版本的问题仍欢迎报告，修复方案可能要求迁移至候选版或之后发布版。

先查[迁移说明](./docs/guide/migration/v0.1.md)和已存在的 Issue/PR。有效反馈不因时间自动关闭；关闭时说明理由、相关修复或重复项，补充证据后可以重开。

漏洞只按 [SECURITY.md](./SECURITY.md) 的渠道报告；不要公开漏洞细节。行为问题按 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) 处理。所有者公开的一般联系邮箱并不改变安全政策中的私密报告渠道状态。

English: use a blank GitHub issue for questions or trial feedback and the forms for bugs/features. Include versions and a sanitized reproduction. The npm release and repository candidate differ; consult the compatibility and migration guides above. There is no response-time guarantee or separate maintenance branch for old versions. Follow SECURITY.md for vulnerabilities and CODE_OF_CONDUCT.md for conduct reports.
