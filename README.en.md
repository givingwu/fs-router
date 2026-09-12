# @feoe/fs-router

Generate file-based React Router routes for an existing React/TypeScript client application using Vite, Webpack or Rspack.

[English quick start](https://givingwu.github.io/fs-router/english) · [English source guide](./docs/english.md) · [中文](./README.md) · [Runnable example](./examples/minimal-react)

The 0.1.0 candidate is **not published**. Try the local tarball with Node 22.12+ or Node 24 LTS:

```sh
git clone https://github.com/givingwu/fs-router.git
cd fs-router
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run dev
npm --prefix examples/minimal-react run build:all
```

Use it when you want file conventions and typed navigation while retaining your existing client build. The example uses fictional data and needs no account or backend.

Tested baselines: React/React DOM 18.3.1 or 19.2.8, Router DOM 7.18.3, Vite 6.4.3, Webpack 5.110.3, Rspack 1.7.12 and TypeScript 5.9.3. See the [support matrix](./docs/guide/compatibility.md) for precise evidence.

Navigation types apply to this library's hook. Non-root components are lazy-loaded by default; loaders remain client-side static imports. Route structure edits can reload the page. SSR, RSC, Router 6, server-only loaders and performance leadership are not supported claims.

[Contribute](./CONTRIBUTING.md) · [Security](./SECURITY.md) · [MIT license](./LICENSE)
