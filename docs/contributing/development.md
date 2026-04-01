# 开发环境

本页面介绍如何设置 @feoe/fs-router 的开发环境。

## 环境要求

在开始开发之前，请确保你的开发环境满足以下要求：

- **Node.js**: >= 16.0.0
- **pnpm**: >= 8.0.0（本项目使用 pnpm 作为包管理器）
- **Git**: 最新版本

## 安装依赖

1. 克隆仓库：

```bash
git clone https://github.com/givingwu/fs-router.git
cd fs-router
```

2. 安装依赖：

```bash
pnpm install
```

## 项目结构

```
fs-router/
├── src/                      # 源代码目录
│   ├── core/               # 核心解析逻辑
│   │   ├── path-parser.ts       # 路径解析
│   │   └── route-file-parser.ts # 路由文件解析
│   ├── hooks/              # React Hooks
│   │   └── use-navigation.ts
│   ├── plugin/             # 构建工具插件
│   │   ├── factory.ts      # 插件工厂 (unplugin)
│   │   ├── vite.ts         # Vite 插件
│   │   ├── rspack.ts       # Rspack 插件
│   │   └── webpack.ts      # Webpack 插件
│   ├── router/             # 路由生成核心
│   │   ├── extractor.ts    # 路由文件提取
│   │   ├── generator.ts    # 路由配置生成
│   │   └── templates.ts    # 代码模板
│   └── types/              # 类型定义
├── docs/                    # 文档目录
├── examples/                # 示例项目
├── tests/                   # 测试文件
├── AGENTS.md                # AI Agent 开发指南
├── package.json
├── tsconfig.json
└── rslib.config.ts         # 构建配置
```

## 开发流程

### 本地开发

1. **构建项目**：

```bash
pnpm build
```

2. **监听模式开发**：

```bash
pnpm dev
```

这会以监听模式运行构建，代码修改后会自动重新构建。

### 开发文档

1. **启动文档开发服务器**：

```bash
pnpm docs:dev
```

2. **构建文档**：

```bash
pnpm docs:build
```

3. **预览文档构建结果**：

```bash
pnpm docs:preview
```

## 测试

运行测试：

```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm test:watch
```

## 代码规范

本项目使用以下工具保证代码质量：

- **TypeScript**: 类型检查
- **Biome**: 代码格式化和 lint
- **simple-git-hooks**: Git 钩子，推送前自动运行测试
- **lint-staged**: 提交前检查暂存文件

### 提交前检查

在提交代码前，会自动运行：

```bash
pnpm test
```

确保所有测试通过后再推送代码。

## 开发插件

如果你要为特定的构建工具开发或修改插件：

### Vite 插件

编辑 `src/plugin/vite.ts`，然后：

```bash
# 在示例项目中测试
cd examples/vite-keep-alive-tabs
pnpm install
pnpm dev
```

### Rspack 插件

编辑 `src/plugin/rspack.ts`，然后：

```bash
# 在示例项目中测试
cd examples/kn-admin
pnpm install
pnpm dev
```

### Webpack 插件

编辑 `src/plugin/webpack.ts`，然后：

```bash
# 创建测试项目
cd examples/webpack-example
pnpm install
pnpm dev
```

## 调试技巧

### 输出调试信息

在插件代码中添加 console.log：

```typescript
console.log('Routes generated:', routes)
```

### 使用 TypeScript 类型检查

```bash
# 类型检查
npx tsc --noEmit
```

## 常见问题

### 依赖安装失败

尝试清理缓存并重新安装：

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 构建失败

检查 TypeScript 版本和配置：

```bash
npx tsc --version
npx tsc --showConfig
```

## 获取帮助

如果遇到问题：

1. 查看 [GitHub Issues](https://github.com/givingwu/fs-router/issues)
2. 在项目中搜索相关代码
3. 创建新的 Issue 寻求帮助
