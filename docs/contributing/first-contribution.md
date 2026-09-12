# 入门贡献任务

2026-09-12 按 main `ced7ac9` 核查。下列任务尚未领取，也没有伪造 GitHub Issue 编号。开始前搜索已有 Issue/PR；用 C1/C2 开普通 Issue 协调范围。只修拼写可直接提 PR。英文提交同样欢迎，详见[贡献流程](https://github.com/givingwu/fs-router/blob/main/CONTRIBUTING.md)。

## C1

**让三个保留配置字段的 IDE 提示与文档一致。**

证据：`src/plugin/config.ts` 的 `defaultErrorBoundary`，以及 `src/router/route-type-generator.ts` 的 `generateRouteParams` / `generateLoaderTypes`，注释仍表示功能开关；[兼容性页](../guide/compatibility.md)明确这些字段保留类型兼容但不改变当前行为。

范围：仅修改以上字段的 JSDoc，说明当前没有对应开关行为、loader 返回类型不自动生成，并指向兼容性说明。不删除字段、不更改默认值、不实现新功能；是否正式加 `@deprecated` 由维护者先决定，避免无意给下游产生新的诊断政策。

验收：逐个核对三个字段与真实读取位置；IDE hover/产出声明的说明不再承诺未实现行为；`pnpm check`、`pnpm typecheck`、`pnpm build`、`pnpm check:package` 通过。无需为注释新增单元测试。PR 写明检查到的字段和声明片段。

## C2

**在最小示例中演示已有的 query 编码与读取。**

证据：`tests/consumers/verify.mjs` 已验证 `buildHref('/users/:id', {id: 42}, {q: 'a b'})` 输出 `/users/42?q=a+b`；`examples/minimal-react/src` 和 `tests/browser/example.spec.ts` 当前只演示用户 ID，没有可操作的 query 场景。这是演示缺口，不是已确认的编码缺陷。

范围：使用已有导航 API，增加一个名字明确的按钮导航到用户 42 并带 `q: 'a b'`；在用户页用 React Router 的 search params API 显示解码值。复用虚构用户，不加依赖/后端，不修改库 API。

验收：在现有三构建器 production 浏览器场景中点击新按钮，断言 URL 查询值为 `a b`、界面显示同值、刷新后仍然一致，原有 loader/error/catch-all 断言保留；更新示例 README 的操作说明。执行 `pnpm example:setup`、`pnpm example:check`、`pnpm example:smoke`，PR 附命令和三种构建器结果。不要把 query 演示描述成业务参数验证或完整类型安全的 search schema。

## 领取后如何交付

提交一个范围对应的小 PR，说明问题、文件变化、执行命令和未验证之处。遇到 blocker 可以在协调 Issue 中说明；无需公开真实业务代码。维护者审查后更新[路线图](https://github.com/givingwu/fs-router/blob/main/ROADMAP.md)的状态，而不是提前把尚未完成的任务标为成果。
