---
title: File-based routing for React — English quick start
description: Add file-based React Router routes and typed navigation to an existing React/TypeScript app with Vite, Webpack or Rspack. Run the minimal example locally.
---

<div lang="en">

# English quick start

fs-router generates React Router route objects and navigation declarations from files in an existing React/TypeScript client application. Keep your Vite, Webpack or Rspack build and create your own Data Router.

This documentation describes the **unpublished 0.1.0 candidate**, not the older npm release. The local example installs a freshly built tarball; no account, hosted demo or backend is required.

## Run the example

Use Node 22.12+ or a current security patch of Node 24 LTS and pnpm 10.34.5:

```sh
git clone https://github.com/givingwu/fs-router.git
cd fs-router
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run dev
```

Open the local URL. Navigate to `/users/42` to see fictional loader data. The home page includes a counter and typed navigation. Build all three adapters with:

```sh
npm --prefix examples/minimal-react run build:all
npm --prefix examples/minimal-react run preview
```

[Example source](https://github.com/givingwu/fs-router/tree/main/examples/minimal-react) includes HTML, TypeScript settings and complete bundler configs. Setup installs locked public dependencies and then the local candidate package without a workspace link. Rerun it after changing the library.

## Files and integration

Use `@feoe/fs-router/vite`, `/webpack` or `/rspack` for the build plugin. React, React DOM, React Router DOM and Loadable are application peer dependencies. Keep the package in dependencies when importing its runtime hook.

| File | Meaning |
| --- | --- |
| `src/routes/layout.tsx` | Required root layout; render children with `Outlet` |
| `src/routes/page.tsx` | Index page |
| `src/routes/users/[id]/page.tsx` | `/users/:id` |
| `page.data.ts` next to a page | Named client `loader`, optional `action` |
| `page.loader.ts` | Default-exported loader |
| `loading.tsx` / `error.tsx` | Component chunk fallback / Router error boundary |
| `$.tsx` | Catch-all page |

The plugin generates `src/routes.tsx` and `src/routes-type.ts` outside the scanned directory. Include both in TypeScript; build before running `tsc` on a clean checkout. Pass the generated `routes` to `createBrowserRouter`, then render `RouterProvider`.

```tsx
import { useNavigation } from '@feoe/fs-router';
function OpenUser() {
  const navigation = useNavigation();
  return <button onClick={() => navigation.push('/users/:id', { id: '42' })}>Open user</button>;
}
```

With generated declarations, this hook checks paths and required parameters. React Router's own `useNavigate` and `Link` do not gain these constraints. Runtime input validation is still your responsibility.

## Tested baseline and limits

React/React DOM 18.3.1 and 19.2.8; Router DOM 7.18.3; Vite 6.4.3; Webpack 5.110.3; Rspack 1.7.12; TypeScript 5.9.3. See the [full support matrix (Chinese)](./guide/compatibility.md) for exact evidence and untested environments.

The runnable example pins React/React DOM 18.3.1, types 18.3.31/18.3.7 and Vite 6.4.3 with React plugin 4.7.0. React 19.2.8 is verified separately by the packaged consumer suite. Update each related set together and check the library's peer ranges before changing majors.

Default splitting lazy-loads non-root components; root layout and loaders remain static imports. Loaders/actions run in the client module graph. `loading.tsx` handles component loading, not all data pending states. Structural edits may reload the page; React Fast Refresh belongs to the application's React plugin.

SSR, RSC, server-only loaders, Router 6, automatic loader-result types and framework deployment are not supported claims. There are no published performance comparisons. Older feature-heavy examples are historical references outside the current matrix.

[Chinese quick start](./guide/start/getting-started.md) · [API](./api/index.md) · [0.1 migration](./guide/migration/v0.1.md) · [Troubleshooting](./guide/faq/troubleshooting.md) · [Report an issue](https://github.com/givingwu/fs-router/issues)

## Contributing and feedback

Chinese and English contributions are welcome. Read the [bilingual contribution guide](https://github.com/givingwu/fs-router/blob/main/CONTRIBUTING.md) for the fork-to-PR workflow and checks, and the [Code of Conduct](https://github.com/givingwu/fs-router/blob/main/CODE_OF_CONDUCT.md) for participation and reporting channels. [Starter tasks](./contributing/first-contribution.md) and the [selection guide](./guide/choosing.md) are currently in Chinese.

Use the [bug/feature forms](https://github.com/givingwu/fs-router/issues/new/choose), or a blank issue for questions and trial feedback. Include the version/commit, environment, completed steps, first obstacle and reason to continue or stop. Private application code is not required. [Support](https://github.com/givingwu/fs-router/blob/main/SUPPORT.md) is best effort with no response deadline. Report vulnerabilities through [SECURITY.md](https://github.com/givingwu/fs-router/blob/main/SECURITY.md), not a public reproduction.

</div>
