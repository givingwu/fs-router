# 动态路由

`users/[id]/page.tsx` 生成 `/users/:id`。组件中通过 React Router 的 `useParams` 读取 URL 参数：

```tsx
import { useParams } from 'react-router-dom';
export default function User() {
  const { id } = useParams();
  return <h1>用户 {id}</h1>;
}
```

## 可选和通配参数

`users/[[id]]/page.tsx`（或 `[id$]`）生成 `/users/:id?`，可匹配 `/users` 和 `/users/42`。`files/[...path]/page.tsx` 生成 `/files/*`；Router 将剩余路径放在 `params['*']`，并非 `params.path`。

```tsx
import { useParams } from 'react-router-dom';
export default function Files() {
  const params = useParams();
  return <p>路径：{params['*']}</p>;
}
```

`$.tsx` 也使用 `*`。`[[...path]]` 未纳入支持范围，其他规则见[文件约定](./file-based-routing.md)。

## 参数检查

生成声明后，`useNavigation().push('/users/:id', { id: '42' })` 会检查参数名和必填性。URL 输入与接口响应仍需由应用验证；不能仅因为 TypeScript 编译通过就信任参数值。loader 里的参数对象见[数据获取](../advanced/data-fetch.md)。
