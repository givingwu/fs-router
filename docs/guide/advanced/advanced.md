# 进阶功能

在最小路由可运行后，按需求增加功能：

- [数据获取](./data-fetch.md)：把客户端 loader/action 接到 Data Router。
- [类型安全](./type-safety.md)：路径声明与本库导航 hook。
- [配置](../configuration/plugin-options.md)：扫描、输出、扩展名、别名和分包。

## 分包与监听

默认 `splitting: true`，使用 `@loadable/component` 懒加载非根组件；根布局和 loader 是静态导入。设为 false 会使用静态组件导入，不生成懒加载占位。实际收益需用应用的生产构建测量。

增删约定文件会重新生成路由，输出未变时不重写文件。Vite 的结构变化可能整页刷新；React 组件编辑的 Fast Refresh 由应用 React 插件负责，不保证状态始终保留。

## 应用负责的部分

鉴权、服务端请求代理、缓存、SSR、RSC 和微前端路由挂载不属于本库的已验证能力。需要这些功能时先设计应用边界，再评估是否引入文件路由；不要把扫描多个类型目录当成运行时集成。
