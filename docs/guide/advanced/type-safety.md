# 类型安全

构建插件默认生成 `src/routes-type.ts`，通过声明合并扩充包公开的 `RouteTypes`。它必须被应用 TypeScript include，且首次 `tsc` 前需运行一次生成。

## 被检查的内容

使用 `@feoe/fs-router` 的 `useNavigation` 时，未知路径、缺少必填参数和错误参数名会产生类型错误。可选参数可以省略；query 为 `Record<string, string>`，不做业务字段推导。

```tsx
import { useNavigation } from '@feoe/fs-router';
function OpenUser() {
  const navigation = useNavigation();
  return <button onClick={() => navigation.push('/users/:id', { id: '42' })}>打开用户</button>;
}
```

此代码要求已有 `users/[id]/page.tsx`。最小示例的 `src/navigation.typecheck.ts` 包含正反例；`npm run build:all` 在生成后用严格 TypeScript 检查它。

## 边界

- React Router 的 `Link`、`useNavigate`、`useParams` 不会自动获得本库路径约束。
- loader 返回类型需显式引入；`generateLoaderTypes` 和 `generateRouteParams` 是兼容保留字段，不控制生成行为。
- 类型不校验输入安全性、ID 是否存在或服务端权限。
- `routesDirectories` 合并的是类型扫描结果，不负责挂载远程运行时路由。

配置见 [TypeScript](../configuration/typescript.md)，公开类型见 [API](../../api/types.md)。
