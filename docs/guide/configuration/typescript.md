# TypeScript 配置

生成 TSX 面向 `moduleResolution: "Bundler"`。最小示例使用 TypeScript 5.9.3、严格模式且不跳过依赖声明检查。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": false,
    "allowImportingTsExtensions": true,
    "esModuleInterop": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

先运行构建生成 `routes.tsx` / `routes-type.ts`，再执行 `tsc --noEmit`，否则干净检出时可能找不到模块，或导航路径变为 `never`。

默认生成声明会增强 `@feoe/fs-router` 的 `RouteTypes`；不要复制旧声明或手写覆盖来掩盖缺失生成的问题。React 类型需与 React 主版本匹配，并安装 `@types/react-dom`、`@types/loadable__component`。

插件 `alias` 只改变生成的导入，不会自动配置 TS 的 `paths` 或构建器 alias。最小示例直接使用默认路径，避免不必要的别名。

公共包入口另有 Bundler / NodeNext ESM、CJS 消费者验证；这不代表生成 TSX 可直接在 Node 中执行。[支持矩阵](../compatibility.md) 记录边界。
