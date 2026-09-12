# 30/60/90 天真实采用计划

这是维护者可批准执行的计划。Day 0 是维护者确认可试用提交、反馈渠道和可投入时间的日期，不是本页提交日。若发布或反馈处理能力未准备好，保留候选版试用阶段；不以追赶日历为由公开发布。数据核验于 **2026-09-12**，不承诺下载量、搜索排名或 Star 增长。

## 基线和口径

公开 API 快照见[基线 JSON](https://github.com/givingwu/fs-router/blob/main/.github/community-baseline-2026-09-12.json)。本项目自己的验证、所有者账号提交和依赖机器人活动都不能算外部采用。

| 指标 | 当前基线 | 数据源、口径和限制 |
| --- | --- | --- |
| 版本可用性 | npm latest 0.0.13；仓库候选 0.1.0 | `npm view @feoe/fs-router dist-tags --json`；未发布修复不能算已到用户 |
| 完整 28 天下载量 | 2026-08-15 至 09-11：23；前窗 07-18 至 08-14：44，变化 -21（约 -47.7%） | npm downloads API，全包所有版本；不是独立用户/生产安装数，含 CI/重复安装且不含本地 tarball |
| 有记录的外部试用反馈 | 0 条已记录；外部实际使用人数未知 | 当前公开 Issues 列表为空；无法由“没人开 Issue”推断没人用，后续按自愿反馈记录 |
| 有效外部贡献 | 已合并 PR 中，非 owner、非 bot 的作者 0；合并 PR 5 个均为 owner 账号 | GitHub PR API；此数不证明作者是否借助自动化，也不包含未被识别的历史协作。以后计被接受的复现、测试、文档或修复，分别报数量与独立贡献者 |
| 首次维护响应 | N/A，普通 Issue 样本 n=0 | 从创建到首条有实质内容的维护者回复，单位小时；不计 bot、表情和自动确认。报告样本量、已回复中位数及最久未回复年龄，不把无人报告写成 0 小时 |
| 继续验证/实际采用 | 未知 | 完成示例不等于接入；只有本人自愿说明在非演示项目继续使用，才计一例；无需公开项目身份。持续采用需下一次自愿反馈确认 |
| 发现入口 | 1 Star、0 fork；About 旧描述，topics 空；homepage 已正确 | GitHub repository API。Star 仅背景，不用作采用 KPI；community profile 71% 仅文件完整度信号，不是安全认证 |
| 仓库 traffic / Pages 搜索 | 未采集（N/A） | GitHub traffic 需相应权限且通常只保留近 14 天，按周导出才可比较；仓库访问不等于 Pages 访问。没有声称已配置站点分析或 Search Console |

npm 数值来源：[当前 28 天窗口](https://api.npmjs.org/downloads/point/2026-08-15:2026-09-11/@feoe%2Ffs-router)、[前 28 天窗口](https://api.npmjs.org/downloads/point/2026-07-18:2026-08-14/@feoe%2Ffs-router)；接口含义见 [npm 下载计数文档](https://github.com/npm/registry/blob/main/docs/download-counts.md)。GitHub traffic 的窗口和访问约束见[官方说明](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository)。

## 先检验三个假设

| 假设 | 可执行实验 | 判断后采取什么行动 |
| --- | --- | --- |
| H1：候选包获取步骤是首个试用阻碍 | 使用[演示脚本](./communication.md)，记录每个自愿参与者停在哪一步和错误；区分安装/版本/理解问题 | 只要出现可复现的安装失败就先修；若都完成但没有继续意愿，询问场景差距，不据此认定获取步骤足够好 |
| H2：保留 React Router 与既有构建器有实际价值 | 收集为何愿意试用或选择手写 route objects / 其他路由的原因，按[选型页](../guide/choosing.md)核对限制 | 若主要需求是 SSR/另一套路由 API，改进选型文案而不盲目扩展范围；若是混合路由冲突，先补最小复现 |
| H3：明确的小任务能产生可接受贡献 | 开放 C1/C2 的领取流程，记录从认领到首个 review 的阻碍和返工原因 | 无人认领不等于任务无价值；先检查曝光和任务说明。出现同类返工则补验收示例或缩小范围 |

这是方向性判断，不是有统计功效的实验。样本少时保留逐条匿名问题分类及公开证据链接，不展示虚构转化率。

## 执行节奏

| 窗口 | 要完成的工作 | 验收/复盘与下一步 |
| --- | --- | --- |
| Day 0–30：可试用与可反馈 | 所有者审查治理/联系渠道；确认一个候选提交及 demo；按发布流程决定是否推进 npm。维护者批准具体渠道后，发布一次适用场景明确的介绍，接收自愿试用，不批量私信。每周汇总阻碍，处理 P0/P1 | 保存候选版本、验证命令和真实反馈；首轮以最多 3 次自愿试用作为工作量预算，不是获客承诺。若无人参与，记 n=0 和未检验假设；若安装阻断仍在，暂停扩大介绍 |
| Day 31–60：修复阻碍与贡献 | 选真实反馈中影响最大的一个问题交付 PR；允许贡献者领取 C1/C2，按可用时间 review；核对被合并内容和发布状态 | 报有效外部贡献及独立作者数、响应中位数/未回复年龄；有继续验证者时征得同意再收集反馈。没有外部数据就改进任务说明与选型入口，不编案例 |
| Day 61–90：复核持续使用 | 仅对愿意继续反馈的人确认是否仍使用、暂停原因；比较等长完整下载窗口，梳理维护负担；有可复查事实并获本人同意后才准备匿名案例草稿 | 交付一次证据复盘：继续/缩小/暂停介绍的理由，下一项路线图及维护容量。若外部收益仍未知或响应积压，优先维护，不扩大承诺 |

计划负责人建议由仓库所有者确认；贡献者自愿领取具体工作。周度复盘是拟议投入节奏，不是公开支持 SLA。每次对外发帖、个别联系、收费投放、权限或发布动作均需具体授权；目前只交付草稿。

## 可复制反馈和复盘记录

用 blank issue，标题可为 `Trial feedback: <bundler> at <version/commit>`，仅填写自愿公开的内容：

```text
版本/提交与本地 tarball 或 npm：
Node、OS、React/DOM、Router、构建器：
尝试的步骤与完成情况：
首个阻碍、脱敏错误和最小复现：
继续验证 / 暂停 / 不适合，以及原因：
是否愿意在本 Issue 后续反馈（可选）：
```

每周维护记录：UTC 起止时间、受测提交、反馈条数与完成/阻断条数、继续验证人数（未知保留未知）、有效外部贡献和作者数、响应样本 n/中位数/最久未回复年龄、npm 窗口/原始计数、证据链接、下周一项行动。只汇总自愿反馈和公开事实，不收集公司名称、私人身份或埋点身份，不擅自引用他人的原话/Logo。

## 发现入口的精确建议

以下是待审改动，未执行账号或仓库元数据写入：

| 入口 | 当前值 | 建议值/动作 |
| --- | --- | --- |
| GitHub description | `Implementation is a routing system based on Modern.js file-system routes style` | `File-based routing and typed navigation for existing React Router apps. Vite, Webpack and Rspack adapters.` |
| GitHub topics | 空数组 | `react`, `react-router`, `typescript`, `file-based-routing`, `typed-navigation`, `vite`, `webpack`, `rspack` |
| GitHub homepage | `https://givingwu.github.io/fs-router/` | 保留 |
| npm description/keywords | 源码已在前阶段更新，registry 仍是旧发布 | 正式发布前核对 tarball 元数据；源码修改不等于 registry 更新 |
| Pages 标题/摘要/站点地图 | 前阶段已加入中英文入口与 sitemap | 本阶段增加选型和贡献入口，继续通过 docs:build/check 校验；不保证索引或排名 |

批准后可由维护者执行（先重新读取当前值，避免覆盖后来的调整）：

```sh
gh repo view givingwu/fs-router --json description,homepageUrl,repositoryTopics
gh repo edit givingwu/fs-router --description 'File-based routing and typed navigation for existing React Router apps. Vite, Webpack and Rspack adapters.' --add-topic react,react-router,typescript,file-based-routing,typed-navigation,vite,webpack,rspack
gh repo view givingwu/fs-router --json description,homepageUrl,repositoryTopics
```

回退方案：恢复上表原 description，仅移除本次新增的 topics，保留后来新增的内容和原 homepage。这些动作不是本 PR 的副作用。

## 需要维护者决定

1. 确认行为报告使用公开 owner 邮箱是否合适；可直接审查本 PR 的行为准则，若需专用地址必须先真实开通。GitHub 私密漏洞报告仍未启用，开启属于另行批准的安全设置，之后更新 SECURITY.md。
2. 接受或修改上面的 About/topics 精确文本；确认 Day 0、可投入的周度维护时间及是否有能力回应反馈。
3. 按[发布流程](./release.md)批准候选版本、提交、dist-tag 和发布权限；在此之前所有介绍保留“未发布候选版”。
4. 选择[介绍草稿](./communication.md)的具体版本、渠道和时机。没有实际批准，不发帖、不发送邀请、不创建推广账号或付费服务。
