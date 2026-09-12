# Minimal React example

A client-only app with fictional data, a required root layout, typed navigation, a dynamic loader, loading/error UI and a catch-all page. No backend, credentials or hosted account.

`users/loading.tsx` is the chunk fallback for the lazy `users/layout.tsx`. The root layout is imported eagerly, so placing a chunk fallback beside it would have no effect. Root pending UI separately reports client loader navigation.

The library is an **unpublished candidate**. From the repository root:

```sh
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run dev
```

Setup builds and checks the tarball, runs `npm ci` for this independent example, then installs the local package without changing the public dependency lock. Rerun setup to consume library changes. Do not substitute the old npm version.

```sh
npm --prefix examples/minimal-react run build:all
npm --prefix examples/minimal-react run preview
npm --prefix examples/minimal-react run preview:rspack
npm --prefix examples/minimal-react run preview:webpack
```

Each build generates routes before `tsc --noEmit`. Vite serves at its printed URL; Rspack/Webpack previews use ports 4174/4175 and bind only to loopback. Stop each server with Ctrl-C. These are local previews; configure your production host's SPA fallback separately.

Try `/`, `/users/42`, `/users/missing` (loader error), and `/unknown` (catch-all). `src/navigation.typecheck.ts` checks rejected paths and required parameters. Browser checks run from the root with `pnpm example:smoke` after installing Chromium (`pnpm exec playwright install chromium`).

The public dependency lock pins React/React DOM 18.3.1, their types 18.3.31/18.3.7, Vite 6.4.3 and `@vitejs/plugin-react` 4.7.0. This restores the verified example baseline after separate dependency PRs introduced incompatible React and Vite majors. React/React DOM 19.2.8 remains covered by the root tarball consumer suite; the example does not narrow the library's support matrix.

Keep React, React DOM and their types together, and check Vite against both the React plugin and the library's peer range. Dependabot groups compatible updates; major migrations require a coordinated PR with installation, strict types, all bundler builds and browser checks. Security updates remain enabled. See the [dependency update policy](../../docs/contributing/development.md#依赖更新).

Vite's React plugin handles component Fast Refresh; structural routing edits may reload the page. Loaders are client imports and must not contain secrets.

[中文接入指南](../../docs/guide/start/getting-started.md) · [English guide](../../docs/english.md)
