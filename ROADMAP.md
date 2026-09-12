# 路线图

基线：2026-09-12，main `ced7ac9`。按真实代码、已合并验证记录和公开待审 PR 排序。以下是待办及完成条件，不是已实现能力或发布日期承诺；没有预先指派贡献者。

| 优先级 | 真实问题与依据 | 下一步和验收 | 决策/依赖 |
| --- | --- | --- | --- |
| P0 发布前 | npm 仍为 0.0.13，0.1.0 修复未到用户；私密漏洞报告未启用 | 复核候选 tarball、迁移页和预览摘要；按发布流程批准版本/信任配置；实际核对 registry 版本、integrity 和 provenance。启用私密报告后更新 SECURITY.md | 所有者批准账号设置和正式发布；[发布流程](./docs/contributing/release.md) |
| P1 | 旧大示例不在最小示例验证范围，根文档开发树还有中危依赖告警 | 每个独立依赖树单独安装、审计、构建；记录可达性与升级/归档取舍，保留可复现命令。不能用根审计结果覆盖它们 | 见[安全审计](./.github/security-audit-2026-09-11.md)和[文档验证](./.github/docs-validation-2026-09-12.md)；一次处理一个树 |
| P1 | Dependabot 的 [#6](https://github.com/givingwu/fs-router/pull/6)、[#8](https://github.com/givingwu/fs-router/pull/8) 分开升级 React 配对包；[#7](https://github.com/givingwu/fs-router/pull/7) 提议 Vite 8，超出现矩阵 | 协调 React/DOM 与类型成对版本，逐一运行三个构建器和浏览器测试；Vite 主版本先评估插件与 peer/迁移，未经验证不扩大支持 | 当前只是待审依赖提案，不自动合并；状态可能变化，领取前重查 |
| P1 小任务 C1 | 保留但未实现的配置字段仍有易误导的源码注释 | 修正三个字段的 JSDoc，让 IDE 提示与兼容性页一致；不改变 API 或运行行为 | [C1 验收](./docs/contributing/first-contribution.md#c1) |
| P2 小任务 C2 | query 编码已有消费者断言，最小示例尚无可操作演示 | 加入虚构 query 的导航与显示，并在现有三构建器浏览器场景验证 URL 编码/刷新 | [C2 验收](./docs/contributing/first-contribution.md#c2)；不是新增 query 类型系统 |
| P2 待实测 | Windows 与 Firefox/WebKit 尚无验证证据 | 分平台记录安装/消费者或浏览器失败，修复真实问题后扩展 CI；仅对实际通过的组合更新矩阵 | 不将“配置了任务”写成“平台已支持” |
| P2 产品取舍 | `*.config.ts` 合并、loader 返回类型生成等旧声明尚未实现 | 从复现和试用反馈选择一个需求；公开比较实现、弃用或移除方案及迁移成本，再开小 PR | 不在没有场景时一次实现所有历史承诺 |

先完成发布可用性和阻断试用的问题，再按[30/60/90 天采用计划](./docs/contributing/adoption.md)决定是否扩大介绍。SSR/RSC、竞品性能排名、自动关 Issue 和 Star 增长保证不属于已承诺工作。

若要领取任务，先搜索 Issue/PR，再用任务编号开一个普通 Issue，给出拟修改文件和验收命令。维护者确认范围后同步此表的链接与状态；不要为填满任务列表批量创建无人接手的 Issue。
