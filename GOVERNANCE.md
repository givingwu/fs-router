# 项目治理 / Governance

fs-router 采用轻量的所有者维护模式。仓库所有者 [Giving Wu (`givingwu`)](https://github.com/givingwu) 负责合并、发布和项目方向的最终决定；贡献者通过公开 Issue/PR 提供复现、方案与审查意见。当前治理文件未记录其他承担这些职责的维护者或委员会，也没有商业支持承诺。权限以 GitHub 实际配置为准，本文不授予权限。

## 决策和维护

- 小修复直接提 PR。公共 API、文件约定、路由匹配、最低版本或依赖主版本变化，先用 feature form 记录场景、替代方案、兼容性、验证方法和迁移成本，再实施可审查 PR。
- 维护者按影响和复现证据处理：安全问题走 SECURITY.md；数据/生成文件损坏、错误路由、构建阻断优先于新能力和推广。无法重现时说明缺失信息，不将报告者拒之门外。
- Review 核实行为、测试、文档和依赖风险。合并前查看当前提交的必需 CI 检查；失败则修复或明确解决验证问题，不以旧提交绿灯替代。不得让 fork PR 接触发布凭据。
- 在对应 Issue/PR 留下接受、延期或拒绝的理由、替代方案及重议条件。相同提案可以提供新证据请求重议；长期设计决定链接到实现和迁移页。
- PR 合并不自动发布 npm。版本、预览、OIDC 配置、批准和回滚沿用[发布流程](./docs/contributing/release.md)。Pages 继续由既有 main 工作流管理。
- 按[路线图](./ROADMAP.md)记录优先级，合并后更新实际完成项。路线图没有日期保证；新证据和维护能力可以改变顺序。

有效反馈不由 stale bot 自动关闭。重复项链接到原项；已解决项引用修复提交及发布状态；缺信息时明确请求，再由维护者判断是否保留或关闭，补充新证据可以重开。依赖机器人 PR 也需人工审查，尤其 React/React DOM 配对和构建器主版本，不能按“最新”自动扩大支持范围。

## 角色、支持和持续维护

贡献记录不自动赋予合并、发布或账号权限。需要增加维护者时，所有者与候选人先确认职责和意愿，再通过治理 PR 记录范围、联系方式及权限变更方案，按实际批准执行。没有人被默认分配持续工作。若所有者无法继续维护，应在 README 和支持政策说明状态、未处理的重要问题以及已确认的交接安排，不伪造接任者。

用户支持、版本范围和响应约束以 [SUPPORT.md](./SUPPORT.md) 为入口；漏洞政策唯一来源为 [SECURITY.md](./SECURITY.md)；行为处理按 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

English: the repository owner makes final merge, release and direction decisions. Discuss compatibility changes in an issue, record reasons and migration evidence, and review CI before merge. Contributions do not confer permissions. Support is best effort, without an SLA; valid feedback is not closed by an inactivity bot.
