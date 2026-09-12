# Hook API

## useNavigation

从 `@feoe/fs-router` 导入，在 React Router 上下文内调用。它使用生成的 `RouteTypes` 约束路径；与 Router 同名的 pending 状态 hook 是不同 API。

| 方法 | 行为 |
| --- | --- |
| `push(path, params?, query?)` | 导航到路径 |
| `replace(path, params?, query?)` | 替换当前历史记录 |
| `buildHref(path, params?, query?)` | 返回 URL，不导航 |
| `back()` / `forward()` | 历史后退/前进 |
| `reload()` | 浏览器整页重新加载 |

动态路径的必填参数不能省略；可选参数可省略。参数值接受 string、number、boolean，内部转成字符串；query 是 `Record<string, string>`，由 `URLSearchParams` 编码。不接受额外的 NavigateOptions 参数。

```tsx
import { useNavigation } from '@feoe/fs-router';
export default function OpenUser() {
  const navigation = useNavigation();
  const href = navigation.buildHref('/users/:id', { id: '42' }, { tab: 'profile' });
  return <a href={href}>用户资料</a>;
}
```

上例需要 `users/[id]/page.tsx` 及生成声明。使用 `push` 可执行客户端导航，`a` 标签则遵循浏览器原生导航。

React Router 的 `useNavigation` 来自 `react-router-dom`，用于读取 `state`、`location` 等 pending 状态，不提供本库的 push/buildHref。需要同时使用时给导入起别名。

## pathParser

根入口还导出纯函数 `pathParser(filePath)`，返回路径解析结果，例如 `pathParser('users/[id]/page.tsx').route` 为 `users/:id`。它只解析字符串，不扫描文件、不创建 React Router，也不替代运行时参数校验。完整类型以发布声明为准，文件映射见[约定式路由](../guide/basic/file-based-routing.md)。
